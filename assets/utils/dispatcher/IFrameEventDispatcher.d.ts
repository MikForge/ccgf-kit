import type { overflowStrategy } from "db://ccgf-kit/utils/queue/BoundedQueue.enum";

/**
 * 事件调度器选项
 */
export interface FrameEventOptions<T> {

    /** 事件队列最大容量 */
    eventQueueMaxSize: number;
    /** 事件队列 溢出策略 */
    eventQueueOverflowStrategy?: overflowStrategy;
    /** 事件队列溢出回调函数 */
    eventQueueOverflowCallback?: (event: T) => void;

    /** 每帧处理事件数量上限 */
    maxEventsPerFrame: number;
    /** 事件处理函数 */
    eventHandler?: (event: T) => void;
    /** 是否自动启停 */
    autoStartStop?: boolean;
}
