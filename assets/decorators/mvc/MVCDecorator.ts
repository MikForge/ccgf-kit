import { ICommand, IProxy } from 'db://ccgf-kit/libs/puremvc';
import { MVCInternalRegistry } from 'db://ccgf-kit/decorators';

/** Proxy 元数据标记键 */
export const MVC_PROXY_KEY = "MVC_PROXY_KEY";

/** Command 元数据标记键 */
export const MVC_COMMAND_KEY = "MVC_COMMAND_KEY";

/**
 * Proxy 装饰器
 * 自动将 Proxy 类注册到 MVCInternalRegistry
 * @param key 注册标识（对应 Manifest 中的常量值）
 */
export function registerProxy(key: string) {
    return function (proxyCls: new (...args: any[]) => IProxy) {
        proxyCls[MVC_PROXY_KEY] = key;
        MVCInternalRegistry.getInstance().registerProxy(key, proxyCls);
    };
}

/**
 * Command 装饰器
 * 自动将 Command 类注册到 MVCInternalRegistry
 * @param key 注册标识（对应 Manifest 中的常量值，即通知名）
 */
export function registerCommand(key: string) {
    return function (cmdCls: new (...args: any[]) => ICommand) {
        cmdCls[MVC_COMMAND_KEY] = key;
        MVCInternalRegistry.getInstance().registerCommand(key, cmdCls);
    };
}

/** 获取 Proxy 类上注册的 key */
export function getMVCProxyKey(proxyCls: any): string | undefined {
    return proxyCls[MVC_PROXY_KEY];
}

/** 获取 Command 类上注册的 key */
export function getMVCCommandKey(cmdCls: any): string | undefined {
    return cmdCls[MVC_COMMAND_KEY];
}
