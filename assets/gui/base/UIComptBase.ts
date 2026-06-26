import { _decorator, Component, Node, EventTouch } from 'cc';
import type { IUILifecycle, UIOpenParams } from 'db://ccgf-kit/gui/IUiStructs';
import { UIContainer } from 'db://ccgf-kit/gui/impl/UIContainer';

const { ccclass } = _decorator;

type UIComptsOf<T> =
    T extends { readonly __ui_compts_type?: infer TCompts }
    ? TCompts & Record<string, Component>
    : Record<string, Component>;

type UINodesOf<T> =
    T extends { readonly __ui_nodes_type?: infer TNodes }
    ? TNodes & Record<string, Node>
    : Record<string, Node>;

/**
 * UI 子视图基类
 * - 提供 UIContainer 节点/组件绑定（v_nodes / v_compts）
 * - 实现 IUILifecycle，所有钩子默认空实现，子类按需重写
 * - 不提供 registerSubView，子视图注册由 BaseView 统一管理
 */
@ccclass('UIComptBase')
export class UIComptBase extends Component implements IUILifecycle {

    private _v_uiContainer: UIContainer | null = null;
    
    private _v_nodes: Record<string, Node> = Object.create(null);
    private _v_compts: Record<string, Component> = Object.create(null);

    public get v_nodes(): UINodesOf<this> {
        return this._v_nodes as UINodesOf<this>;
    }

    public get v_compts(): UIComptsOf<this> {
        return this._v_compts as UIComptsOf<this>;
    }

    /** 事件监听池（自动清理） */
    private _eventListeners: Array<{
        target: Node;
        eventType: string;
        callback: Function;
        thisArg?: any;
    }> = [];

    /** 按钮连击冷却记录 */
    private _lastClickTime: Map<Node, number> = new Map();

    /** 摊平的子节点映射（递归所有子孙），用于 O(1) 按名查找 */
    private _nodeMap: Map<string, Node> = new Map();

    // ── IUILifecycle 默认空实现 ──

    ui_on_preload(): void {}

    async ui_on_init(data: any): Promise<boolean> {
        this._bindUIContainer();
        this._nodeMap = new Map();
        this._buildNodeMap(this.node);
        return true;
    }

    ui_on_show(data?: any): void {}

    ui_on_hide(): void {}

    ui_on_refresh(data: any): void {}

    ui_before_destroy(): void {}

    ui_on_destroy(): void {
    }

    // ── 事件绑定 ──

    /**
     * 绑定事件到目标节点（自动管理生命周期，ui_on_destroy 时清理）
     * @param target 目标节点
     * @param eventType 事件类型
     * @param callback 回调函数
     * @param thisArg this 指向
     */
    public bindEvent(
        target: Node,
        eventType: string,
        callback: (event?: any) => void,
        thisArg?: any,
    ): void {
        if (!target) {
            H.log.warn(`[UIComptBase] bindEvent: target is null`);
            return;
        }

        target.on(eventType, callback, thisArg);
        this._eventListeners.push({ target, eventType, callback, thisArg });
    }

    /**
     * 绑定按钮点击事件（TOUCH_END），自动防连击 + 点击音效
     * @param node 按钮节点
     * @param callback 点击回调
     * @param opts.sound 音效：true/不传=默认"ui_button"，string=指定音效名，false=关闭
     * @param opts.cooldown 冷却时间(ms)：默认 500，传 0 关闭防连击
     * @param thisArg this 指向
     */
    public bindButton(
        node: Node,
        callback: (event?: EventTouch) => void,
        opts?: { sound?: boolean | string; cooldown?: number },
        thisArg?: any,
    ): void {
        const cooldown = opts?.cooldown ?? 500;

        const wrapped = (event: EventTouch) => {
            // 防连击
            if (cooldown > 0) {
                const now = Date.now();
                const last = this._lastClickTime.get(node) || 0;
                if (now - last < cooldown) return;
                this._lastClickTime.set(node, now);
            }
            // 音效
            const sound = opts?.sound;
            if (sound !== false) {
                const sfxName = typeof sound === 'string' ? sound : 'ui_button';
                M.audio.playSFX(sfxName);
            }
            callback.call(thisArg, event);
        };

        this.bindEvent(node, Node.EventType.TOUCH_END, wrapped, thisArg);
    }

    /**
     * 按名称绑定按钮 — 从摊平的 _nodeMap 中按名查找节点
     */
    public bindButtonByName(
        nodeName: string,
        callback: (event?: EventTouch) => void,
        thisArg?: any,
        opts?: { sound?: boolean | string; cooldown?: number },
    ): void {
        let node = this._nodeMap.get(nodeName)
            ?? this._nodeMap.get('$' + nodeName);
        if (node) {
            this.bindButton(node, callback, opts, thisArg);
        }
    }

    /**
     * 清理所有事件监听
     */
    private _clearAllEventListeners(): void {
        for (const listener of this._eventListeners) {
            if (listener.target && listener.target.isValid) {
                listener.target.off(listener.eventType, listener.callback, listener.thisArg);
            }
        }
        this._eventListeners = [];
    }

    /** 递归摊平所有子节点到 _nodeMap，重复名报警 */
    private _buildNodeMap(root: Node): void {
        for (const child of root.children) {
            if (child.name) {
                if (this._nodeMap.has(child.name)) {
                    H.log.warn(`[UIComptBase] 重复节点名: ${child.name}`);
                }
                this._nodeMap.set(child.name, child);
            }
            this._buildNodeMap(child);
        }
    }

    // ── 内部绑定 ──

    private _bindUIContainer(): void {
        this._v_uiContainer = this.node.getComponent(UIContainer);
        this._v_nodes = Object.create(null);
        this._v_compts = Object.create(null);
        if (!this._v_uiContainer) return;
        this._v_uiContainer.parse_compt();
        this._v_nodes = this._v_uiContainer.nodeDict;
        this._v_compts = this._v_uiContainer.comptDict;
    }


    protected onDestroy(): void {
        this._nodeMap.clear();
        this._clearAllEventListeners();

    }
}
