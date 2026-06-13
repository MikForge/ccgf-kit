import { _decorator, Node, Constructor } from "cc";
import { UIComptBase } from "db://ccgf-kit/gui";

const { ccclass } = _decorator;

/**
 * 根视图基类（Template Method 模式）
 *
 * 框架约定：
 *   - UILayerNodeBase 只调用 ui_on_* 系列（公开入口）
 *   - 子类只重写 on* 系列（保护钩子），不重写 ui_on_*
 *   - 子类在 onInit() 内调用 registerSubView()，此时 v_nodes 已就绪
 *   - 级联深度为一层：BaseView → [child1, child2, ...]
 */
@ccclass('BaseView')
export class BaseView extends UIComptBase {

    /** Node → UIComptBase 映射；保证去重，O(1) 注销 */
    private _subViews: Map<Node, UIComptBase> = new Map();

    /** 需要自动释放的子组件缓存 key */
    private _autoReleaseKeys: Array<{ paths: string; bundle: string }> = [];

    // ── 子视图注册（仅 BaseView 子类可调用）──

    protected registerSubView(node: Node, uiCompt?: UIComptBase): void {
        const child = uiCompt || node.getComponent(UIComptBase);
        if (child) this._subViews.set(node, child);
    }

    protected unregisterSubView(node: Node): void {
        this._subViews.delete(node);
    }

    /**
     * 异步加载独立 prefab 并挂载指定 UIComptBase 子组件
     * @param ItemCls     要挂载的组件类（extends UIComptBase）
     * @param paths       prefab 相对路径（同 M.res.load paths）
     * @param bundle      资源包名
     * @param container   挂载目标节点（来自 v_nodes）
     * @param data        传给子组件生命周期的初始数据
     * @param autoRelease 是否在 View 销毁时自动释放缓存（默认 true）
     * @returns           类型化的组件实例，失败返回 null
     */
    public async mountSubComp<T extends UIComptBase>(
        ItemCls: Constructor<T>,
        paths: string,
        bundle: string,
        container: Node,
        data?: any,
        autoRelease: boolean = true
    ): Promise<T | null> {
        if (!container || !container.isValid) {
            H.log.error(`[BaseView] mountSubComp: container 无效`);
            return null;
        }

        const node = await M.ui.loadSubNode(paths, paths, bundle, ItemCls, data);
        
        if (!node) return null;

        if (!container.isValid) {
            M.ui.releaseSubNode(paths, bundle);
            return null;
        }

        node.parent = container;
        const item = node.getComponent(ItemCls)!;
        this.registerSubView(node, item);

        if (autoRelease) {
            this._autoReleaseKeys.push({ paths, bundle });
        }

        item.ui_on_show(data);
        return item;
    }

    // ── 框架入口：先调自身钩子，再级联子视图 ──

    override ui_on_preload(): void {
        this.onPreload();
    }

    override async ui_on_init(data: any): Promise<boolean> {
        if (!await super.ui_on_init(data)) return false;  // UIContainer 绑定
        if (!await this.onInit(data)) return false;        // 子类初始化 + 注册子视图
        for (const c of this._subViews.values()) {
            if (!await c.ui_on_init(data)) return false;
        }
        return true;
    }

    override ui_on_show(data?: any): void {
        this.onShow(data);
        this._subViews.forEach(c => c.ui_on_show(data));
    }

    override ui_on_hide(): void {
        this.onHide();
        this._subViews.forEach(c => c.ui_on_hide());
    }

    override ui_on_refresh(data: any): void {
        this.onRefresh(data);
        this._subViews.forEach(c => c.ui_on_refresh(data));
    }

    override ui_before_destroy(): void {
        this.onBeforeDestroy();
        this._subViews.forEach(c => c.ui_before_destroy());
    }

    override ui_on_destroy(): void {
        this.onDestroy_();
        this._subViews.forEach(c => c.ui_on_destroy());
        this._subViews.clear();
        this._autoReleaseKeys.forEach(({ paths, bundle }) => M.ui.releaseSubNode(paths, bundle));
        this._autoReleaseKeys.length = 0;
    }

    // ── 保护钩子：子类重写这些方法（无需调用 super）──

    protected onPreload(): void { }
    protected async onInit(data: any): Promise<boolean> { return true; }
    protected onShow(data?: any): void { }
    protected onHide(): void { }
    protected onRefresh(data: any): void { }
    protected onBeforeDestroy(): void { }
    protected onDestroy_(): void { }  // 避免与 Cocos Component.onDestroy 冲突
}
