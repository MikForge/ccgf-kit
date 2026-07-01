/**
 * 单例接口
 */
export interface SingletonClass<T> {
    new(): T;
    getInstance(): T;
    destroyInstance(): void;
    hasInstance(): boolean;
}
