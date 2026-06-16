import type { IProxy } from 'db://ccgf-kit/libs/puremvc/index';

export type registerProxyCtor = new (name?: string, data?: any) => IProxy;

export const registerProxyMetadata = new Map<registerProxyCtor, string>();

export function registerProxy(key: string) {
    return function (proxyCls: registerProxyCtor): void {
        registerProxyMetadata.set(proxyCls, key);
    };
}
