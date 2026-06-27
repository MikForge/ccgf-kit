import { instantiate, Node, Prefab } from "cc";
import { UIHelper } from "db://ccgf-kit/gui/UIHelper";
import { Stack } from "db://ccgf-kit/utils/struct/Stack";
import { BaseView } from "db://ccgf-kit/gui/base/BaseView";
import { UIViewState } from "db://ccgf-kit/gui/base/UIViewState";

import { UIRegistry } from 'db://ccgf-kit/decorators/UIRegistry';

export class UILayerNodeBase extends Node {

    onOpenFailure: Function = null!;

    protected ui_nodes = new Map<string, UIViewState>();
    protected nodeMap = new Map<string, Node>();
    protected hiddenNodes = new Map<string, Node>();
    protected uiStack: Stack<string> = new Stack<string>();

    constructor(
        name: string
    ) {
        super(name);
        UIHelper.setFullScreen(this);
        this.on(Node.EventType.CHILD_ADDED, this.onChildAdded, this);
        this.on(Node.EventType.CHILD_REMOVED, this.onChildRemoved, this);
    }

    protected onChildAdded(child: Node): void { }
    protected onChildRemoved(child: Node): void { }

    public async addView(uiInfo: UIViewState): Promise<Node> {
        const viewId = uiInfo.viewId;

        if (this.hiddenNodes.has(viewId)) {
            H.log.debug(`从隐藏池恢复界面: ${viewId}`);
            return this.restoreView(viewId);
        }

        if (this.nodeMap.has(viewId)) {
            const node = this.nodeMap.get(viewId)!;
            H.log.debug(`界面已存在，提升到栈顶: ${viewId}`);
            this.pushToStack(viewId);
            node.active = true;
            return node;
        }

        const node = await this.load(uiInfo);

        // B3: load 失败时 node 为 null，不写入 Map
        if (!node) return null!;

        this.ui_nodes.set(viewId, uiInfo);

        this.nodeMap.set(viewId, node);

        this.pushToStack(viewId);

        return node;
    }

    public removeView(viewId: string): void {
        const uiInfo = this.ui_nodes.get(viewId);
        const isHidden = this.hiddenNodes.has(viewId);
        const node = this.nodeMap.get(viewId) ?? this.hiddenNodes.get(viewId);
        if (!uiInfo || !node) return;

        this.popFromStack(viewId);

        let needRelease: boolean = !uiInfo.config.destroy
        needRelease = needRelease || isHidden;

        const view = node.getComponent(BaseView);

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

        this.restoreTopView();
    }

    /** 向已显示的界面推送新数据（不关闭重开） */
    public refreshView(viewId: string, data: any): void {
        const node = this.nodeMap.get(viewId);
        const view = node?.getComponent(BaseView);
        view?.ui_on_refresh(data);
    }

    protected async load(uiInfo: UIViewState): Promise<Node> {
        const { prefabKey: key, bundle } = uiInfo.config;

        let timerId = setTimeout(this.onLoadingTimeoutGui, 1000);

        const prefab = await M.res.loadPrefab({ pathkey: key, bundle, type: Prefab });
        if (!prefab) {
            this.failure(uiInfo);
            clearTimeout(timerId);
            return null!;
        }

        const viewCtor = UIRegistry.getInstance().getViewClass(uiInfo.viewId);
        if (!viewCtor) {
            H.log.error(`[UIMgr] load: viewCtor 为空，key: ${key}`);
            M.res.release({ pathkey: key, bundle, type: Prefab });
            this.failure(uiInfo);
            clearTimeout(timerId);
            return null!;
        }

        const node = instantiate(prefab);
        let item = node.getComponent(viewCtor) as BaseView | null;
        if (!item) item = node.addComponent(viewCtor);

        item.viewId = uiInfo.viewId ?? key;
        
        item.ui_on_init(uiInfo.params.data);

        clearTimeout(timerId);
        uiInfo.valid = true;

        if (!uiInfo.params.preload) {
            node.parent = this;
            const view = node.getComponent(BaseView);
            view?.ui_on_show();
        }

        return node;
    }

    private onLoadingTimeoutGui(): void { }

    protected failure(uiInfo: UIViewState): void {
        this._releaseRes(uiInfo);
        this.onOpenFailure && this.onOpenFailure();
    }

    private _releaseRes(uiInfo: UIViewState): void {
        M.res.release({ pathkey: uiInfo.config.prefabKey, bundle: uiInfo.config.bundle, type: Prefab });
        H.log.info(`【界面管理】释放【${uiInfo.config.prefabKey}】界面资源`);
    }

    protected hideView(viewId: string): void {
        const uiInfo = this.ui_nodes.get(viewId);
        const node = this.nodeMap.get(viewId);
        if (!node) return;

        const view = node.getComponent(BaseView);
        view?.ui_on_hide();

        this.nodeMap.delete(viewId);
        this.hiddenNodes.set(viewId, node);

        this.uiStack.remove(viewId);

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

        this.pushToStack(viewId);

        node.parent = this;
        node.active = true;

        const view = node.getComponent(BaseView);
        view?.ui_on_show();

        const uiInfo = this.ui_nodes.get(viewId);
        if (uiInfo) uiInfo.valid = true;

        H.log.debug(`界面已恢复: ${viewId}`);
        return node;
    }

    protected pushToStack(viewId: string): void {
        this.uiStack.remove(viewId);
        this.uiStack.push(viewId);
        this.updateZOrder();
        const members: string[] = [];
        this.uiStack.forEach(v => members.push(v));
        H.log.debug(`[${this.name}] 界面栈: [${members.join(' → ')}]`);
    }

    protected popFromStack(viewId: string): void {
        this.uiStack.remove(viewId);
        this.updateZOrder();
    }

    protected restoreTopView(): void {
        if (this.uiStack.isEmpty()) return;
        const topKey = this.uiStack.peek();
        if (!topKey) return;
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
        if (this.uiStack.isEmpty()) return null;
        const topKey = this.uiStack.peek();
        if (!topKey) return null;
        return this.nodeMap.get(topKey) || null;
    }

    public getTopViewState(): UIViewState | null {
        if (this.uiStack.isEmpty()) return null;
        const topKey = this.uiStack.peek();
        if (!topKey) return null;
        return this.ui_nodes.get(topKey) || null;
    }

    public back(): boolean {
        if (this.uiStack.size() < 2) {
            H.log.warn(`${this.name} 层没有可返回的界面`);
            return false;
        }
        const currentViewId = this.uiStack.peek();
        if (!currentViewId) return false;
        this.removeView(currentViewId);
        return true;
    }

    public closeAll(): void {
        const toClose: string[] = [];
        this.uiStack.forEach(v => toClose.push(v));
        toClose.reverse();
        toClose.forEach(viewId => this.removeView(viewId));
    }

    protected onDestroy(): void {
        this.off(Node.EventType.CHILD_ADDED, this.onChildAdded, this);
        this.off(Node.EventType.CHILD_REMOVED, this.onChildRemoved, this);

        this.uiStack.clear();

        this.hiddenNodes.forEach((node) => {
            if (node) {
                const view = node.getComponent(BaseView);
                view?.ui_on_destroy();
                node.destroy();
            }
        });
        this.hiddenNodes.clear();

        this.nodeMap.forEach((node) => {
            if (node) {
                const view = node.getComponent(BaseView);
                view?.ui_on_destroy();
                node.destroy();
            }
        });
        this.nodeMap.clear();
        this.ui_nodes.clear();
    }

}
