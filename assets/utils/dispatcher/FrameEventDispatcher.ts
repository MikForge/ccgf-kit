import { BoundedQueue } from "db://ccgf-kit/utils/queue/BoundedQueue";
import { overflowStrategy } from "db://ccgf-kit/utils/queue/BoundedQueue.enum";
import type { FrameEventOptions } from 'db://ccgf-kit/utils/dispatcher/IFrameEventDispatcher';

/**
 * 分帧事件调度器
 */
export class FrameEventDispatcher<T> {

    /** 事件队列 */
    protected _eventQueue: BoundedQueue<T>;
    /** 每帧处理事件数量上限 */
    protected _maxEventsPerFrame: number;
    /** 调度器定时器ID */
    protected _dispatcherTimerId: number;
    /** 事件处理函数 */
    protected _eventHandler: (event: T) => void;
    /** 是否自动启停 */
    protected _autoStartStop: boolean;


    constructor(options: FrameEventOptions<T>) {
        this._eventQueue = new BoundedQueue<T>({
            maxSize: options.eventQueueMaxSize,
            overflowStrategy: options.eventQueueOverflowStrategy ? options.eventQueueOverflowStrategy : overflowStrategy.THROW_ERROR,
            onOverflow: options.eventQueueOverflowCallback
        });
        this._maxEventsPerFrame = options.maxEventsPerFrame;
        this._eventHandler = options.eventHandler || (() => { });
        this._autoStartStop = options.autoStartStop !== undefined ? options.autoStartStop : true;
        this._dispatcherTimerId = 0;

    }


    /** 
     * 启动调度器
     */
    public start(): void {
        if (this._dispatcherTimerId !== 0) {
            return;
        }
        this._dispatcherTimerId = setInterval(() => {
            this.dispatchEvents();
        }, 16); // 大约每16ms执行一次，模拟60FPS
    }

    private dispatchEvents(): void {
        let eventsProcessed = 0;
        while (eventsProcessed < this._maxEventsPerFrame && !this._eventQueue.isEmpty()) {
            const event = this._eventQueue.dequeue();
            if (event !== null) {
                this._eventHandler(event);
                eventsProcessed++;
            }
        }

        if (this._autoStartStop && this._eventQueue.isEmpty()) {
            this.stop();
        }
    }

    /** 
     * 停止调度器
     */
    public stop(): void {
        if (this._dispatcherTimerId !== 0) {
            clearInterval(this._dispatcherTimerId);
            this._dispatcherTimerId = 0;
        }
    }

    /**
     * 添加事件到队列
     * @param event 
     */
    public enqueueEvent(event: T): void {
        const wasEmpty = this._eventQueue.isEmpty();
        this._eventQueue.enqueue(event);
        if (this._autoStartStop && wasEmpty) {
            this.start();
        }
    }

    /** 
     * 获取当前队列大小
     * @returns number
     */
    public getQueueSize(): number {
        return this._eventQueue.size();
    }

    /**
     * 清空事件队列
     */
    public clearQueue(): void {
        this._eventQueue.clear();
    }

    /**
     * 调度器是否在运行
     * @returns 
     */
    public isRunning(): boolean {
        return this._dispatcherTimerId !== 0;
    } 
    
    /**
     * 销毁
     */
    public destroy(): void {
        this.stop();
        this._eventQueue.clear();
    }

    /**
     * 每帧更新
     * @param dt 
     */
    public update(dt: number): void {
        // 可选的每帧更新逻辑
    }

}