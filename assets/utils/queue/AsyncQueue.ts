import { Queue } from "./Queue";

/**
 * 异步任务接口
 */
export interface IAsyncTask {
    /** 任务唯一标识 */
    taskId: string;
    /** 执行任务 */
    execute(): Promise<void>;
}

/**
 * 异步队列参数
 */
export interface IAsyncQueueOptions {
    onTaskCompleted?: (taskId: string) => void;
    onTaskError?: (taskId: string, error: Error) => void;
    onAllTasksCompleted?: () => void;
}

/**
 * 异步队列
 * @author Michael
 * @example
 * const asyncQueue = new AsyncQueue();
 * asyncQueue.setOptions({
 *     onTaskCompleted: (taskId) => {
 *         H.log.info(`任务 ${taskId} 完成`);
 *     },
 *     onTaskError: (taskId, error) => {
 *         H.log.error(`任务 ${taskId} 出错:`, error);
 *     },
 *     onAllTasksCompleted: () => {
 *         H.log.info("所有任务完成");
 *     }
 * });
 * asyncQueue.enqueue({
 *     taskId: "task1",
 *     execute: async () => {
 *         // 异步任务逻辑
 *     }
 * });
 * asyncQueue.enqueue({
 *     taskId: "task2",
 *     execute: async () => {
 *         // 异步任务逻辑
 *     }
 * });
 * await asyncQueue.executeAll();
 * H.log.info("所有异步任务已完成");
 */
export class AsyncQueue extends Queue<IAsyncTask> {

    private _options: IAsyncQueueOptions = {};

    constructor(options?: IAsyncQueueOptions) {
        super();
        if (options) {
            this._options = options;
        }
    }

    /** 执行队列中的所有任务 */
    public async executeAll(): Promise<void> {
        while (!this.isEmpty()) {
            const task = this.dequeue()!;
            try {
                await task.execute();
                this._options.onTaskCompleted?.(task.taskId);
            } catch (error) {
                this._options.onTaskError?.(task.taskId, error as Error);
            }
        }
        this._options.onAllTasksCompleted?.();
    }

    /** 设置选项 */
    public setOptions(options: IAsyncQueueOptions): void {
        this._options = options;
    }
}