
import type { NetConnectOptions, NetData } from 'db://ccgf-kit/net/defines/net-structs';
import type { ISocket, SocketEventHandler, SocketEventMap } from 'db://ccgf-kit/net/base/ISocket';

import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';

export abstract class BaseSocket implements ISocket {

    /**
     * 事件处理器映射表
     */
    private eventHandlers = new Map<keyof SocketEventMap, Array<SocketEventHandler>>();
    
    /**
     * 连接
     * @param options 
     */
    public abstract connect(options: NetConnectOptions): boolean;

    /**
     * 关闭
     * @param code 错误码
     * @param reason 关闭原因
     */
    public abstract close(code?: number, reason?: string): void;

    /**
     * 发送数据
     * @param data 发送的数据
     */
    public abstract send(data: NetData): boolean;

    public on<K extends keyof SocketEventMap>(event: K, listener: (data: SocketEventMap[K]) => void, context?: any): this {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push({
            listener,
            context,
            once: false
        });
        return this;
    }

    public once<K extends keyof SocketEventMap>(event: K, listener: (data: SocketEventMap[K]) => void, context?: any): this {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push({
            listener,
            context,
            once: true
        });
        return this;
    }

    public off<K extends keyof SocketEventMap>(event: K, listener: (data: SocketEventMap[K]) => void, context?: any): this {
        const handlers = this.eventHandlers.get(event);
        if (!handlers) {
            return this;
        }

        for (let i = handlers.length - 1; i >= 0; i--) {
            const handler = handlers[i];
            if (handler.listener === listener) {
                if (context === undefined || handler.context === context) {
                    handlers.splice(i, 1);
                }
            }
        }

        if (handlers.length === 0) {
            this.eventHandlers.delete(event);
        }

        return this;
    }

    public emit<K extends keyof SocketEventMap>(event: K, data: SocketEventMap[K]): boolean {
        const handlers = this.eventHandlers.get(event);
        if (!handlers || handlers.length === 0) {
            return false;
        }

        const handlersToCall = [...handlers];

        for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i].once) {
                handlers.splice(i, 1);
            }
        }

        if (handlers.length === 0) {
            this.eventHandlers.delete(event);
        }

        handlersToCall.forEach((handler) => {
            try {
                if (handler.context !== undefined) {
                    handler.listener.call(handler.context, data);
                } else {
                    handler.listener(data);
                }
            } catch (error) {
                LogHelper.error(`[BaseAppProtocolAdapter] Error in event handler for "${String(event)}":`, error);
            }
        });

        return true;
    }

    protected removeAllListeners<K extends keyof SocketEventMap>(event?: K): void {
        if (event !== undefined) {
            this.eventHandlers.delete(event);
        } else {
            this.eventHandlers.clear();
        }
    }
}
