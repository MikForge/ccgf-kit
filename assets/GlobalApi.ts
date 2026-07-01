/**
 * GlobalApi — ccgf 框架全局 API 统一入口
 *
 * 所有 M 管理器属性在 class M 内直接声明与赋值，全局声明使用 declare global 模式。
 *
 * 位置：extensions/ccgf-kit/assets/ — 框架层全局 API 聚合入口
 */
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import { SortHelper } from 'db://ccgf-kit/helper/SortHelper';
import { UIMgr } from 'db://ccgf-kit/gui/UIMgr';
import { ResMgr } from 'db://ccgf-kit/res/ResMgr';
import { SdkMgr } from 'db://ccgf-kit/sdk/SdkMgr';
import { CountdownMgr } from "db://ccgf-kit/timer/CountdownMgr";
import { TimerTaskMgr } from "db://ccgf-kit/timer/TimerTaskMgr";
import { NetMgr } from 'db://ccgf-kit/net/mgr/NetMgr';
import { LocalStorageMgr } from 'db://ccgf-kit/localStorage/LocalStorageMgr';
import { utils } from 'db://ccgf-kit/utils/utils';
import { EventMgr } from 'db://ccgf-kit/event/EventMgr';
import { HotUpdateMgr } from 'db://ccgf-kit/cchotupdate/HotUpdateMgr';
import { AudioMgr } from 'db://ccgf-kit/audio/AudioMgr';
import { AudioHelper } from 'db://ccgf-kit/audio/AudioHelper';
import { CoreHelper } from "db://ccgf-kit/core/CoreHelper";

/** Framework version 框架版本号 */
export const version = '1.0.0.20251126';

/**
 * Manager 管理器
 */
export class M {
    static readonly timer = CountdownMgr.getInstance();
    static readonly ui: UIMgr = UIMgr.getInstance();
    static readonly sdk: SdkMgr = SdkMgr.getInstance();
    static readonly res: ResMgr = ResMgr.getInstance();
    static readonly timeOut = TimerTaskMgr.getInstance();
    static readonly net: NetMgr = NetMgr.getInstance(); 
    static readonly ls = LocalStorageMgr.getInstance();
    static readonly event: EventMgr = EventMgr.getInstance();
    static readonly hotupdate: HotUpdateMgr = HotUpdateMgr.getInstance();
    static readonly audio: AudioMgr = AudioMgr.getInstance();
}

/**
 * Helper 辅助类
 */
export class H {
    static readonly log = LogHelper;
    static readonly sort = SortHelper;
    static readonly ut = utils;
    static readonly core = CoreHelper;
    static readonly audioHelper = AudioHelper;
}

type _GlobalM = typeof M;
type _GlobalH = typeof H;

declare global {
    /** 全局管理器 M — 框架所有单例管理器的统一入口 */
    var M: _GlobalM;
    /** 全局辅助类 H — LogHelper / SortHelper / utils 的统一入口 */
    var H: _GlobalH;
}


// 运行时挂载全局 API（兼容 ES2015）
/**
 * TODO: 增加paramMgr 后 根据 parm 去 处理
 */
function getGlobal(): any {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof window !== 'undefined') return window;
    if (typeof self !== 'undefined') return self;
    return {} as any;
}
const _g = getGlobal();
_g.M = M;
_g.H = H;
