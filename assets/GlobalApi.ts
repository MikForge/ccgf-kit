
import { LogHelper, SortHelper } from "./helper";
import { TimerManager, TimeOutMgr } from "./timer";
import { LocalStorageMgr } from "./localStorage";
import { utils } from "./utils";
import { EventMgr } from "./event";

/** Framework version 框架版本号 */
export const version = '1.0.0.20251126';

/**
 * Manager 管理器 — ccgf-kit 核心管理器
 * 仅包含 4 个核心服务：event, timer, timeOut, ls
 * 项目侧可通过 declaration merging 追加 net/ui/res/sdk/hotupdate
 */
export class M {
    static timer: TimerManager;

    private static _timeOut: TimeOutMgr;
    static get timeOut(): TimeOutMgr {
        if (!M._timeOut) M._timeOut = TimeOutMgr.getInstance();
        return M._timeOut;
    }

    private static _ls: LocalStorageMgr;
    static get ls(): LocalStorageMgr {
        if (!M._ls) M._ls = LocalStorageMgr.getInstance();
        return M._ls;
    }

    private static _event: EventMgr;
    static get event(): EventMgr {
        if (!M._event) M._event = EventMgr.getInstance();
        return M._event;
    }
}

/**
 * Helper 辅助类
 */
export class H {
    static readonly log = LogHelper;
    static readonly sort = SortHelper;
    static readonly ut = utils;
}

// 全局声明
declare global {
    const M: typeof M;
    const H: typeof H;
}

// 挂载到全局
if (typeof globalThis !== 'undefined') {
    (globalThis as any).M = M;
    (globalThis as any).H = H;
}
