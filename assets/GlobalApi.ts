/**
 * GlobalApi — ccgf 框架全局 API 统一入口
 *
 * 所有 M 管理器属性在 class M 内直接声明与赋值，全局声明使用 typeof import() 模式。
 *
 * 位置：extensions/ccgf-kit/assets/ 统一调度（constitution II: extension 安装复用）
 */
import { LogHelper, SortHelper } from "db://ccgf-kit/helper";
import { UIMgr } from "db://ccgf-kit/gui";
import { ResMgr } from "db://ccgf-kit/res";
import { SdkMgr } from "db://ccgf-kit/sdk";
import { TimerManager, TimeOutMgr } from "db://ccgf-kit/timer";
import { NetMgr } from "db://ccgf-net-kit/net";
import { LocalStorageMgr } from "db://ccgf-kit/localStorage";
import { utils } from "db://ccgf-kit/utils";
import { EventMgr } from "db://ccgf-kit/event";
import { HotUpdateMgr } from "db://ccgf-kit/cchotupdate";

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
