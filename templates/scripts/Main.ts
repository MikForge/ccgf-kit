import 'db://assets/scripts/GlobalApi';
import { _decorator, Node } from 'cc';
import { GameBootstrap } from 'db://ccgf-kit/common';
import { TimerManager } from 'db://ccgf-kit/timer';
import { GameFacade, CmdManifest, StartupCmd } from 'db://ccgf-kit/puremvc';
// import { HttpServer } from 'db://ccgf-net-kit/net-http';
// import { AudioRegistry } from 'db://ccgf-kit/audio';
// import { audioManifest } from 'db://assets/scripts/audio/AudioManifest';
const { ccclass, property } = _decorator;



@ccclass('Main')
export class Main extends GameBootstrap {
    /** 游戏层节点 */
    @property({
        type: Node,
        tooltip: 'Game  Node',
    })
    gameRoot: Node = null!;

    /** UI 层节点 */
    @property({
        type: Node,
        tooltip: 'UI  Node',
    })
    uiRoot: Node = null!;


    protected onFrameworkReady(): void {
        M.timer = this.getPersistNode().addComponent(TimerManager);
        // AudioRegistry.getInstance().registerManifest(audioManifest);
        GameFacade.getInstance().registerCommand(CmdManifest.Base.STARTUP, () => new StartupCmd());
    }

    protected initUISystem(): void {

        M.ui.initLayer(this.uiRoot);

        // @deprecated UI_MANIFEST 已废弃，不再使用
        // M.ui.registerUIComponents(UI_MANIFEST);

        // M.net.http.setServerUrl(HttpServer.Platform, 'https://api.example.com/platform');

    }

    protected async onBeforeStartupAsync(): Promise<void> {
        // 配置加载已迁到 PullPlayerData 状态的 pullPlayerData action
    }

    protected onBeforeStartup(): void {
    }

    protected onStartupComplete(): void {
    }
}
