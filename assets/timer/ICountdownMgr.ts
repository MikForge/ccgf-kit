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
