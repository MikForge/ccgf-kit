import { FSMCfg, IState, StateTransitionRecord } from "./IState";

/**
 * FSM
 * @author Michael
 * @description 有限状态机基类
 */
export class FSM<TState, TEvent, TContext> {
    /** 当前状态 */
    private currentState: IState<TState, TEvent, TContext> = null;

    /** 所有状态集合 */
    private states: Map<TState, IState<TState, TEvent, TContext>> = new Map();

    /** 上下文对象 */
    private context: TContext = null;

    /** 配置 */
    private config: FSMCfg<TState>;

    /** 状态历史记录 */
    private history: StateTransitionRecord<TState, TEvent>[] = [];

    /** 状态转换监听器 */
    protected transitionListeners: Array<(from: TState, to: TState, event?: TEvent) => void> = [];

    /** 状态转换守卫 */
    protected transitionGuards: Map<string, () => boolean> = new Map();

    /**
     * 构造函数
     * @param config 状态机配置
     * @param contexts 上下文对象
     */
    constructor(config: FSMCfg<TState>, contexts: TContext) {
        this.config = {
            enableHistory: true,
            maxHistoryLength: 50,
            enableLogging: true,
            logLevel: 'info',
            ...config
        };
        this.context = contexts;
    }


    /**
     * 注册状态
     * @param state 
     */
    public registerState(state: IState<TState, TEvent, TContext>): void {
        this.states.set(state.name, state);
    }


    /**
     * 注册多个状态
     * @param states 状态实例数组
     */
    public registerStates(states: IState<TState, TEvent, TContext>[]): void {
        states.forEach(state => this.registerState(state));
    }

    /**
     * 启动状态机
     */
    public start(): this {
        const initialState = this.states.get(this.config.initialState);
        if (!initialState) {
            H.log.error("FSM", `Initial state ${this.config.initialState} not found`);
            return this;
        }
        this.currentState = initialState;

        H.log.info("FSM", `Starting FSM with initial state: ${this.currentState.name}`);

        this.currentState.onEnter?.(this.context, null);

        return this
    }

    /**
     * 获取当前状态
     * @returns 当前状态
     */
    public getCurrentState(): TState {
        return this.currentState.name;
    }

    /**
     * 获取当前状态对象
     * @returns 当前状态对象
     */
    public getCurrentStateObject(): IState<TState, TEvent, TContext> | null {
        return this.currentState;
    }

    /**
     * 检查是否在某个状态
     * @param state 状态
     * @returns boolean
     */
    public isInState(state: TState): boolean {
        return this.currentState.name === state;
    }

    /**
     * 检查是否可以转到目标状态
     * @param targetState 目标状态
     * @returns boolean
     */
    public canTransitionTo(targetState: TState): boolean {
        return this.states.has(targetState);
    }

    /**
     * 检查状态是否已注册
     * @param state 状态
     * @returns boolean
     */
    public hasState(state: TState): boolean {
        return this.states.has(state);
    }

    /**
     * 获取所有已注册的状态
     * @returns 所有状态数组
     */
    public getAllStates(): TState[] {
        return Array.from(this.states.keys());
    }

    /**
     * 转到目标状态
     * @param targetState 目标状态
     */
    public transitionTo(targetState: TState, event?: TEvent): boolean {

        if (!this.getCurrentState()) {
            H.log.error("FSM", "Current state is null, please start the FSM first.");
            return false;
        }

        const target = this.states.get(targetState);
        if (!target) {
            H.log.error("FSM", `Target state ${targetState} not found`);
            return false
        }

        // 检查守卫
        if (!this.checkGuard(this.currentState.name, targetState)) {
            this.log('warn', `Transition blocked by guard: ${this.currentState.name} → ${targetState}`);
            return false;
        }

        // 退出当前状态
        this.currentState.onExit?.(this.context, targetState);

        const prevState = this.currentState.name;

        // 进入目标状态
        target.onEnter?.(this.context, prevState);

        // 更新当前状态
        this.currentState = target;

        this.recordTransition(prevState, targetState, event);

        // 触发转换监听器
        this.notifyTransitionListeners(prevState, targetState, event);

        return true;
    }

    /**
     * 触发事件
     * @param event 事件
     */
    public handleEvent(event: TEvent): boolean {
        if (!this.getCurrentState()) {
            H.log.error("FSM", "Current state is null, please start the FSM first.");
            return false;
        }

        const nextState = this.currentState.handleEvent?.(event, this.context);
        if (nextState && this.canTransitionTo(nextState)) {
            return this.transitionTo(nextState, event);
        } else {
            H.log.warn("FSM", `No valid transition for event ${event} in state ${this.currentState.name}`);
            return false;
        }
    }


