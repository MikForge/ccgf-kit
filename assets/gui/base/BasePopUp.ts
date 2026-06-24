import { _decorator, Prefab, Node, isValid } from 'cc';
import { BaseView } from 'db://ccgf-kit/gui/base/BaseView';
import { UIMgr } from 'db://ccgf-kit/gui/UIMgr';
import { ResMgr } from 'db://ccgf-kit/res/ResMgr';
import { UIHelper } from 'db://ccgf-kit/gui/UIHelper';
import { CoreHelper } from '../../core/CoreHelper';

const { ccclass } = _decorator;

@ccclass('BasePopUp')
export class BasePopUp extends BaseView {
    private _maskNode: Node | null = null;

    /** 根据 viewConfig 中的 mask 字段判定是否启用遮罩，未配置时默认 true */
    protected get maskEnabled(): boolean {
        return this.viewConfig?.mask ?? true;
    }

    protected async onInit(data: any): Promise<boolean> {
        await this._loadAndMountMask();

        if (this._maskNode && isValid(this._maskNode)) {
            this.bindButton(this._maskNode, () => {
                UIMgr.getInstance().close(this.viewId);
            });
        }

        return super.onInit(data);
    }

    private async _loadAndMountMask(): Promise<void> {
        if (!this.maskEnabled) return;

        let maskPrefab: Prefab | null = null;
        try {
            maskPrefab = await ResMgr.getInstance().loadPrefab('ComMask', 'resources');
        } catch {
            maskPrefab = null;
        }

        if (!maskPrefab || !isValid(this.node)) return;

        const maskNode = UIHelper.instantiateFirstChild(maskPrefab, this.node);
        if (!maskNode) return;

        this._maskNode = maskNode;

        this.bindButton(maskNode, () => {
           CoreHelper.pmvcCloseView(this.viewId);
        });
    }

    protected onShow(data?: any): void {
        super.onShow(data);
    }

    protected onDestroy_(): void {
        if (this._maskNode && isValid(this._maskNode)) {
            this._maskNode.destroy();
        }
        this._maskNode = null;
        super.onDestroy_();
    }
}
