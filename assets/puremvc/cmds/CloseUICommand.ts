import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc/index';
import { UIRegistry } from 'db://ccgf-kit/decorators/UIRegistry';
import { registerCmd } from 'db://ccgf-kit/decorators/RegisterCmd';
import type { UIViewConfig } from 'db://ccgf-kit/gui/IUiStructs';
import { CmdEnum } from 'db://ccgf-kit/puremvc/cmds/cmd.enum';

@registerCmd(CmdEnum.UI_CLOSE)
export default class CloseUICommand extends SimpleCommand {
    constructor() {
        super();
    }

    public execute(notification: INotification): void {

        const uiName = notification.body as string;

        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(uiName);
        const mediatorCtor = UIRegistry.getInstance().getMediatorClass(uiName);

        // 移除mediator
        if (mediatorCtor) {
            const mediatorName = mediatorCtor.name;
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