    /**
     * 记录状态转换
     * @param from 转换前状态
     * @param to 转换后状态
     * @param event 触发事件
     */
    protected recordTransition(from: TState, to: TState, event?: TEvent): void {
        if (!this.config.enableHistory) {
            return;
        }

        this.history.push({
            fromState: from,
            toState: to,
            event,
            timestamp: Date.now()
        });

        // 限制历史记录长度
        if (this.history.length > this.config.maxHistoryLength!) {
            this.history.shift();
        }
    }


    /**
     * 通知状态转换监听器
     */
    protected notifyTransitionListeners(from: TState, to: TState, event?: TEvent): void {
        this.transitionListeners.forEach(listener => {
            try {
                listener(from, to, event);
            } catch (error) {
                H.log.error("状态转换监听器执行错误:", error);
            }
        });
    }


    /**
     * 添加状态转换监听器
     * @param listener 监听器函数
     */
    public onTransition(listener: (from: TState, to: TState, event?: TEvent) => void): this {
        this.transitionListeners.push(listener);
        return this;
    }

    /**
     * 移除状态转换监听器
     * @param listener 监听器函数
     */
    public offTransition(listener: (from: TState, to: TState, event?: TEvent) => void): this {
        const index = this.transitionListeners.indexOf(listener);
        if (index !== -1) {
            this.transitionListeners.splice(index, 1);
        }
        return this;
    }

    /**
     * 获取上一个状态
     */
    public getPreviousState(): TState | undefined {
        if (this.history.length > 0) {
            return this.history[this.history.length - 1].fromState;
        }
        return undefined;
    }


    /**
     * 获取状态转换历史
     */
    public getHistory(): ReadonlyArray<StateTransitionRecord<TState, TEvent>> {
        return this.history;
    }

    /**
     * 清空历史记录
     */
    public clearHistory(): this {
        this.history = [];
        return this;
    }

    /**
     * 重置状态机到初始状态
     */
    public reset(): this {
        if (this.currentState) {
            this.currentState.onExit?.(this.context, this.config.initialState);
        }

        this.clearHistory();
        this.currentState = null;

        this.log('info', 'Resetting FSM to initial state');

        return this.start();
    }

    /**
     * 更新状态机（每帧调用）
     * @param dt 时间增量（秒）
     */
    public update(dt: number): void {
        this.currentState?.update?.(this.context, dt);
    }

    /**
     * 停止状态机
     */
    public stop(): this {
        if (this.currentState) {
            this.currentState.onExit?.(this.context, null);
        }

        this.currentState = null;

        H.log.info("FSM", "State machine stopped");

        return this;
    }

    /**
     * 销毁状态机
     */
    public destroy(): void {
        this.stop();

        this.states.clear();
        this.transitionListeners = [];
        this.transitionGuards.clear();
        this.clearHistory();
        this.context = null;

        this.log('info', 'State machine destroyed');
    }

    /**
     * 添加状态转换守卫
     * @param from 源状态
     * @param to 目标状态
     * @param guard 守卫函数（返回 false 阻止转换）
     */
    public addGuard(from: TState, to: TState, guard: () => boolean): this {
        const key = `${from}_${to}`;
        this.transitionGuards.set(key, guard);
        this.log('debug', `Added guard for transition: ${from} → ${to}`);
        return this;
    }

    /**
     * 检查守卫
     * @param from 源状态
     * @param to 目标状态
     * @returns boolean
     */
    protected checkGuard(from: TState, to: TState): boolean {
        const key = `${from}_${to}`;
        const guard = this.transitionGuards.get(key);

        if (guard) {
            const result = guard();
            this.log('debug', `Guard check for ${from} → ${to}: ${result}`);
            return result;
        }

        return true;
    }

    /**
     * 日志输出
     * @param level 日志级别
     * @param message 消息
     * @param args 其他参数
     */
    protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
        if (!this.config.enableLogging) {
            return;
        }

        const levels = ['debug', 'info', 'warn', 'error'];
        const configLevel = this.config.logLevel || 'info';

        if (levels.indexOf(level) >= levels.indexOf(configLevel)) {

            switch (level) {
                case 'debug':
                    H.log.debug("FSM", message, ...args);
                    break;
                case 'info':
                    H.log.info("FSM", message, ...args);
                    break;
                case 'warn':
                    H.log.warn("FSM", message, ...args);
                    break;
                case 'error':
                    H.log.error("FSM", message, ...args);
                    break;
            }
        }
    }

}