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
