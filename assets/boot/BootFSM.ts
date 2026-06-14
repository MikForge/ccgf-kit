import { FSM } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import type { CoreEventMap } from 'db://ccgf-kit/event';
import { BootState } from 'db://ccgf-kit/boot/defines/boot.enum';
import { BootContext } from 'db://ccgf-kit/boot/BootContext';
import { FrameworkInitState } from 'db://ccgf-kit/boot/impl/FrameworkInitState';
import { HotUpdateState } from 'db://ccgf-kit/boot/impl/HotUpdateState';
import { SDKInitState } from 'db://ccgf-kit/boot/impl/SDKInitState';
import { TokenCheckState } from 'db://ccgf-kit/boot/impl/TokenCheckState';
import { PlatformLoginState } from 'db://ccgf-kit/boot/impl/PlatformLoginState';
import { VerifyTokenState } from 'db://ccgf-kit/boot/impl/VerifyTokenState';
import { ServerConnectState } from 'db://ccgf-kit/boot/impl/ServerConnectState';
import { PullPlayerDataState } from 'db://ccgf-kit/boot/impl/PullPlayerDataState';
import { EnterGameState } from 'db://ccgf-kit/boot/impl/EnterGameState';
import { BootErrorState } from 'db://ccgf-kit/boot/impl/BootErrorState';

/** BootFSM 需要桥接的 CoreEvents 列表 */
const BRIDGE_EVENTS: CoreEvents[] = [
    CoreEvents.HOT_UPDATE_READY,
    CoreEvents.HOT_UPDATE_FAILED,
    CoreEvents.SDK_INIT_READY,
    CoreEvents.SDK_INIT_FAILED,
    CoreEvents.SDK_LOGIN_SUCCESS,
    CoreEvents.SDK_LOGIN_FAILED,
    CoreEvents.TOKEN_VERIFIED,
    CoreEvents.TOKEN_VERIFY_FAILED,
    CoreEvents.NET_CONNECTED,
    CoreEvents.NET_DISCONNECTED,
    CoreEvents.PLAYER_DATA_READY,
    CoreEvents.PLAYER_DATA_FAILED,
];

export class BootFSM extends FSM<BootState, CoreEvents, BootContext> {
    /** 持有上下文引用，供事件桥接回调使用（基类 context 为 private） */
    private _ctx: BootContext;

    constructor(ctx: BootContext) {
        super({ initialState: BootState.FrameworkInit }, ctx);
        this._ctx = ctx;
        ctx.fsm = this;

        this.registerStates([
            new FrameworkInitState(),
            new HotUpdateState(),
            new SDKInitState(),
            new TokenCheckState(),
            new PlatformLoginState(),
            new VerifyTokenState(),
            new ServerConnectState(),
            new PullPlayerDataState(),
            new EnterGameState(),
            new BootErrorState(),
        ]);

        // 桥接 CoreEvents → handleEvent
        this.setupEventBridge();

        // 启动流程日志
        this.onTransition((from, to, event) => {
            H.log.info("BootFSM", `${from} → ${to}${event ? ` (${event})` : ''}`);
        });

        // 启动状态机
        this.start();
    }

    /** 桥接 M.event 到 FSM.handleEvent */
    private setupEventBridge(): void {
        for (const e of BRIDGE_EVENTS) {
            M.event.on(e, (data: CoreEventMap[keyof CoreEventMap]) => {
                this._ctx.lastEventData = data;
                this.handleEvent(e);
            }, this);
        }
    }

    /** 销毁：清理桥接监听 + FSM 资源 */
    public destroy(): void {
        M.event.targetOff(this);
        super.destroy();
    }
}
