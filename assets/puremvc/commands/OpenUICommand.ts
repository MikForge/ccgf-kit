import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc';
import { UIViewConfig, UIConfigRegistry } from 'db://ccgf-kit/gui';

interface UIParams {
    viewId: string;
    param?: any;
    preload?: boolean;
}

export default class OpenUICommand extends SimpleCommand {
    constructor() {
        super();
    }

    public async execute(notification: INotification): Promise<void> {
        const { viewId, param, preload } = notification.body as UIParams;

        let uiNode = await M.ui.open(viewId, {
            data: param,
            preload: preload
        });

        const uiConfig: UIViewConfig | null = UIConfigRegistry.getInstance().getConfigByViewId(viewId);

        if (uiConfig && uiConfig.meditorCls && uiNode) {
            const MediatorClass = uiConfig.meditorCls;
            const mediator = new MediatorClass(viewId, uiNode, param);
            this.facade.registerMediator(mediator);
        } else {
            H.log.error(`UI 配置错误或 UI 打开失败: ${viewId}. 配置: ${uiConfig ? JSON.stringify(uiConfig) : 'null'}, UI节点: ${uiNode ? '存在' : '不存在'}`);
        }
    }
}
