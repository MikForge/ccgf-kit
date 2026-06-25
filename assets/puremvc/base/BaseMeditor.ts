import { Mediator } from 'db://ccgf-kit/libs/puremvc/index';
import { Node } from 'cc';
import { UIComptBase } from 'db://ccgf-kit/gui/base/UIComptBase';

/**
 * 基础中介者
 * TView — 对应的 View 组件类型，通过泛型声明，onRegister 自动从 viewComponent 提取
 *
 * 生命周期：view 赋值 → registerEvents → onInit → onStart
 */
export class BaseMeditor<TView extends UIComptBase = UIComptBase> extends Mediator {

    data: any = null;
    protected view!: TView;
    public viewId: string;

    public constructor(name?: string, viewComponent?: any, data?: any, viewId?: string) {
        super(name, viewComponent);
        this.data = data;
        this.viewId = viewId ?? '';
    }

    public onRegister(): void {
        super.onRegister();

        const node = this.viewComponent as Node;
        this.view = node.getComponent(UIComptBase) as TView;

        this.registerEvents();
        this.onInit();
        this.onStart();
    }

    /** 注册事件。默认绑定 comBtnClose → closeSelf。子类覆盖时先调 super。 */
    protected registerEvents(): void {
        this.view.bindButtonByName('comBtnClose', () => this.closeSelf(), this);
    }

    protected closeSelf(): void {
        H.core.pmvcCloseView(this.viewId);
    }

    public onRemove(): void {
        this.onDestroy();
        super.onRemove();
    }

    protected onInit(): void { }

    protected onStart(): void { }

    protected onDestroy(): void { }

}
