import { _decorator, Node, BlockInputEvents } from "cc";
import { UIComptBase } from "db://ccgf-kit/gui/base/UIComptBase";
import { UIRegistry } from 'db://ccgf-kit/decorators/UIRegistry';
import type { IUILifecycle, UIViewConfig } from 'db://ccgf-kit/gui/IUiStructs';
import { BaseViewItem } from 'db://ccgf-kit/gui/base/BaseViewItem';

/**
 * 根视图基类（Template Method 模式）
 *
 * 框架约定：
 *   - UILayerNodeBase 只调用 ui_on_* 系列（公开入口）
 *   - 子类在 onInit() 内调用 registerSubView()，此时 v_nodes 已就绪
 *   - 级联深度为一层：BaseView → [child1, child2, ...]
 */
export class BaseView extends UIComptBase implements IUILifecycle {


    protected onLoad(): void {
        super.onLoad();
        this._setupContentBlock();
    }

    public viewId: string = '';

    /** 通过 UIRegistry 获取当前视图的注册配置 */
    protected get viewConfig(): UIViewConfig | null {
        return UIRegistry.getInstance().getConfigByViewId(this.viewId);
    }

    /** Node → UIComptBase 映射；保证去重，O(1) 注销 */
    private _subViews: Map<Node, BaseViewItem> = new Map();


    // ── 子视图注册（仅 BaseView 子类可调用）──

    protected registerSubView(node: Node, uiCompt?: BaseViewItem): void {
        const child = uiCompt || node.getComponent(BaseViewItem);
        if (child) this._subViews.set(node, child);
    }

    protected unregisterSubView(node: Node): void {
        this._subViews.delete(node);
    }


    // ── 框架入口：先调自身钩子，再级联子视图 ──

    public ui_on_init(_data: any): void {
    }

    public ui_on_show(): void {
    }

    public ui_on_hide(): void {
    }

    public ui_on_refresh(_data: any): void {
    }

    public ui_on_destroy(): void {
    }



    // ── 内部 ──

    /**
     * 若 v_nodes 中存在 panelContent 节点，挂 BlockInputEvents
     * 阻止内容区域触摸事件下漏到同一触发点命中的其他节点（如 BasePopUp 的 mask）
     */
    private _setupContentBlock(): void {
        const panel = this.node.getChildByName('panelContent');
        if (panel) {
            panel.addComponent(BlockInputEvents);
        }
    }
}
