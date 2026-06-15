/**
 * 单例装饰器
 * 使用方式:
 * @singleton
 * class MyClass {
 *     // your code
 * }
 * 
 * 调用:
 * MyClass.getInstance()
 */

import type { SingletonClass } from 'db://ccgf-kit/common/ISingleton';

/**
 * 单例装饰器函数
 * @param constructor 类构造函数
 */
export function singleton<T extends { new(...args: any[]): {} }>(constructor: T): SingletonClass<InstanceType<T>> & T {
    const singletonClass = class extends constructor {
        static _instance: any = null;

        static getInstance(): InstanceType<T> {
            if (!this._instance) {
                this._instance = new this();
            }
            return this._instance;
        }

        static destroyInstance(): void {
            this._instance = null;
        }

        static hasInstance(): boolean {
            return this._instance != null;
        }

        constructor(...args: any[]) {
            super(...args);
            // 防止通过 new 创建多个实例
            const ctor = this.constructor as any;
            if (ctor._instance) {
                return ctor._instance;
            }
        }
    };

    // 保留原始类名
    Object.defineProperty(singletonClass, 'name', {
        value: constructor.name,
        writable: false
    });

    return singletonClass as any;
}

/**
 * 单例基类（保留向后兼容）
 * 使用方式:
 * class MyClass extends Singleton<MyClass> {
 *     // your code
 * }
 * 
 * 调用:
 * MyClass.getInstance()
 */
export class Singleton<T> {

    protected static _instance: unknown | null = null;

    static getInstance<T>(this: new () => T): T {
        const self = this as unknown as { _instance: unknown | null };
        if (!self._instance) {
            self._instance = new this();
        }
        return self._instance as T;
    }

    static destroyInstance(): void {
        this._instance = null;
    }

    static hasInstance(): boolean {
        return this._instance != null;
    }
}

