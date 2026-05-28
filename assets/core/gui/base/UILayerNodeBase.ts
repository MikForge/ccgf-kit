import { Node } from "cc";
import { UIHelper } from "db://assets/core/helper";
import { UIViewState } from "./UIViewState";
import { UIComptBase } from "./UIComptBase";
import { LayerContainerType } from "../defines/ui-layer.enum";

export class UILayerNodeBase extends Node {

    onOpenFailure: Function = null!;

    protected ui_nodes = new Map<string, UIViewState>();
    protected nodeMap = new Map<string, Node>();
    protected hiddenNodes = new Map<string, Node>();
    protected uiStack: string[] = [];
    protected maxNodes: number = -1;
    protected containerType: LayerContainerType;
    protected enableStack: boolean = false;
    private _pendingSet: Set<string> = new Set();

    constructor(
        name: string,
        containerType: LayerContainerType = LayerContainerType.Multi,
        enableStack: boolean = false
    ) {
        super(name);
        this.containerType = containerType;
        this.maxNodes = containerType === LayerContainerType.Single ? 1 : -1;
        this.enableStack = enableStack;
        UIHelper.setFullScreen(this);
        this.on(Node.EventType.CHILD_ADDED, this.onChildAdded, this);
        this.on(Node.EventType.CHILD_REMOVED, this.onChildRemoved, this);
    }

    protected onChildAdded(child: Node): void {}
    protected onChildRemoved(child: Node): void {}

    public async addView(uiInfo: UIViewState): Promise<Node> {
        const viewId = uiInfo.viewId;

        // B1: 竞态防护——prefab 加载期间拦截重复请求
        if (this._pendingSet.has(viewId)) {
            H.log.debug(`界面正在加载中，忽略重复请求: ${viewId}`);
            return null!;
        }

        if (this.hiddenNodes.has(viewId)) {
            H.log.debug(`从隐藏池恢复界面: ${viewId}`);
            return this.restoreView(viewId);
        }

        if (this.nodeMap.has(viewId)) {
            const node = this.nodeMap.get(viewId)!;
            H.log.debug(`界面已存在，提升到栈顶: ${viewId}`);
            if (this.enableStack) this.pushToStack(viewId);
            node.active = true;
            return node;
        }

        if (this.maxNodes === 1 && this.nodeMap.size >= 1) {
            const oldKey = this.nodeMap.keys().next().value;
            H.log.debug(`单例层：隐藏旧界面 ${oldKey}`);
            this.hideView(oldKey);
        }

        // B1: 标记加载中；finally 确保无论成功/失败都清除
        this._pendingSet.add(viewId);

        let node: Node;

        try {
            node = await this.load(uiInfo);
        } finally {
            this._pendingSet.delete(viewId);
        }

        // B3: load 失败时 node 为 null，不写入 Map
        if (!node) return null!;

        this.ui_nodes.set(viewId, uiInfo);
        
        this.nodeMap.set(viewId, node);

        if (this.enableStack) this.pushToStack(viewId);

        return node;
    }

    public removeView(viewId: string): void {
        const uiInfo = this.ui_nodes.get(viewId);
        const isHidden = this.hiddenNodes.has(viewId);
        const node = this.nodeMap.get(viewId) ?? this.hiddenNodes.get(viewId);
        if (!uiInfo || !node) return;

        if (this.enableStack) this.popFromStack(viewId);

        // 隐藏池里的视图强制走释放路径（已在池里再 close = 彻底销毁）
        const needRelease = uiInfo.config.destroy || isHidden;
        const view = node.getComponent(UIComptBase);

        view?.ui_before_destroy();

        if (needRelease) {
            view?.ui_on_destroy();
            this.nodeMap.delete(viewId);
            this.hiddenNodes.delete(viewId);
            this.ui_nodes.delete(viewId);
            node.destroy();
            this._releaseRes(uiInfo);
        } else {
            this.hideView(viewId);
        }

        if (this.enableStack) this.restoreTopView();
    }

    /** 向已显示的界面推送新数据（不关闭重开） */
    public refreshView(viewId: string, data: any): void {
        const node = this.nodeMap.get(viewId);
        const view = node?.getComponent(UIComptBase);
        view?.ui_on_refresh(data);
    }

    protected async load(uiInfo: UIViewState): Promise<Node> {
        let timerId = setTimeout(this.onLoadingTimeoutGui, 1000);

        const node = await M.ui.loadSubNode(
            uiInfo.viewId,
            uiInfo.config.prefab,
            uiInfo.config.bundle,
            uiInfo.config.viewCls,
            uiInfo.params.data,
        );

        if (!node) {
            this.failure(uiInfo);
            clearTimeout(timerId);
            return null!;
        }

        clearTimeout(timerId);
        uiInfo.valid = true;

        if (!uiInfo.params.preload) {
            node.parent = this;
            const view = node.getComponent(UIComptBase);
            view?.ui_on_show(uiInfo.params.data);
        }

        return node;
    }

