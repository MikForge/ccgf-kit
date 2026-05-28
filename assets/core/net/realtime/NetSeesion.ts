import { INetworkTips, NetConnectOptions, NetData, NetSateCfg, RequestObject } from "./defines/net-structs";
import { IPacketHandler, IRequestPacket, IResponsePacket } from "./base/IPacketHandler";
import { error } from "cc";
import { FrameEventDispatcher, FrameEventOptions } from "db://assets/core/utils";
import { InFlightTracker } from "./components/InFlightTracker";
import { IHeartbeatStrategy } from "./strategy/IHeartbeatStrategy";
import { IReconnectStrategy } from "./strategy/IReconnectStrategy";
import { MessagePipeline } from "./components/MessagePipeline";
import { SendManager } from "./components/SendManager";
import { ConnectionLifecycle } from "./components/ConnectionLifecycle";
import { FixedHeartbeat } from "./strategy/heartbeat/FixedHeartbeat";
import { ExponentialBackoff, ExponentialBackoffConfig } from "./strategy/reconnect/ExponentialBackoff";
import { ISocket } from "./base/ISocket";
import { NetErrorCode, NetSessionEvent, NetSessionState } from "./defines/net.enum";
import { CoreEvents } from 'db://assets/core/event';



const ErrMap: Partial<Record<NetErrorCode, string>> = {
    [NetErrorCode.SOCKET_CLOSED]: "socket closed normally",
    [NetErrorCode.SOCKET_ERROR]: "socket error occurred",
    [NetErrorCode.HEARTBEAT_TIMEOUT]: "heartbeat timeout",
    [NetErrorCode.AUTH_FAILED]: "authentication failed",
};

/** 获取错误描述 */
function getErrorReason(code?: number, defaultReason?: string): string {
    return defaultReason || ErrMap[code] || `Unknown error: ${code}`;
}

/**
 * 网络会话类
 * 职责：门面模式 - 对外提供统一接口，内部委托给各个组件
 */
export class NetSession {
    /** 网络应用层 */
    protected _net: ISocket = null!;
    /** 协议层 - 协议包体处理器 */
    protected _packeter: IPacketHandler = null!;
    /** 业务回调层 - 网络提示接口 */
    protected _networkTips: INetworkTips = null!;
    /**  连接参数 */
    private options: NetConnectOptions = null!;

    /** 请求跟踪器 */
    private inFlightTracker: InFlightTracker = null!;
    /** 事件分发器 */
    private dispatcher: FrameEventDispatcher<IResponsePacket> = null!;

    /** 心跳策略 */
    private heartbeatStrategy: IHeartbeatStrategy = null!;
    /** 重连策略 */
    private reconnectStrategy: IReconnectStrategy = null!;

    /** 接收超时重置计时器 ID */
    private resetReceiveTimerId: number = null!;
    /** 接收超时重置时间，单位毫秒 */
    private readonly RESET_RECEIVE_TIMEOUT = 600000; // 10 分钟
    /** 心跳间隔周期，单位毫秒 */
    private readonly HEARTBEAT_INTERVAL = 30000; // 30 秒

    // ========== 重连策略参数 ==========
    /** 初始重连延迟，单位毫秒 */
    private readonly RECONNECT_INITIAL_DELAY = 1000; // 1 秒
    /** 最大重连延迟，单位毫秒 */
    private readonly RECONNECT_MAX_DELAY = 30000; // 30 秒
    /** 重连延迟倍数（指数退避） */
    private readonly RECONNECT_BACKOFF_MULTIPLIER = 2;
    /** 是否启用重连抖动 */
    private readonly RECONNECT_JITTER = true;

    /** 鉴权函数 */
    protected _authCallback: (() => void) | null = null;

    // ========== 组件 ==========
    /** 消息处理管道 */
    private messagePipeline: MessagePipeline = null!;
    /** 发送管理器 */
    private sendManager: SendManager = null!;
    /** 连接生命周期管理器 */
    private connectionLifecycle: ConnectionLifecycle = null!;

