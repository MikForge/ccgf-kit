import { Mediator } from 'db://ccgf-kit/libs/puremvc/index';

/**
 * 基础中介者 - 可添加通用功能
 */
export class BaseMeditor extends Mediator {

    data: any = null;

    public constructor(name?: string, viewComponent?: any, data?: any) {
        super(name, viewComponent);
        this.data = data;
    }

    public onRegister(): void {
        super.onRegister();
        this.onInit();
        this.onStart();
    }

    public onRemove(): void {
        this.onDestroy();
        super.onRemove();
    }

    protected onInit(): void { }

    protected onStart(): void { }

    protected onDestroy(): void { }

}
