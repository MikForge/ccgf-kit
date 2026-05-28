import { Singleton } from "db://assets/core/common";

/**
 * 计时器管理器
 */
export class TimeOutMgr extends Singleton<TimeOutMgr> {

    private _timeoutsMap: Map<number, number> = new Map<number, number>();
    private _intervalsMap: Map<number, number> = new Map<number, number>();

    /**
     * 计时任务
     * @param callback 回调函数
     * @param delay 延迟时间（毫秒）
     * @param context 回调函数的作用域
     * @returns 计时任务ID
     * @example
     * // 不传参数
     * M.timeOut.setTimeout(() => { H.log.info("延迟执行"); }, 1000);
     * 
     * // 传递this上下文
     * M.timeOut.setTimeout(this.onTimeout, 1000, this);
     */
    public setTimeout(callback: Function, delay: number, context?: any): number {
        const timeoutId = setTimeout(() => {
            callback.call(context);
            this.clearTimeout(timeoutId);
        }, delay);
        this._timeoutsMap.set(timeoutId, timeoutId);
        return timeoutId;
    }

    /**
     * 清除计时任务
     * @param timeoutId 
     */
    public clearTimeout(timeoutId: number): void {
        if (this._timeoutsMap.has(timeoutId)) {
            clearTimeout(timeoutId);
            this._timeoutsMap.delete(timeoutId);
        }
    }

    /**
     * 清除所有计时任务
     */
    public clearAllTimeouts(): void {
        this._timeoutsMap.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this._timeoutsMap.clear();
    }

    /**
     * 消除 idlist 中的所有计时任务
     * @param idlist 计时任务ID列表
     * @example 用于组件生命周期销毁时，清除相关的计时任务
     */
    public clearTimeoutsByIdList(idlist: number[]): void {
        idlist.forEach((timeoutId) => {
            this.clearTimeout(timeoutId);
        });
    }

    /**
     * 周期定时任务
     * @param callback 回调函数
     * @param delay 周期间隔（毫秒）
     * @param context 回调函数的作用域
     * @returns 周期任务ID
     */
    public setInterval(callback: Function, delay: number, context?: any): number {
        const intervalId = setInterval(() => {
            callback.call(context);
        }, delay);
        this._intervalsMap.set(intervalId, intervalId);
        return intervalId;
    }

    /**
     * 清除周期定时任务
     * @param intervalId
     */
    public clearInterval(intervalId: number): void {
        if (this._intervalsMap.has(intervalId)) {
            clearInterval(intervalId);
            this._intervalsMap.delete(intervalId);
        }
    }

    /**
     * 清除所有周期定时任务
     */
    public clearAllIntervals(): void {
        this._intervalsMap.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this._intervalsMap.clear();
    }
}