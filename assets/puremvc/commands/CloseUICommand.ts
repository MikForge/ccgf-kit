import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc';
import { UIViewConfig, UIConfigRegistry } from 'db://ccgf-kit/gui';


export default class CloseUICommand extends SimpleCommand {
    constructor() {
        super();
    }

    public execute(notification: INotification): void {

        const uiName = notification.body as string;

        const uiConfig: UIViewConfig | null = UIConfigRegistry.getInstance().getConfigByViewId(uiName);

        // 移除mediator
        if (uiConfig && uiConfig.meditorCls) {
            const mediatorName = uiConfig.meditorCls.name;
            if (this.facade.hasMediator(mediatorName)) {
                this.facade.removeMediator(mediatorName);
            } else {
                H.log.warn(`尝试移除 Mediator ${mediatorName}，但它未注册。`);
            }
        } else {
            H.log.warn(`UI 配置错误: 无法找到 ViewId ${uiName} 的配置或 meditorCls。`);
        }

        // 再关闭 UI
        M.ui.close(uiName);
    }
}
