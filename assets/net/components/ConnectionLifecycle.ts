
import type { NetData } from 'db://ccgf-kit/net/defines/net-structs';
import type { ISocket } from 'db://ccgf-kit/net/base/ISocket';
import { SocketEvent } from 'db://ccgf-kit/net/base/ISocket.enum';

import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
/**
 * 连接生命周期管理器
 * 职责：管理底层网络适配器的事件监听和回调转发
 */
export class ConnectionLifecycle {
    private net: ISocket;
    private onConnectedCb: (ev: Event) => void;
    private onMessageCb: (data: NetData) => void;
    private onErrorCb: (ev: Event) => void;
    private onCloseCb: (ev: CloseEvent) => void;
    private initialized: boolean = false;

    constructor(
        net: ISocket,
        onConnected: (ev: Event) => void,
        onMessage: (data: NetData) => void,
        onError: (ev: Event) => void,
        onClose: (ev: CloseEvent) => void
    ) {
        this.net = net;
        this.onConnectedCb = onConnected;
        this.onMessageCb = onMessage;
        this.onErrorCb = onError;
        this.onCloseCb = onClose;
    }

    /**
     * 初始化网络事件监听
     */
    public init(): void {
        if (this.initialized) {
            LogHelper.warn("ConnectionLifecycle: 已经初始化过了");
            return;
        }

        if (!this.net) {
            LogHelper.error("ConnectionLifecycle: AppProtocolAdapter is null.");
            return;
        }

        this.net.on(SocketEvent.CONNECT, this.onConnectedCb);
        this.net.on(SocketEvent.MESSAGE, this.onMessageCb);
        this.net.on(SocketEvent.ERROR, this.onErrorCb);
        this.net.on(SocketEvent.CLOSE, this.onCloseCb);

        this.initialized = true;
    }

    /**
     * 销毁事件监听
     */
    public destroy(): void {
        if (!this.initialized) {
            return;
        }

        this.net.off(SocketEvent.CONNECT, this.onConnectedCb);
        this.net.off(SocketEvent.MESSAGE, this.onMessageCb);
        this.net.off(SocketEvent.ERROR, this.onErrorCb);
        this.net.off(SocketEvent.CLOSE, this.onCloseCb);

        this.initialized = false;
    }

    /**
     * 检查是否已初始化
     */
    public isInitialized(): boolean {
        return this.initialized;
    }
}