    // ========== 状态机 ==========
    private _netState: NetSessionState = NetSessionState.CLOSED;
    private readonly NetFsm: Record<NetSessionState, NetSateCfg> = {
        [NetSessionState.CLOSED]: {
            onEnter: () => {
                this.getNetworkTips()?.connectTips?.(false);
                this.stopHeartbeat();
                // 清理接收超时定时器
                if (this.resetReceiveTimerId !== null) {
                    M.timeOut.clearTimeout(this.resetReceiveTimerId);
                    this.resetReceiveTimerId = null!;
                }
                H.log.info("NetSession: 进入 CLOSED 状态");
                if (this.checkNeedAutoReconnect()) {
                    this.triggerReconnect();
                }
            },
            onExit: () => { },
            on: {
            }
        },
        [NetSessionState.WORKING]: {
            onEnter: () => {
                this.resetReconnect();
                this.startHeartbeat();
                // 启动接收超时检测
                this.resetReceiveTimeoutTimer();
                // 如果有鉴权回调，说明已经鉴权成功，可以发送缓存数据
                // 如果没有鉴权回调，直接连接成功也可以发送
                this.flushBuffer();
                this.getNetworkTips()?.connectTips?.(true);
                H.log.info("NetSession: 进入 WORKING 状态，连接就绪");
            },
            onExit: () => { },
            on: {}
        },
        [NetSessionState.CHECKING]: {
            onEnter: () => {
                H.log.info("NetSession: 进入 CHECKING 状态，开始鉴权");
                this._authCallback?.();
            },
            onExit: () => { },
            on: {}
        },
        [NetSessionState.CONNECTING]: {
            onEnter: () => {
                this.getNetworkTips()?.connectTips?.(false);
                H.log.info("NetSession: 进入 CONNECTING 状态");
            },
            onExit: () => { },
            on: {}
        },
    };

    private handleStateTransition(nextState: NetSessionState) {
        if (this._netState === nextState) {
            H.log.warn(`NetSession: 状态转换被忽略，已处于 ${nextState} 状态`);
            return;
        }

        const prevState = this._netState;
        H.log.info(`NetSession: 状态转换: ${prevState} -> ${nextState}`);

        // 退出当前状态
        const currentStateCfg = this.NetFsm[this._netState];
        currentStateCfg.onExit?.();

        // 进入下一个状态
        this._netState = nextState;
        const nextStateCfg = this.NetFsm[this._netState];
        nextStateCfg.onEnter?.();
    }

    private handleFsmEvent(event: NetSessionEvent, ...args: any[]) {
        const handler = this.NetFsm[this._netState].on[event];

        if (!handler) {
            H.log.warn("NetSession: handleFsmEvent", `状态 ${this._netState} 不处理事件 ${event}`);
            return;
        }

        try {
            handler(...args);
        } catch (err) {
            H.log.error("NetSession: handleFsmEvent error", err);
        }
    }

    /**
     * 初始化
     */
    public init(
        net: ISocket,
        packetHandler: IPacketHandler,
        networkTips: INetworkTips,
        inFlightTracker: InFlightTracker
    ) {
        this._net = net;
        this._packeter = packetHandler;
        this._networkTips = networkTips;

        this.inFlightTracker = inFlightTracker;

        this.dispatcher = new FrameEventDispatcher<IResponsePacket>({
            maxEventsPerFrame: 50,
            eventQueueMaxSize: 1000,
            eventHandler: (event: IResponsePacket) => {
                // 分发响应包事件给业务层
                // this.inFlightTracker.handleResponse(event);
            }
        });

        // 创建组件
        this.messagePipeline = new MessagePipeline(
            this._packeter,
            this.inFlightTracker,
            this.dispatcher
        );

        this.sendManager = new SendManager(
            this._net,
            this.inFlightTracker,
            () => this.getCurState()
        );

        this.connectionLifecycle = new ConnectionLifecycle(
            this._net,
            this.onConnected.bind(this),
            this.onMessage.bind(this),
            this.onError.bind(this),
            this.onClose.bind(this)
        );

        this.heartbeatStrategy = new FixedHeartbeat(this.HEARTBEAT_INTERVAL, () => {
            const heartbeatPacket: NetData = this._packeter.getHeartbeatPacket();
            this.sendManager.send(heartbeatPacket);
            H.log.info("NetSession: 发送心跳包");
        });

        // 重连策略将在 connect 时初始化

    }

