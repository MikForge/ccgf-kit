
import { LogHelper, SortHelper } from "db://assets/core/helper";
import { UIMgr } from "db://assets/core/gui";
import { ResMgr } from "db://assets/core/res";
import { SdkMgr } from "db://assets/core/sdk";
import { TimerManager, TimeOutMgr } from "db://assets/core/timer";
import { NetMgr } from "db://assets/core/net";
import { LocalStorageMgr } from "db://assets/core/localStorage";
import { utils } from "db://assets/core/utils";
import { EventMgr } from "db://assets/core/event";
import { HotUpdateMgr } from "db://assets/core/cchotupdate";
import { GameCfgMgr } from 'db://assets/core/game-cfg';

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