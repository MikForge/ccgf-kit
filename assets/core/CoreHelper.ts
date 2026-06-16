import { GameFacade } from 'db://ccgf-kit/puremvc/GameFacade';
import { CmdEnum } from 'db://ccgf-kit/puremvc/cmds/cmd.enum';

export class CoreHelper {
    /**
     * 打开界面（PureMVC 通路）
     * @param viewId  界面 ID
     * @param param   传递给界面的参数
     */
    static pmvcOpenView(viewId: string, data?: any, preload?: boolean): void {
        GameFacade.getInstance().sendNotification(CmdEnum.UI_OPEN, { viewId, data, preload });
    }

    /**
     * 关闭界面（PureMVC 通路）
     * @param viewId 界面 ID
     */
    static pmvcCloseView(viewId: string): void {
        GameFacade.getInstance().sendNotification(CmdEnum.UI_CLOSE, viewId);
    }

    static pmvcStartup(): void {
        GameFacade.getInstance().startup();
    }
}
