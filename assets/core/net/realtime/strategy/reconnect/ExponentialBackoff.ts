import { IReconnectStrategy } from "../IReconnectStrategy";

/**
 * 指数退避重连策略配置
 */
export interface ExponentialBackoffConfig {
    /** 初始重连延迟（毫秒），默认1000ms */
    initialDelay?: number;
    /** 最大重连延迟（毫秒），默认30000ms */
    maxDelay?: number;
    /** 最大重连次数，默认10次，0表示无限次 */
    maxAttempts?: number;
    /** 退避倍数，默认2（每次延迟翻倍） */
    backoffMultiplier?: number;
    /** 是否添加随机抖动，默认true */
    jitter?: boolean;
}

/**
 * 指数退避重连策略
 * 每次重连失败后，等待时间呈指数增长
 */
export class ExponentialBackoff implements IReconnectStrategy {
    private initialDelay: number;
    private maxDelay: number;
    private maxAttempts: number;
    private backoffMultiplier: number;
    private jitter: boolean;

    private currentDelay: number;
    private attemptCount: number = 0;
    private reconnectCallback: () => void = null;
    private timerId: any = null;

    /**
     * @param reconnectCallback 重连回调函数
     * @param config 配置参数
     */
    constructor(reconnectCallback: () => void, config?: ExponentialBackoffConfig) {
        this.reconnectCallback = reconnectCallback;
        this.initialDelay = config?.initialDelay ?? 1000;
        this.maxDelay = config?.maxDelay ?? 30000;
        this.maxAttempts = config?.maxAttempts ?? 10;
        this.backoffMultiplier = config?.backoffMultiplier ?? 2;
        this.jitter = config?.jitter ?? true;
        this.currentDelay = this.initialDelay;
    }

    /**
     * 尝试重连
     */
    public reconnect(): void {
        // 检查是否超过最大重连次数
        if (this.maxAttempts > 0 && this.attemptCount >= this.maxAttempts) {
            H.log.warn(`ExponentialBackoff: 已达到最大重连次数 ${this.maxAttempts}，停止重连`);
            return;
        }

        this.attemptCount++;

        // 计算本次重连延迟
        let delay = this.currentDelay;

        // 添加随机抖动（±25%）
        if (this.jitter) {
            const jitterRange = delay * 0.25;
            delay = delay + (Math.random() * 2 - 1) * jitterRange;
        }

        delay = Math.min(delay, this.maxDelay);

        H.log.info(`ExponentialBackoff: 第 ${this.attemptCount} 次重连，延迟 ${Math.round(delay)}ms`);

        // 清除之前的定时器
        if (this.timerId) {
            M.timeOut.clearTimeout(this.timerId);
        }

        // 延迟后执行重连
        this.timerId = M.timeOut.setTimeout(() => {
            this.reconnectCallback?.();
            // 更新下次延迟时间（指数增长）
            this.currentDelay = Math.min(
                this.currentDelay * this.backoffMultiplier,
                this.maxDelay
            );
        }, delay, this);
    }

    /**
     * 重置重连状态
     * 在连接成功时调用
     */
    public reset(): void {
        this.attemptCount = 0;
        this.currentDelay = this.initialDelay;

        if (this.timerId) {
            M.timeOut.clearTimeout(this.timerId);
            this.timerId = null;
        }

        H.log.info("ExponentialBackoff: 重置重连状态");
    }

    /**
     * 获取当前重连次数
     */
    public getAttemptCount(): number {
        return this.attemptCount;
    }

    /**
     * 是否已达到最大重连次数
     */
    public isMaxAttemptsReached(): boolean {
        return this.maxAttempts > 0 && this.attemptCount >= this.maxAttempts;
    }
}
