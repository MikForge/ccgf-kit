import { _decorator, Component, Node } from 'cc';
import type { IUILifecycle } from 'db://ccgf-kit/gui/defines/ui-structs';
import { UIContainer } from 'db://ccgf-kit/gui/impl/UIContainer';

const { ccclass } = _decorator;

type UIComptsOf<T> =
    T extends { readonly __ui_compts_type?: infer TCompts }
    ? TCompts
    : Record<string, Component>;

type UINodesOf<T> =
    T extends { readonly __ui_nodes_type?: infer TNodes }
    ? TNodes
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

    // ── IUILifecycle 默认空实现 ──

    ui_on_preload(): void {}

    async ui_on_init(data: any): Promise<boolean> {
        this._bindUIContainer();
        return true;
    }

    ui_on_show(data?: any): void {}

    ui_on_hide(): void {}

    ui_on_refresh(data: any): void {}

    ui_before_destroy(): void {}

    ui_on_destroy(): void {}

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
}
