import { Node, EventTouch } from 'cc';
import { Mediator } from "db://ccgf-kit/libs/puremvc";

import { LogHelper } from 'db://ccgf-kit/helper';
/**
 * 事件监听信息
 */
interface EventListenerInfo {
    target: Node;
    eventType: string;
    callback: Function;
    thisArg?: any;
}

/**
 * 基础中介者 - 可添加通用功能
 */
export class BaseMeditor extends Mediator {

    param: any = null;

    /** 事件监听池 */
    private eventListeners: EventListenerInfo[] = [];


    public constructor(name?: string, viewComponent?: Node, param?: any) {
        super(name, viewComponent);
        this.param = param;
    }

    /**
     * 注册事件监听（自动管理，自动防连击）
     * @param target 目标节点
     * @param eventType 事件类型
     * @param callback 回调函数
     * @param thisArg this 指向
     * @param cooldown 点击冷却时间（毫秒），传 0 表示不需要防连击
     */
    protected addEventListenerOn(
        target: Node,
        eventType: string,
        callback: Function,
        thisArg?: any,
    ): void {
        if (!target) {
            LogHelper.warn(`[BaseMeditor] addEventListenerOn: target is null`);
            return;
        }

        let wrappedCallback = (event: EventTouch) => {
            //TODO: 按钮点击音效


            callback.call(thisArg, event);
        };

        target.on(eventType, wrappedCallback, thisArg);
        this.eventListeners.push({ target, eventType, callback: wrappedCallback, thisArg });
    }

    /**
     * 清理所有事件监听
     */
    private clearAllEventListeners(): void {
        for (const listener of this.eventListeners) {
            if (listener.target && listener.target.isValid) {
                listener.target.off(listener.eventType, listener.callback, listener.thisArg);
            }
        }
        this.eventListeners = [];
    }

    public onRegister(): void {
        super.onRegister();
        this.onInit();
        this.onStart();
    }

    public onRemove(): void {
        this.onDestroy();
        this.clearAllEventListeners();
        super.onRemove();
    }

    protected onInit(): void { }

    protected onStart(): void { }

    protected onDestroy(): void { }

}