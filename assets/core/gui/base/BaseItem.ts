import { _decorator } from 'cc';
import { UIComptBase } from 'db://assets/core/gui';

const { ccclass } = _decorator;

/**
 * 子组件基类（Template Method 模式）
 *
 * 框架约定：
 *   - 子类只重写 on* 系列（保护钩子），不重写 ui_on_* 公开入口
 *   - 无需调用 super.onXxx()
 *   - 在父 BaseView.onInit() 里通过 registerSubView() 或 mountSubComp() 纳入生命周期级联
 */
@ccclass('BaseItem')
export class BaseItem extends UIComptBase {

    override async ui_on_init(data: any): Promise<boolean> {
        if (!await super.ui_on_init(data)) return false;
        return await this.onInit(data);
    }

    override ui_on_show(data?: any): void   { this.onShow(data); }
    override ui_on_hide(): void              { this.onHide(); }
    override ui_on_refresh(data: any): void  { this.onRefresh(data); }
    override ui_before_destroy(): void       { this.onBeforeDestroy(); }
    override ui_on_destroy(): void           { this.onDestroy_(); }

    protected async onInit(data: any): Promise<boolean> { return true; }
    protected onShow(data?: any): void {}
    protected onHide(): void {}
    protected onRefresh(data: any): void {}
    protected onBeforeDestroy(): void {}
    protected onDestroy_(): void {}
}
