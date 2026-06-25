import { game, Component } from "cc";
import { StringUtil } from "db://ccgf-kit/utils/text/StringUtil";
import { Singleton } from "db://ccgf-kit/common/Singleton";

/**
 * TimerDriver — 驱动 CountdownMgr.tick() 的 Component，挂载到 persistNode 上
 * 由 GameBootstrap 创建后注入 CountdownMgr.init()
 */
export class TimerDriver extends Component {
    update(dt: number): void {
        M.timer.tick(dt);
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

    /**
     * 初始化 CountdownMgr，接收由调用方预先创建的 TimerDriver 组件
     * @param driver 已挂载到 persistNode 的 TimerDriver 组件
     */
    public init(_driver: TimerDriver): void {
        if (this._initialized) {
            H.log.warn("CountdownMgr: init() 重复调用，已忽略");
            return;
        }

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
            H.log.warn("CountdownMgr: register() 在 init() 之前调用，倒计时不会 tick");
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
