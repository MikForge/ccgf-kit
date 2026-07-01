
/**
 * 状态机配置接口
 */
export interface FSMCfg<TState>{
    /** 初始状态 */
    initialState: TState;
    /** 记录历史 */
    enableHistory?: boolean;
    /** 最大历史记录数 */
    maxHistoryLength?: number;
    /** 启用日志 */
    enableLogging?: boolean;
    /** 日志级别 */
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * 状态转换记录
 */
export interface StateTransitionRecord<TState, TEvent> {
    /** 转换前的状态 */
    fromState: TState;
    /** 转换后的状态 */
    toState: TState;
    /** 触发转换的事件 */
    event?: TEvent;
    /** 触发转换的时间戳 */
    timestamp: number;
}

/**
 * 状态转换配置
 */
export interface TransitionConfig<TState, TEvent> {
    /** 转换前的状态 */
    fromState: TState;
    /** 转换后的状态 */
    toState: TState;
    /** 触发转换的事件 */
    event: TEvent;
    /** 守卫函数  */
    guard?: () => boolean;
}

/**
 * 状态接口
 */
export interface IState<TState, TEvent, TContexts> {
    /** 状态名称 */
    name: TState;

    /**
     * 进入状态时调用
     * @param contexts 上下文对象
     * @param prevState 前一个状态
     */
    onEnter?(contexts: TContexts, prevState: TState): void;

    /**
     *  退出状态时调用
     * @param contexts  上下文对象
     * @param nextState 下一个状态
     */
    onExit?(contexts: TContexts, nextState: TState): void;

    /**
     * 处理事件
     * @param event 事件
     * @param contexts 上下文对象
     * @returns 
     */
    handleEvent?(event: TEvent, contexts: TContexts): TState | null;

    /**
     * 每帧更新
     * @param contexts 上下文对象
     * @param dt 时间增量（秒）
     */
    update?(contexts: TContexts, dt: number): void;
}
