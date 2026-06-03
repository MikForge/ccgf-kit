import { BootState } from './defines/boot.enum';
import type { CoreEventMap } from 'db://ccgf-kit/core/event';
import type { BootFSM } from './BootFSM';
import type { BootErrorInfo } from './defines/boot.structs';
import type { BootActions } from './base/BootActions';

export class BootContext {
    /** 状态机引用，BootFSM 构造时注入 */
    fsm!: BootFSM;

    /** 外部能力注入 */
    readonly actions: BootActions;

    /** 最近一次桥接事件携带的数据，handleEvent 中读取 */
    lastEventData?: CoreEventMap[keyof CoreEventMap];

    // SDK 登陆结果
    sdkLoginResult?: unknown;

    // Token
    cachedToken?: string;
    serverToken?: string;

    // 重试
    retryCount: Map<string, number> = new Map();
    maxRetry = 3;

    // 错误信息
    lastError?: BootErrorInfo;
    lastFailedState?: BootState;

    constructor(actions: BootActions) {
        this.actions = actions;
    }

    incrementRetry(state: string): boolean {
        const count = (this.retryCount.get(state) ?? 0) + 1;
        this.retryCount.set(state, count);
        return count <= this.maxRetry;
    }

    resetRetry(state: string): void {
        this.retryCount.delete(state);
    }
}
