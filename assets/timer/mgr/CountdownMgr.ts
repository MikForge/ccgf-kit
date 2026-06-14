import { game, Node, Component } from "cc";
import { StringUtil } from "db://ccgf-kit/utils";
import { Singleton } from "db://ccgf-kit/common";
import { LogHelper } from "db://ccgf-kit/helper";

interface ITimer {
    /** 倒计时编号 */
    id: string;
    /** 累计耗时（秒） */
    elapsed: number;
    /** 触发间隔（秒） */
    step: number;
    /** 数据对象 */
    object: any;
    /** 修改数据对象的字段 */
    field: string;
    /** 事件侦听器的目标和被叫方 */
    target: any;
    /** 开始时间 */
    startTime: number;
    /** 每秒触发事件 */
    onSeconds: Function[];
    /** 时间完成事件 */
    onCompletes: Function[];
}

/**
 * TimerDriver — 内部 Component，挂载在 persistNode 上驱动 tick
 */
class TimerDriver extends Component {
    update(dt: number): void {
        CountdownMgr.getInstance().tick(dt);
    }
}

/** 倒计时管理器（Singleton） */
export class CountdownMgr extends Singleton<CountdownMgr> {
    /** 倒计时数据 */
    private times: { [key: string]: ITimer } = {};
    /** 服务器时间 */
    private date_s: Date = new Date();
    /** 服务器初始时间 */
    private date_s_start: Date = new Date();
    /** 服务器时间后修正时间 */
    private polymeric_s: number = 0;
    /** 客户端时间 */
    private date_c: Date = new Date();
    /** 初始化标志 */
    private _initialized: boolean = false;
    /** TimerDriver 组件引用 */
    private _driver: TimerDriver | null = null;
    /** persistNode 引用 */
    private _persistNode: Node | null = null;

    /**
     * 初始化 CountdownMgr，创建 TimerDriver 并挂载到 persistNode
     * @param persistNode 常驻节点
     */
    public init(persistNode: Node): void {
        if (this._initialized) {
            LogHelper.warn("CountdownMgr: init() 重复调用，覆盖 persistNode 引用");
            this._persistNode = persistNode;
            if (!this._driver) {
                this._driver = persistNode.addComponent(TimerDriver);
            }
            return;
        }

        this._persistNode = persistNode;
        this._driver = persistNode.addComponent(TimerDriver);
        this._initialized = true;
    }

    /**
     * tick — 由 TimerDriver.update(dt) 调用，驱动所有倒计时
     * @param dt 帧时间差（秒）
     */
    public tick(dt: number): void {
        for (let key in this.times) {
            let data = this.times[key];
            data.elapsed += dt;
            if (data.elapsed >= data.step) {
                data.elapsed -= data.step;
                if (data.object[data.field] > 0) {
                    data.object[data.field]--;

                    // 倒计时结束触发
                    if (data.object[data.field] == 0) {
                        this.onTimerComplete(data);
                    }
                    // 触发每秒回调事件  
                    else if (data.onSeconds) {
                        data.onSeconds.forEach(fn => fn.call(data.object));
                    }
                }
            }
        }
    }

    /** 触发倒计时完成事件 */
    private onTimerComplete(data: ITimer) {
        if (data.onCompletes) data.onCompletes.forEach(fn => fn.call(data.target, data.object));
        delete this.times[data.id];
    }

    /**
     * 在指定对象上注册一个倒计时的回调管理器
     * @param object        注册定时器的对象
     * @param field         时间字段
     * @param target        触发事件的对象
     * @param onSecond      每秒事件
     * @param onComplete    倒计时完成事件
     * @returns 倒计时编号
     */
    register(object: any, field: string, target: object, onSecond?: Function, onComplete?: Function): string {
        if (!this._initialized) {
            LogHelper.warn("CountdownMgr: register() 在 init() 之前调用，倒计时不会 tick");
        }

        let data: ITimer = {
            id: StringUtil.guid(),
            elapsed: 0,
            step: 1,
            object: object,
            field: field,
            onSeconds: [],
            onCompletes: [],
            target: target,
            startTime: this.getTime()
        };
        if (onSecond) data.onSeconds.push(onSecond);
        if (onComplete) data.onCompletes.push(onComplete);

        this.times[data.id] = data;
        return data.id;
    }

    /**
     * 为指定倒计时添加回调事件
     * @param id            倒计时编号
     * @param onSecond      每秒事件
     * @param onComplete    倒计时完成事件
     */
    addCallback(id: string, onSecond?: Function, onComplete?: Function) {
        let data = this.times[id];
        if (data) {
            if (onSecond) data.onSeconds.push(onSecond);
            if (onComplete) data.onCompletes.push(onComplete);
        }
    }

    /** 
     * 在指定对象上注销一个倒计时的回调管理器 
     * @param id         时间对象唯一表示
     */
    unRegister(id: string) {
        if (this.times[id]) delete this.times[id];
    }

    /**
     * 服务器时间与本地时间同步
     * @param value   服务器时间刻度
     */
    setServerTime(value: number): void {
        this.polymeric_s = this.getTime();
        this.date_s_start.setTime(value);
    }

    /** 获取写服务器同步的时间刻度 */
    getServerTime(): number {
        return this.date_s_start.getTime() + this.getTime() - this.polymeric_s;
    }

    /** 获取服务器时间对象 */
    getServerDate(): Date {
        this.date_s.setTime(this.getServerTime());
        return this.date_s;
    }

    /** 获取本地时间刻度 */
    getClientTime(): number {
        return Date.now();
    }

    /** 获取本地时间对象 */
    getClientDate(): Date {
        this.date_c.setTime(this.getClientTime());
        return this.date_c;
    }

    /** 获取游戏开始到现在逝去的时间 */
    getTime(): number {
        return game.totalTime;
    }

    /** 游戏最小化时记录时间数据 */
    save(): void {
        for (let key in this.times) {
            let data: ITimer = this.times[key];
            data.startTime = this.getTime();
        }
    }

    /** 游戏最大化时恢复时间数据 */
    load(): void {
        for (let key in this.times) {
            let data = this.times[key];
            let interval = Math.floor((this.getTime() - (data.startTime || this.getTime())) / 1000);
            data.object[data.field] = data.object[data.field] - interval;
            if (data.object[data.field] <= 0) {
                data.object[data.field] = 0;
                this.onTimerComplete(data);
            }
        }
    }
}