    private onLoadingTimeoutGui(): void {}

    protected failure(uiInfo: UIViewState): void {
        this._releaseRes(uiInfo);
        this.onOpenFailure && this.onOpenFailure();
    }

    private _releaseRes(uiInfo: UIViewState): void {
        M.res.releasePrefab(uiInfo.config.prefab, uiInfo.config.bundle);
        H.log.info(`【界面管理】释放【${uiInfo.config.prefab}】界面资源`);
    }

    protected hideView(viewId: string): void {
        const uiInfo = this.ui_nodes.get(viewId);
        const node = this.nodeMap.get(viewId);
        if (!node) return;

        const view = node.getComponent(UIComptBase);
        view?.ui_on_hide();

        this.nodeMap.delete(viewId);
        this.hiddenNodes.set(viewId, node);

        if (this.enableStack) {
            const index = this.uiStack.indexOf(viewId);
            if (index > -1) this.uiStack.splice(index, 1);
        }

        node.active = false;
        if (uiInfo) uiInfo.valid = false;

        H.log.debug(`界面已隐藏: ${viewId}`);
    }

    protected restoreView(viewId: string): Node {
        const node = this.hiddenNodes.get(viewId);
        if (!node) {
            H.log.warn(`恢复失败：界面不在隐藏池中: ${viewId}`);
            return null!;
        }

        this.hiddenNodes.delete(viewId);
        this.nodeMap.set(viewId, node);

        if (this.enableStack) this.pushToStack(viewId);

        node.parent = this;
        node.active = true;

        const view = node.getComponent(UIComptBase);
        view?.ui_on_show();

        const uiInfo = this.ui_nodes.get(viewId);
        if (uiInfo) uiInfo.valid = true;

        H.log.debug(`界面已恢复: ${viewId}`);
        return node;
    }

    protected pushToStack(viewId: string): void {
        const index = this.uiStack.indexOf(viewId);
        if (index > -1) this.uiStack.splice(index, 1);
        this.uiStack.push(viewId);
        this.updateZOrder();
        H.log.debug(`[${this.name}] 界面栈: [${this.uiStack.join(' → ')}]`);
    }

    protected popFromStack(viewId: string): void {
        const index = this.uiStack.indexOf(viewId);
        if (index > -1) this.uiStack.splice(index, 1);
        this.updateZOrder();
    }

    protected restoreTopView(): void {
        if (this.uiStack.length === 0) return;
        const topKey = this.uiStack[this.uiStack.length - 1];
        const node = this.nodeMap.get(topKey);
        if (node) {
            node.active = true;
            H.log.debug(`恢复栈顶界面: ${topKey}`);
        }
    }

    protected updateZOrder(): void {
        this.uiStack.forEach((viewId, index) => {
            const node = this.nodeMap.get(viewId);
            if (node) node.setSiblingIndex(index);
        });
    }

    public getTopView(): Node | null {
        if (!this.enableStack || this.uiStack.length === 0) return null;
        const topKey = this.uiStack[this.uiStack.length - 1];
        return this.nodeMap.get(topKey) || null;
    }

    public getTopViewState(): UIViewState | null {
        if (!this.enableStack || this.uiStack.length === 0) return null;
        const topKey = this.uiStack[this.uiStack.length - 1];
        return this.ui_nodes.get(topKey) || null;
    }

    public back(): boolean {
        if (!this.enableStack) {
            H.log.warn(`${this.name} 层未启用栈管理`);
            return false;
        }
        if (this.uiStack.length < 2) {
            H.log.warn(`${this.name} 层没有可返回的界面`);
            return false;
        }
        const currentViewId = this.uiStack[this.uiStack.length - 1];
        this.removeView(currentViewId);
        return true;
    }

    public closeAll(): void {
        if (!this.enableStack) {
            const viewIds = Array.from(this.nodeMap.keys());
            viewIds.forEach(viewId => this.removeView(viewId));
            return;
        }
        const toClose = [...this.uiStack].reverse();
        toClose.forEach(viewId => this.removeView(viewId));
    }

    protected onDestroy(): void {
        this.off(Node.EventType.CHILD_ADDED, this.onChildAdded, this);
        this.off(Node.EventType.CHILD_REMOVED, this.onChildRemoved, this);

        this.uiStack = [];

        this.hiddenNodes.forEach((node) => {
            if (node) {
                const view = node.getComponent(UIComptBase);
                view?.ui_before_destroy();
                view?.ui_on_destroy();
                node.destroy();
            }
        });
        this.hiddenNodes.clear();

        this.nodeMap.forEach((node) => {
            if (node) {
                const view = node.getComponent(UIComptBase);
                view?.ui_before_destroy();
                view?.ui_on_destroy();
                node.destroy();
            }
        });
        this.nodeMap.clear();
        this.ui_nodes.clear();
    }
}
