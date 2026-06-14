import { Facade, IFacade } from "db://ccgf-kit/libs/puremvc";
import { CmdManifest } from "db://ccgf-kit/puremvc/CmdManifest";

export class GameFacade extends Facade implements IFacade {
    constructor() {
        super()
    }

    public static getInstance(): GameFacade {
        if (!this.instance) this.instance = new GameFacade();
        return <GameFacade>this.instance;
    }
    public startup(): void {
        this.sendNotification(CmdManifest.Base.STARTUP);
        this.removeCommand(CmdManifest.Base.STARTUP);
    }

    /**
     * 全局打开界面接口
     * @param viewId 界面ID
     * @param param 传递给界面的参数
     * @example
     * // 打开主界面
     * GameFacade.getInstance().openView(ViewId.MainUI);
     * 
     * // 打开带参数的界面
     * GameFacade.getInstance().openView(ViewId.PlayerInfo, { playerId: 12345 });
     */
    public openView(viewId: string, param?: any, preload: boolean = false): void {
        this.sendNotification(CmdManifest.View.UI_OPEN, { viewId: viewId, param: param, preload: preload });
    }

}