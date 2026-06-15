import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc';
import { UIMgr, UIViewConfig } from 'db://ccgf-kit/gui';
import { registerCommand, UIConfigRegistry } from 'db://ccgf-kit/decorators';
import { CmdManifest } from 'db://ccgf-kit/puremvc';

import { LogHelper } from 'db://ccgf-kit/helper';
import type { UIParams } from 'db://ccgf-kit/puremvc';

@registerCommand(CmdManifest.View.UI_OPEN)
export default class OpenUICommand extends SimpleCommand {
    constructor() {
        super();
    }

    public async execute(notification: INotification): Promise<void> {
        const { viewId, param, preload } = notification.body as UIParams;

        let uiNode = await UIMgr.getInstance().open(viewId, {
            data: param,
            preload: preload
        });

        const uiConfig: UIViewConfig | null = UIConfigRegistry.getInstance().getConfigByViewId(viewId);

        if (uiConfig && uiConfig.meditorCls && uiNode) {
            const MediatorClass = uiConfig.meditorCls;
            const mediator = new MediatorClass(viewId, uiNode, param);
            this.facade.registerMediator(mediator);
        } else {
            LogHelper.error(`UI 配置错误或 UI 打开失败: ${viewId}. 配置: ${uiConfig ? JSON.stringify(uiConfig) : 'null'}, UI节点: ${uiNode ? '存在' : '不存在'}`);
        }
    }
}