    /**
     * 连接服务器
     */
    public connect(options: NetConnectOptions): boolean {

        if (this.getCurState() !== NetSessionState.CLOSED) {
            H.log.warn("NetSession: 已有连接存在，无法重复连接");
            return false;
        }

        if (!this.connectionLifecycle.isInitialized()) {
            this.connectionLifecycle.init();
        }

        this.options = options;

        this.initReconnectStrategy();

        H.log.info("NetSession: 开始连接服务器", options);

        this.handleStateTransition(NetSessionState.CONNECTING);

        if (!this._net) {
            H.log.error("NetSession: _net is null");
            this.handleStateTransition(NetSessionState.CLOSED);
            return false;
        }

        const ret = this._net.connect(this.options);

        if (!ret) {
            H.log.error("NetSession: connect failed");
            this.handleStateTransition(NetSessionState.CLOSED);
            return ret;
        }

        return ret;
    }

    /**
     * 关闭连接
     */
    public close(code?: number, reason?: string) {
        reason = getErrorReason(code, reason);

        H.log.info("NetSession: closing connection", { code, reason });

        // 停止心跳
        this.stopHeartbeat();

        // 清理接收超时定时器
        if (this.resetReceiveTimerId !== null) {
            M.timeOut.clearTimeout(this.resetReceiveTimerId);
            this.resetReceiveTimerId = null!;
        }

        // 清理缓冲区
        this.clearBuffers();

        // 关闭底层连接
        if (this._net) {
            this._net.close(code, reason);
        }

        // 切换状态（必须在 emit 之前，确保重试时 session 已处于 CLOSED 可重连状态）
        this.handleStateTransition(NetSessionState.CLOSED);

        // 发送断开连接事件
        M.event.emit(CoreEvents.NET_DISCONNECTED, { reason, code });
    }

    /** 
     * 发送数据
     */
    public send(data: NetData): boolean {
        return this.sendManager.send(data);
    }

    /**
     * 发送请求（带跟踪）
     */
    public request(requestInfo: RequestObject): void {
        this.sendManager.request(requestInfo);
    }

    /**
     * 发送唯一请求
     */
    public requestUnique(requestInfo: RequestObject): boolean {
        return this.sendManager.requestUnique(requestInfo);
    }

    // ========== 网络事件回调 ==========

    protected onConnected(ev: Event) {
        if (this._authCallback != null) {
            this.handleStateTransition(NetSessionState.CHECKING);
        } else {
            this.handleStateTransition(NetSessionState.WORKING);
            M.event.emit(CoreEvents.NET_CONNECTED);
        }
    }

    protected onMessage(data: NetData) {

        H.log.info("NetSession: 收到数据包");

        // 重置接收超时计时器（长期静默检测）
        this.resetReceiveTimeoutTimer();

        // 收到消息，重置心跳
        this.resetHeartbeat();

        // 处理消息
        this.messagePipeline.processRawData(data);
    }

    protected onError(ev: Event) {
        H.log.error("NetSession: socket error", ev);
        this.close(NetErrorCode.SOCKET_ERROR);
    }

    protected onClose(ev: CloseEvent) {
        H.log.info("NetSession: socket closed", ev);
        this.close(NetErrorCode.SOCKET_CLOSED);
    }

    // ========== 供状态机调用的接口 ==========

