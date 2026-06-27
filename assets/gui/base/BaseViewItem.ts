import { _decorator } from "cc";
import { UIComptBase } from "db://ccgf-kit/gui/base/UIComptBase";
import type { IUILifecycle } from 'db://ccgf-kit/gui/IUiStructs';

const { ccclass } = _decorator;

/**
 * View 内部子组件基类
 *
 * 继承 UIComptBase 全部能力：
 *   - v_nodes / v_compts（UIContainer 节点/组件绑定）
 *   - bindEvent / bindButton / bindButtonByName（自动清理的事件管理）
 *   - 完整 IUILifecycle 钩子（ui_on_init / ui_on_show / ui_on_hide / ...）
 *
 * 语义约定：
 *   - 标注为 BaseView 的直属子项
 *   - 级联深度一层：BaseView → BaseViewItem
 *   - 子类直接重写 ui_on_*，无需调用 super
 */
@ccclass('BaseViewItem')
export class BaseViewItem extends UIComptBase implements IUILifecycle {

    public ui_on_preload(): void {

    }

    public ui_on_init(): void {
    }

    public ui_on_show(): void {
    }

    public ui_on_hide(): void {
    }

    public ui_on_refresh(data: any): void {
    }

    public ui_before_destroy(): void {
    }

    public ui_on_destroy(): void {
    }


}
