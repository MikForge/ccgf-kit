import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc/index';
import { UIMgr } from 'db://ccgf-kit/gui/UIMgr';
import type { UIOpenParams, UIViewConfig } from 'db://ccgf-kit/gui/IUiStructs';
import { UIRegistry } from 'db://ccgf-kit/decorators/UIRegistry';
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import { registerCmd } from 'db://ccgf-kit/decorators/RegisterCmd';
import { CmdEnum } from 'db://ccgf-kit/puremvc/cmds/cmd.enum';

@registerCmd(CmdEnum.UI_OPEN)
export default class OpenUICommand extends SimpleCommand {
    
    constructor() {
        super();
    }

    public async execute(notification: INotification): Promise<void> {
        const { viewId, data, preload } = notification.body as UIOpenParams;

        let uiNode = await UIMgr.getInstance().open(viewId, { viewId, data, preload });

        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);

        if (uiConfig && uiConfig.meditorCls && uiNode) {
            if(this.facade.hasMediator(uiConfig.meditorCls.name)) {
                LogHelper.error(`Mediator ${uiConfig.meditorCls.name} 已经注册，可能存在重复打开同一界面的问题。`);
                return;
            }
            const MediatorClass = uiConfig.meditorCls;
            const mediator = new MediatorClass(viewId, uiNode, data);
            this.facade.registerMediator(mediator);
        } else {
            LogHelper.error(`UI 配置错误或 UI 打开失败: ${viewId}. 配置: ${uiConfig ? JSON.stringify(uiConfig) : 'null'}, UI节点: ${uiNode ? '存在' : '不存在'}`);
        }
    }
}
