import { RequestObject } from "../defines/net-structs";

export interface InFlightRequest {
    request: RequestObject;
    sendTime?: number;
    timeout?: number;
    replayOnReconnect?: boolean;
    onSuccess?: (response: any) => void;
    onError?: (err: Error) => void;
}


/**
 * 请求中的消息跟踪器
 * 负责跟踪在途请求，处理超时和重发逻辑
 * @export
 * @class InFlightTracker
 */
export class InFlightTracker {

    private _inFlightRequests: Map<string, InFlightRequest> = new Map();
    private checkTimer: number = null;

    constructor() {
    }

    /**
     * 添加请求到在途请求表
     * @param req 
     */
    public addRequest(req: InFlightRequest): void {
        req.sendTime = Date.now();
        req.timeout = req.timeout || 5000; // 默认超时5秒
        req.replayOnReconnect = req.replayOnReconnect || false;

        if (!req.onSuccess) {
            req.onSuccess = (rspData: any) => {
                req.request.callback?.(rspData);
                this.removeRequest(req.request.rspCmd);
            }
        }
        if (!req.onError) {
            req.onError = (err: Error) => {
                H.log.error("InFlightTracker: request error", err);
                this.removeRequest(req.request.rspCmd);
            }
        }
        this._inFlightRequests.set(req.request.rspCmd, req);
    }

    /**
     * 移除在途请求
     * @param  
     */
    public removeRequest(rspCmd: string): boolean {
        return this._inFlightRequests.delete(rspCmd);
    }

    public hasRequest(rspCmd: string): boolean {
        return this._inFlightRequests.has(rspCmd);
    }

    /**
     * 获取在途请求
     * @param rspCmd 
     * @returns 
     */
    public getRequest(rspCmd: string): InFlightRequest | undefined {
        return this._inFlightRequests.get(rspCmd);
    }

    /**
     * 获取所有在途请求
     * @returns 
     */
    public getAllRequests(): InFlightRequest[] {
        return Array.from(this._inFlightRequests.values());
    }

    /**
     * 超时检查
     */
    public startTimeoutCheck(): void {

        const now = Date.now();

        for (const [rspCmd, inFlight] of this._inFlightRequests.entries()) {
            const elapsed = now - inFlight.sendTime;

            if (elapsed > inFlight.timeout) {
                // 从跟踪器中移除
                this._inFlightRequests.delete(rspCmd);

                // 通知超时
                if (inFlight.onError) {
                    inFlight.onError(new Error("Request timed out"));
                }
            }
        }
    }

    public destroy(): void {
        if (this.checkTimer !== null) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        this._inFlightRequests.clear();
    }


    public clear(): void {
        this._inFlightRequests.clear();
    }

}