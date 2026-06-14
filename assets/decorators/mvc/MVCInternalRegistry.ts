import { ICommand, IProxy } from 'db://ccgf-kit/libs/puremvc';
import { Singleton } from 'db://ccgf-kit/common';

/**
 * MVC 内部注册表（单例）
 * 装饰器往里写，Startup 命令往外读
 */
export class MVCInternalRegistry extends Singleton<MVCInternalRegistry> {

    private _proxyMap: Map<string, new (...args: any[]) => IProxy> = new Map();
    private _commandMap: Map<string, new (...args: any[]) => ICommand> = new Map();

    /** 注册 Proxy 类 */
    registerProxy(key: string, proxyCls: new (...args: any[]) => IProxy): void {
        this._proxyMap.set(key, proxyCls);
    }

    /** 注册 Command 类 */
    registerCommand(key: string, cmdCls: new (...args: any[]) => ICommand): void {
        this._commandMap.set(key, cmdCls);
    }

    /** 按 key 查询 Proxy 类 */
    getProxy(key: string): (new (...args: any[]) => IProxy) | undefined {
        return this._proxyMap.get(key);
    }

    /** 按 key 查询 Command 类 */
    getCommand(key: string): (new (...args: any[]) => ICommand) | undefined {
        return this._commandMap.get(key);
    }

    /** 遍历全部 Model 条目 */
    get allModels(): Array<[string, new (...args: any[]) => IProxy]> {
        return [...this._proxyMap.entries()];
    }

    /** 遍历全部 Command 条目 */
    get allCommands(): Array<[string, new (...args: any[]) => ICommand]> {
        return [...this._commandMap.entries()];
    }
}
