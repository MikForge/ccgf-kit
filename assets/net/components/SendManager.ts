import type { NetData, RequestObject } from 'db://ccgf-kit/net/defines/net-structs';
import { InFlightTracker } from 'db://ccgf-kit/net/components/InFlightTracker';
import { BoundedQueue } from 'db://ccgf-kit/utils/queue/BoundedQueue';
import { overflowStrategy } from 'db://ccgf-kit/utils/queue/BoundedQueue.enum';
import type { ISocket } from 'db://ccgf-kit/net/base/ISocket';
import { NetSessionState } from 'db://ccgf-kit/net/defines/net.enum';

/**
 * 发送管理器
 * 职责：统一处理发送逻辑（状态检查 + 缓存 + 请求跟踪）
 */
export class SendManager {
    private net: ISocket;
    private inFlightTracker: InFlightTracker;
    private getState: () => NetSessionState;

    private sendBuffer: BoundedQueue<RequestObject>;

    constructor(
        net: ISocket,
        inFlightTracker: InFlightTracker,
        getState: () => NetSessionState,
        bufferSize: number = 100  // 缓冲区大小
    ) {
        this.net = net;
        this.inFlightTracker = inFlightTracker;
        this.getState = getState;

        // 创建发送缓冲区
        this.sendBuffer = new BoundedQueue<RequestObject>({
            maxSize: bufferSize,
            overflowStrategy: overflowStrategy.DROP_NEW,
            onOverflow: (item: RequestObject) => {
                H.log.warn("SendManager: sendBuffer overflow, dropped item:", item);
            }
        });
    }

    /**
     * Normal  普通单向消息
     * 1.心跳包
     * 2.客户端状态上报 （player 空间位置）
     * 3.服务端广播消息（其他玩家状态）
     * 4.非关键业务消息（聊天、表情等）
     * 5.日志上报
     * 6.实时语音数据
     * @param data 数据
     */
    public send(data: NetData): boolean {

        const currentState = this.getState();

        switch (currentState) {
            case NetSessionState.WORKING:
                // 直接发送
                return this.net.send(data);

            case NetSessionState.CLOSED:
                H.log.error("SendManager", "send failed, connection is closed.");
                return false;
            case NetSessionState.CHECKING:
            case NetSessionState.CONNECTING:
                //不缓存消息
                H.log.info("SendManager", "connection not ready, message buffered.");
            default:
                return false;
        }

    }

    /**
     * 发送请求 不带去重
     * @param requestInfo 请求信息
     * 1.登录请求
     * 2.获取用户信息
     * 3.批量操作（允许并发）
     * 4.关键业务请求（购买道具、任务完成等）
     * 5.实时战斗指令（快速连续技能）
     */
    public request<T>(requestInfo: RequestObject<T>): void {
        const currentState = this.getState();

        switch (currentState) {
            case NetSessionState.WORKING:
                // 记录请求（用于超时检测和响应匹配）
                this.inFlightTracker.addRequest({
                    request: requestInfo
                });

                // 发送数据
                const ret = this.net.send(requestInfo.buffer);

                if (!ret) {
                    // 发送失败，移除跟踪
                    this.inFlightTracker.removeRequest(requestInfo.rspCmd);
                }
                break;

            case NetSessionState.CHECKING:
            case NetSessionState.CONNECTING:
                // 缓存请求
                H.log.info("SendManager", "连接未就绪，请求已缓存");
                this.sendBuffer.enqueue(requestInfo);
                break;

            case NetSessionState.CLOSED:
                H.log.error("SendManager", "request failed, connection is closed.");
                break;
        }
    }

    /**
     * 发送唯一请求（去重）
     * @param requestInfo 请求信息
     * @returns boolean
     * 1. 进入副本（防重复点击）
     * 2. 购买道具（防重复购买）
     * 3. 提交任务（防重复提交）
     * 4. 创建角色（防重复创建）
     * 5. 充值请求（防重复充值）
     * 6. 匹配对战（防重复匹配）
     * 7. 领取每日奖励（防重复领取）
     */
    public requestUnique(requestInfo: RequestObject): boolean {

        if (!requestInfo.rspCmd) {
            H.log.error("SendManager", "requestUnique failed, rspCmd is required for uniqueness check.");
            return false;
        }

        if (this.inFlightTracker.hasRequest(requestInfo.rspCmd)) {
            H.log.warn("SendManager", `请求 ${requestInfo.rspCmd} 已在发送中，忽略重复请求`);
            return false;
        }

        if (this.sendBuffer.find(item => item.rspCmd === requestInfo.rspCmd)) {
            H.log.warn("SendManager", `请求 ${requestInfo.rspCmd} 已在发送缓冲区中，忽略重复请求`);
            return false;
        }
       
        const currentState = this.getState();

        if (currentState === NetSessionState.CLOSED) {
            H.log.error("SendManager", "requestUnique failed, connection is closed.");
            return false;
        }


        this.request(requestInfo);

        return true;
    }

    /**
     * 刷新发送缓冲区（连接成功后发送缓存的消息）
     */
    public flushBuffer(): void {
        const count = this.sendBuffer.size();

        if (count === 0) {
            return;
        }

        H.log.info("SendManager", `刷新发送缓冲区，待发送 ${count} 条消息`);

        // 逐个发送缓存的数据
        while (!this.sendBuffer.isEmpty()) {
            const data = this.sendBuffer.dequeue();
            if (data) {
                this.request(data);
            }
        }
    }

    /**
     * 清空缓冲区
     */
    public clearBuffer(): void {
        this.sendBuffer.clear();
    }

    /**
     * 获取缓冲区大小
     */
    public getBufferSize(): number {
        return this.sendBuffer.size();
    }

    /**
     * 清理（清空缓冲 + 清空跟踪）
     */
    public clear(): void {
        this.clearBuffer();
        this.inFlightTracker?.clear();
    }
}
