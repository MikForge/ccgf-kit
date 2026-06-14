import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import type { CoreEventMap } from 'db://ccgf-kit/event';
import { BootState } from 'db://ccgf-kit/boot/defines/boot.enum';
import { BootContext } from 'db://ccgf-kit/boot/BootContext';

export class ServerConnectState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.ServerConnect;

    onEnter(_ctx: BootContext, _prevState: BootState): void {
        M.net.connect();
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.NET_CONNECTED:
                ctx.resetRetry(BootState.ServerConnect);
                return BootState.PullPlayerData;

            case CoreEvents.NET_DISCONNECTED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.NET_DISCONNECTED];
                if (data.code === 4002 /* NetErrorCode.AUTH_FAILED */) {
                    ctx.actions.clearCachedToken();
                    return BootState.PlatformLogin;
                }
                if (ctx.incrementRetry(BootState.ServerConnect)) {
                    return BootState.ServerConnect;
                }
                ctx.lastFailedState = BootState.ServerConnect;
                ctx.lastError = { code: 'NET_DISCONNECTED', msg: data.reason };
                return BootState.BootError;
            }

            default:
                return null;
        }
    }
}
