import type { NetConnectOptions, NetData } from 'db://ccgf-kit/net/defines/net-structs';
import { SocketEvent } from 'db://ccgf-kit/net/base/ISocket.enum';

export interface SocketEventMap {
    [SocketEvent.CONNECT]: Event;
    [SocketEvent.CLOSE]: CloseEvent;
    [SocketEvent.ERROR]: Event;
    [SocketEvent.MESSAGE]: NetData;
}

/**
 * 事件处理器信息
 */
export interface SocketEventHandler {
    /** 回调函数 */
    listener: Function;
    /** 上下文（this 绑定） */
    context?: any;
    /** 是否只执行一次 */
    once?: boolean;
}

/**
 * 应用协议适配器接口
 */
export interface ISocket {

    /** 连接 */
    connect(options: NetConnectOptions): boolean;

    /** 关闭 */
    close(code?: number, reason?: string): void;

    /** 发送数据 */
    send(data: NetData): boolean;

    /** 事件监听 */
    on<K extends keyof SocketEventMap>(event: K, listener: (data: SocketEventMap[K]) => void, context?: any): this;

    /** 事件监听（只执行一次） */
    once<K extends keyof SocketEventMap>(event: K, listener: (data: SocketEventMap[K]) => void, context?: any): this;

    /** 事件移除 */
    off<K extends keyof SocketEventMap>(event: K, listener?: (data: SocketEventMap[K]) => void, context?: any): this;

    /** 事件触发 */
    emit<K extends keyof SocketEventMap>(event: K, data?: SocketEventMap[K]): boolean;
}
