
import { EventTarget } from 'cc';

import { Singleton } from 'db://ccgf-kit/common';
import { TimerTaskMgr } from 'db://ccgf-kit/timer';
import { CoreEventMap } from 'db://ccgf-kit/event/defines/CoreEventMap';
import { LogHelper } from 'db://ccgf-kit/helper';

export class EventMgr extends Singleton<EventMgr> {
    private _target: EventTarget;
    private _wrappers: WeakMap<(...args: any[]) => void, (...args: any[]) => void> = new WeakMap();
    private _debug: boolean = false;

    constructor() {
        super();
        this._target = new EventTarget();
    }

    // ---- 包装 ----

    private _wrap(type: string | number, cb: (...args: any[]) => void): (...args: any[]) => void {
        let wrapped = this._wrappers.get(cb);
        if (!wrapped) {
            wrapped = (...args: any[]) => {
                try {
                    cb(...args);
                } catch (e) {
                    LogHelper.error(`[EventMgr] Error in listener for "${type}":`, e);
                }
            };
            this._wrappers.set(cb, wrapped);
        }
        return wrapped;
    }

    // ---- 标准事件方法 ----

    on<K extends keyof CoreEventMap>(type: K, cb: (data: CoreEventMap[K]) => void, target?: unknown): typeof cb;
    on(type: string | number, cb: (...args: any[]) => void, target?: unknown): (...args: any[]) => void;
    on(type: string | number, cb: (...args: any[]) => void, target?: unknown): (...args: any[]) => void {
        const wrapped = this._wrap(type, cb);
        this._target.on(type, wrapped, target);
        return cb;
    }

    once<K extends keyof CoreEventMap>(type: K, cb: (data: CoreEventMap[K]) => void, target?: unknown): typeof cb;
    once(type: string | number, cb: (...args: any[]) => void, target?: unknown): (...args: any[]) => void;
    once(type: string | number, cb: (...args: any[]) => void, target?: unknown): (...args: any[]) => void {
        const wrapped = this._wrap(type, cb);
        this._target.once(type, wrapped, target);
        return cb;
    }

    off(type: string | number, callback?: (...args: any[]) => void, target?: unknown): void {
        if (callback) {
            const wrapped = this._wrappers.get(callback);
            this._target.off(type as string, wrapped || callback, target);
        } else {
            this.removeByType(type);
        }
    }

    targetOff(target: unknown): void {
        this._target.targetOff(target);
    }

    removeAll(): void {
        (this._target as any).clear();
    }

    removeByType(type: string | number): void {
        this._target.removeAll(type);
    }

    removeByTarget(target: unknown): void {
        this._target.removeAll(target);
    }

    hasEventListener(type: string | number, callback?: (...args: any[]) => void, target?: unknown): boolean {
        if (callback) {
            const wrapped = this._wrappers.get(callback);
            return this._target.hasEventListener(type as string, wrapped || callback, target);
        }
        return this._target.hasEventListener(type as string, undefined, target);
    }

    // ---- 派发 ----

    emit<K extends keyof CoreEventMap>(type: K, data: CoreEventMap[K]): void;
    emit(type: string | number, data?: any): void;
    emit(type: string | number, data?: any): void {
        if (this._debug) {
            LogHelper.debug(`[EventMgr] emit "${type}"`, data);
        }
        this._target.emit(type, data);
    }

    emitWithDelay<K extends keyof CoreEventMap>(type: K, data: CoreEventMap[K], delayMs: number): void;
    emitWithDelay(type: string | number, data: any, delayMs: number): void;
    emitWithDelay(type: string | number, data: any, delayMs: number): void {
        TimerTaskMgr.getInstance().setTimeout(() => this.emit(type, data), delayMs);
    }

    // ---- 调试 ----

    setDebug(enabled: boolean): void {
        this._debug = enabled;
    }

    // ---- 销毁 ----

    destroy(): void {
        this.removeAll();
    }

    static destroyInstance(): void {
        const inst = (this as any)._instance;
        if (inst) {
            inst.destroy();
        }
        super.destroyInstance();
    }
}
