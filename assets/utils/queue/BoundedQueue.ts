import { Queue } from "db://ccgf-kit/utils/queue/Queue";

/**
 * 队列溢出策略
 */
export enum overflowStrategy {
    /** 丢弃新元素 */
    DROP_NEW,
    /** 丢弃旧元素 */
    DROP_OLD,
    /** 阻塞等待 (慎用 可能会导致死锁) */
    BLOCK,
    /** 抛出异常 */
    THROW_ERROR
}

/**
 * 有界队列参数
 * @author Michael
 * @example
 * const boundedQueue = new BoundedQueue<number>({
 *     maxSize: 3,
 *     overflowStrategy: overflowStrategy.DROP_OLD,
 *     onOverflow: (item) => {
 *         H.log.info("溢出元素:", item);
 *     }
 * })
 */
export interface IBoundedQueueOptions<T> {
    /** 队列最大容量 */
    maxSize: number;
    /** 溢出策略 */
    overflowStrategy?: overflowStrategy;
    /** 溢出处理回调 */
    onOverflow?: (item: T) => void;
}

/**
 * 有界队列
 * @author Michael
 * @example
 */
export class BoundedQueue<T> extends Queue<T> {

    private _maxSize: number;
    private _overflowStrategy: overflowStrategy;
    private _onOverflow?: (item: T) => void;

    constructor(options?: IBoundedQueueOptions<T>) {
        super();
        // 默认最大容量为10
        this._maxSize = 10;
        // 默认溢出策略为抛出异常
        this._overflowStrategy = overflowStrategy.THROW_ERROR;

        if (options) {
            this._maxSize = options.maxSize;
            this._overflowStrategy = options.overflowStrategy
            this._onOverflow = options.onOverflow;
        }

    }

    public enqueue(item: T): boolean {

        if (this.size() >= this._maxSize) {
            return this.handleOverflow(item);
        }

        this._queue.push(item);

        return true;
    }

    /**
     * 入队到队列头部
     * @param item 
     * @returns 
     */
    public enqueueFirst(item: T): boolean {

        if (this.size() >= this._maxSize) {
            return this.handleOverflow(item);
        }

        this._queue.unshift(item);

        return true;
    }


    private handleOverflow(item: T): boolean {
        switch (this._overflowStrategy) {
            case overflowStrategy.DROP_NEW:
                this._onOverflow?.(item);
                return false;
            case overflowStrategy.DROP_OLD:
                const removedItem = this.dequeue();
                this._onOverflow?.(removedItem);
                this._queue.push(item);
                return true;
            case overflowStrategy.BLOCK:
                // 阻塞等待 (慎用 可能会导致死锁)
                while (this.size() >= this._maxSize) {
                    // 等待
                }
                this._queue.push(item);
                return true;
            case overflowStrategy.THROW_ERROR:
                this._onOverflow?.(item);
                throw new Error("BoundedQueue: Queue overflow");
        }

    }

    /**
     * 判断队列是否已满
     * @returns boolean
     */
    public isFull(): boolean {
        return this.size() >= this._maxSize;
    }


    /**
     * 剩余容量
     * @returns number
     */
    public remainingCapacity(): number {
        return this._maxSize - this.size();
    }


    /**
     * 使用率
     * @returns number
     */
    public usageRate(): number {
        // 保留两位小数
        return Math.round((this.size() / this._maxSize) * 100) / 100;
    }


    public remove(predicate: (item: T) => boolean): void {
        this._queue = this._queue.filter(item => !predicate(item));
    }


}
