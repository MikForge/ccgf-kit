/**
 * 队列
 * @author Michael
 * @example
 * const queue = new Queue<number>();
 * queue.enqueue(1);
 * queue.enqueue(2);
 * H.log.info(queue.dequeue()); // 输出: 1
 * H.log.info(queue.size()); // 输出: 1
 * H.log.info(queue.isEmpty()); // 输出: false
 * queue.clear();
 * H.log.info(queue.isEmpty()); // 输出: true
 */
export class Queue<T> {

    /** 队列 */
    protected _queue: T[] = [];

    /**
     * 入队
     * @param item 
     */
    public enqueue(item: T): boolean {
        this._queue.push(item);
        return true;
    }

    /**
     * 出队
     * @returns 
     */
    public dequeue(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this._queue.shift()!;
    }

    /**
     * 是否为空
     * @returns 
     */
    public isEmpty(): boolean {
        return this._queue.length === 0;
    }

    /**
     * 获取队列长度
     * @returns 
     */
    public size(): number {
        return this._queue.length;
    }

    /**
     * 清空队列
     */
    public clear(): void {
        this._queue = [];
    }

    /**
     * 查找符合条件的元素
     * @param predicate 
     * @returns item | null
     * @example
     * const queue = new Queue<number>();
     * queue.enqueue(1);
     * queue.enqueue(2);
     * queue.enqueue(3);
     * const foundItem = queue.find(item => item === 2);
     * H.log.info(foundItem); // 输出: 2
     */
    public find(predicate: (item: T) => boolean): T | null {
        return this._queue.find(predicate) || null;
    }

    /**
     * 是否存在符合条件的元素 返回bool值
     * @param predicate 
     * @returns boolean
     * @example
     * const queue = new Queue<number>();
     * queue.enqueue(1);
     * queue.enqueue(2);
     * const exists = queue.some(item => item === 2);
     * H.log.info(exists); // 输出: true   
     */
    public some(predicate: (item: T) => boolean): boolean {
        return this._queue.some(predicate);
    }

    /**
     * 过滤符合条件的元素
     * @param predicate 
     * @returns T[]
     * @example
     * const queue = new Queue<number>();
     * queue.enqueue(1);
     * queue.enqueue(2);
     * queue.enqueue(3);
     * const filteredItems = queue.filter(item => item > 1);
     * H.log.info(filteredItems); // 输出: [2, 3]
     */
    public filter(predicate: (item: T) => boolean): T[] {
        return this._queue.filter(predicate);
    }

    /**
     * 转为数组 只读
     * @returns 
     * @example
     * const queue = new Queue<number>();
     * queue.enqueue(1);
     * queue.enqueue(2);
     * const array = queue.toArray();
     * H.log.info(array); // 输出: [1, 2]
     */
    public toArray(): readonly T[] {
        return this._queue;
    }

    /**
     * 深拷贝转为数组
     * 注意：性能开销较大，仅在必要时使用
     * 注意：仅适用于可序列化对象
     * 注意：不支持函数、循环引用等复杂数据结构
     * @returns 
     */
    public toArrayDeep(): T[] {
        return structuredClone(this._queue);
    }

}