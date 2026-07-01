import type { overflowStrategy } from "db://ccgf-kit/utils/queue/BoundedQueue.enum";

/**
 * 有界队列参数
 */
export interface IBoundedQueueOptions<T> {
    /** 队列最大容量 */
    maxSize: number;
    /** 溢出策略 */
    overflowStrategy?: overflowStrategy;
    /** 溢出处理回调 */
    onOverflow?: (item: T) => void;
}
