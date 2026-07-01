
import type { NetConnectOptions, NetData } from 'db://ccgf-kit/net/defines/INetStructs';
import { BaseSocket } from 'db://ccgf-kit/net/base/BaseSocket';
import { SocketEvent } from 'db://ccgf-kit/net/base/ISocket.enum';

/**
 * WebSocket协议适配器
 */
export class CocosWebSocketImpl extends BaseSocket {

    private _ws: WebSocket = null!;

    public connect(options: NetConnectOptions): boolean {
        if (this._ws && this._ws.readyState === WebSocket.CONNECTING) {
            H.log.warn("CocosWebSocketImpl" + ": WebSocket is already connecting.");
            return false;
        }

        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            H.log.warn("CocosWebSocketImpl" + ": WebSocket is already open.");
            return false;
        }

        let handledUrl: string = this.getHandledUrl(options);

        if (!handledUrl) {
            return false;
        }

        try {
            this._ws = new WebSocket(handledUrl);
            this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
            this._ws.onopen = (ev: Event) => { this.emit(SocketEvent.CONNECT, ev); };
            this._ws.onclose = (ev: CloseEvent) => { this.emit(SocketEvent.CLOSE, ev); };
            this._ws.onerror = (ev: Event) => { this.emit(SocketEvent.ERROR, ev); };
            this._ws.onmessage = (ev: MessageEvent) => { this.emit(SocketEvent.MESSAGE, ev.data); };
        } catch (error) {
            H.log.error("CocosWebSocketImpl: connect failed, create WebSocket error.", handledUrl, error);
            return false;
        }

        return true;
    }

    public close(code?: number, reason?: string): void {

        if (!this._ws) {
            H.log.warn("CocosWebSocketImpl: close called but WebSocket is not initialized.");
            return;
        }

        this._ws.close(code, reason);

        this.removeAllListeners();

    }

    public send(data: NetData): boolean {
        if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
            H.log.error("CocosWebSocketImpl: send failed, WebSocket is not open.");
            return false;
        }

        this._ws.send(data);
        return true;
    }

    private getHandledUrl(options: NetConnectOptions): string {
        let handledUrl: string = null;
        if (!options.url) {
            handledUrl = `ws://${options.host}:${options.port}`;
        } else {
            handledUrl = options.url;
        }

        if (!handledUrl) {
            H.log.error("CocosWebSocketImpl: connect failed, invalid url.", handledUrl);
        }

        if (handledUrl.indexOf("ws://") !== 0 && handledUrl.indexOf("wss://") !== 0) {
            H.log.error("CocosWebSocketImpl: connect failed, url must start with ws:// or wss://", handledUrl);
            handledUrl = null;
        }

        try {
            new URL(handledUrl);
        } catch (error) {
            H.log.error("CocosWebSocketImpl: connect failed, invalid url.", handledUrl, error);
            handledUrl = null;
        }

        return handledUrl;
    }


}
