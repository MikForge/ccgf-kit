
import { LogHelper, SortHelper } from "db://ccgf-kit/core/helper";
import { UIMgr } from "db://ccgf-kit/core/gui";
import { ResMgr } from "db://ccgf-kit/core/res";
import { SdkMgr } from "db://ccgf-kit/core/sdk";
import { TimerManager, TimeOutMgr } from "db://ccgf-kit/core/timer";
import { NetMgr } from "db://ccgf-kit/core/net";
import { LocalStorageMgr } from "db://ccgf-kit/core/localStorage";
import { utils } from "db://ccgf-kit/core/utils";
import { EventMgr } from "db://ccgf-kit/core/event";
import { HotUpdateMgr } from "db://ccgf-kit/core/cchotupdate";
import { GameCfgMgr } from 'db://ccgf-kit/core/game-cfg';

/** Framework version 框架版本号 */
export const version = '1.0.0.20251126';

/**
 * Manager 管理器
 */
export class M {
    static timer: TimerManager;
    static readonly ui: UIMgr = UIMgr.getInstance();
    static readonly sdk: SdkMgr = SdkMgr.getInstance();
    static readonly res: ResMgr = ResMgr.getInstance();
    static readonly timeOut = TimeOutMgr.getInstance();
    static readonly net: NetMgr = NetMgr.getInstance();
    static readonly ls = LocalStorageMgr.getInstance();
    static readonly event: EventMgr = EventMgr.getInstance();
    static readonly hotupdate: HotUpdateMgr = HotUpdateMgr.getInstance();
    static readonly gameCfgMgr: GameCfgMgr = GameCfgMgr.getInstance();
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
    const M: typeof import('./GlobalApi').M;
    const H: typeof import('./GlobalApi').H;
}

// 仅在开发环境自动挂载到全局
if (typeof globalThis !== 'undefined') {
    (globalThis as any).M = M;
    (globalThis as any).H = H;
}