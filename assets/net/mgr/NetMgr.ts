import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { CoreEvents } from 'db://ccgf-kit/event/CoreEvents.enum';
import { ErrorHandlerInterceptor, HttpLogInterceptor, HttpTokenInterceptor } from 'db://ccgf-kit/net-http/base/http-interceptors';
import { HttpClient } from 'db://ccgf-kit/net-http/impl/HttpClient';
import type { NetConnectOptions, NetData, RequestObject } from 'db://ccgf-kit/net/defines/net-structs';
import { NetSession } from 'db://ccgf-kit/net/NetSession';
import { NetChannelType } from 'db://ccgf-kit/net/defines/net.enum';

/** 网络管理器 */
export class NetMgr extends Singleton<NetMgr> {

    private _httpClient: HttpClient = null!;

    /** token拦截器 */
    private tokenInterceptor: HttpTokenInterceptor | null = null;

    protected _channels: Map<number, NetSession> = new Map<number, NetSession>();

    /**
     * 设置网络会话
     * @param channelId 通道ID
     * @example
    * const netSession = new NetSession();
    * const netSocket = new CocosWebSocketImpl("ws://example.com/game");
    * const packetHandler = new ProtobufPacketHandler();
    * const networkTips:INetworkTips = null;
    * const inFlightTracker = new InFlightTracker();
    * netSession.init(netSocket, packetHandler, networkTips, inFlightTracker);
    * NetMgr.getInstance().setNetSession(NetChannelType.GAME, netSession);
    */
    public setNetSession(channelId: number, session: NetSession) {
        this._channels.set(channelId, session);
    }

    /**
     * 删除网络会话
     * @param channelId 通道ID
     */
    public removeNetSession(channelId: number) {
        this._channels.delete(channelId);
    }

    /**
     * 连接网络会话
     * @param channelId 通道ID
     */
    public connectNetSession(channelId: number, options: NetConnectOptions): boolean {

        if (!this._channels.has(channelId)) {
            H.log.error(`NetMgr: No NetSession found for channelId ${channelId}`);
            return false;
        }

        return this._channels.get(channelId)?.connect(options) ?? false;
    }

    /**
     * 便捷连接方法，使用已注册 session 的 connectOptions
     * @param channelId 通道ID，默认 NetChannelType.DEFAULT (0)
     */
    public connect(channelId: number = NetChannelType.DEFAULT): void {
        const session = this._channels.get(channelId);
        if (!session) {
            H.log.error(`NetMgr: No NetSession found for channelId ${channelId}`);
            M.event.emit(CoreEvents.NET_DISCONNECTED, {
                reason: 'Session not configured',
                code: -2,
            });
            return;
        }

        const options = session.getConnectOptions();
        if (!options) {
            H.log.error(`NetMgr: No connect options for channelId ${channelId}`);
            M.event.emit(CoreEvents.NET_DISCONNECTED, {
                reason: 'Session not configured',
                code: -2,
            });
            return;
        }

        this.connectNetSession(channelId, options);
    }

    /**
     * 关闭网络会话
     * @param channelId 通道ID
     */
    public closeNetSession(channelId: number) {
        this._channels.get(channelId)?.close();
    }

    /**
     * 发送 
     * 直接发送原始二进制数据（NetData）
     * 不关心响应，不支持回调
     * 框架内部用于发送心跳包、已封装好的数据
     * @param channelId 通道ID
     * @param data 数据
     */
    public send(channelId: number, data: NetData) {
        this._channels.get(channelId)?.send(data);
    }


    /**
     * 发送请求
     * @param channelId 通道ID
     * @param requestInfo 请求对象
     * @example
     * NetMgr.getInstance().sendRequest(NetChannelType.GAME, {
     *     buffer: someNetData,
     *     rspCmd: "response_command"
     * });  
     */
    public sendRequest(channelId: number, requestInfo: RequestObject) {
        this._channels.get(channelId)?.request(requestInfo);
    }

    /**
     * 发起唯一请求，防止重复发送相同命令的请求
     * @param channelId 通道ID
     * @param requestInfo 请求对象
     * @returns 是否发送成功
     * @example
     * NetMgr.getInstance().sendUniqueRequest(NetChannelType.GAME, {
     *     buffer: someNetData,
     *     rspCmd: "response_command"
     * });
     */
    public sendUniqueRequest(channelId: number, requestInfo: RequestObject): boolean {
        return this._channels.get(channelId)?.requestUnique(requestInfo) ?? false;
    }

    /**
     * 分帧更新
     */
    public update(dt: number): void {
        this._channels.forEach((session) => {
            session.update(dt);
        });
    }



    public get http(): HttpClient {

        if (!this._httpClient) {
            this.initHttpClient();
        }

        return this._httpClient;
    }

    private initHttpClient(): void {

        this._httpClient = HttpClient.getInstance();

        // 注册拦截器
        if (!this.tokenInterceptor) {
            this.tokenInterceptor = new HttpTokenInterceptor();
        }
        this._httpClient.registerRequestInterceptor(this.tokenInterceptor);
        this._httpClient.registerRequestInterceptor(new HttpLogInterceptor());
        this._httpClient.registerResponseInterceptor(new HttpLogInterceptor());
        this._httpClient.registerResponseInterceptor(new ErrorHandlerInterceptor());
    }


    public setHttpToken(token: string): void {

        if (!this.tokenInterceptor) {
            this.tokenInterceptor = new HttpTokenInterceptor();
        }
        if (!this._httpClient) {
            this.initHttpClient();
        }

        this.tokenInterceptor.setToken(token);

    }

}