    private getCurState(): NetSessionState {
        return this._netState;
    }

    public getConnectOptions(): NetConnectOptions {
        return this.options;
    }

    public checkNeedAutoReconnect(): boolean {
        const currentState = this.getCurState();
        const needReconnect = currentState === NetSessionState.CLOSED &&
            this.options?.autoReconnect !== 0;
        return needReconnect
    }

    public startHeartbeat(): void {
        this.heartbeatStrategy?.start();
    }

    public stopHeartbeat(): void {
        this.heartbeatStrategy?.stop();
    }

    public resetHeartbeat(): void {
        this.heartbeatStrategy?.reset();
    }

    public triggerReconnect(): void {
        this.reconnectStrategy?.reconnect();
    }

    /** 重置重连策略 */
    public resetReconnect(): void {
        this.reconnectStrategy?.reset();
    }

    public clearBuffers(): void {
        this.sendManager?.clear();
        this.messagePipeline?.clear();
    }

    public flushBuffer(): void {
        this.sendManager.flushBuffer();
    }

    public getNetworkTips(): INetworkTips {
        return this._networkTips;
    }

    public update(dt: number): void {

        this.heartbeatStrategy?.update?.(dt);

        this.inFlightTracker?.startTimeoutCheck();

        this.dispatcher?.update(dt);
    }

    /**
     * 重置接收超时计时器
     * @description 用于在收到服务器消息时调用，防止长期无消息导致连接假死
     * 与心跳机制形成双重保险：心跳检测短期健康，接收超时检测长期静默
     */
    protected resetReceiveTimeoutTimer(): void {
        if (this.resetReceiveTimerId !== null) {
            M.timeOut.clearTimeout(this.resetReceiveTimerId);
            this.resetReceiveTimerId = null;
        }

        this.resetReceiveTimerId = M.timeOut.setTimeout(() => {
            H.log.warn("NetSession: 接收超时，长期无服务器消息");
            this.close(NetErrorCode.HEARTBEAT_TIMEOUT);
            this.resetReceiveTimerId = null;
        }, this.RESET_RECEIVE_TIMEOUT, this);
    }



    /**
     * 设置鉴权回调
     * @param authCallback 
     * @example
     * netSession.setAuthCallback(() => {
     *     // 发送鉴权请求
     *     netSession.request({
     *         cmd: "auth",
     *         data: { token: "your_auth_token" },
     *         callback: (response) => {
     *             if (response.success) {
     *                 netSession.hanledAuthSuccess();
     *             } else {
     *                 netSession.hanledAuthFailed();
     *             }
     *         }
     *     });
     */
    public setAuthCallback(authCallback: () => void): void {
        this._authCallback = authCallback;
    }

    public hanledAuthSuccess(): void {
        this.handleStateTransition(NetSessionState.WORKING);
        M.event.emit(CoreEvents.NET_CONNECTED);
    }

    public hanledAuthFailed(): void {
        this.close(NetErrorCode.AUTH_FAILED);
    }


    public onReconnectCallBack(): void {
        if (!this.checkNeedAutoReconnect()) {
            H.log.info("NetSession: 不需要自动重连，取消重连");
            return;
        }

        if (!this.options) {
            H.log.error("NetSession: 重连失败，连接参数缺失");
            return;
        }

        H.log.info("NetSession: 尝试重连...");

        this.connect(this.options);
    }


    private initReconnectStrategy(): void {
        const reconnectOp: ExponentialBackoffConfig = {
            initialDelay: this.RECONNECT_INITIAL_DELAY,
            maxDelay: this.RECONNECT_MAX_DELAY,
            backoffMultiplier: this.RECONNECT_BACKOFF_MULTIPLIER,
            jitter: this.RECONNECT_JITTER,
            maxAttempts: this.options.autoReconnect ?? 0,
        };
        this.reconnectStrategy = new ExponentialBackoff(this.onReconnectCallBack.bind(this), reconnectOp);
    }
}   