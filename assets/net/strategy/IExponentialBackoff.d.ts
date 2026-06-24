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
