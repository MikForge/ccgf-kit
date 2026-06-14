import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import type { CoreEventMap } from 'db://ccgf-kit/event';
import { BootState } from 'db://ccgf-kit/boot/defines/boot.enum';
import { BootContext } from 'db://ccgf-kit/boot/BootContext';

export class HotUpdateState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.HotUpdate;

    onEnter(_ctx: BootContext, _prevState: BootState): void {
        M.hotupdate.checkUpdate();
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.HOT_UPDATE_READY:
                ctx.resetRetry(BootState.HotUpdate);
                return BootState.SDKInit;

            case CoreEvents.HOT_UPDATE_FAILED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.HOT_UPDATE_FAILED];
                if (ctx.incrementRetry(BootState.HotUpdate)) {
                    return BootState.HotUpdate;
                }
                ctx.lastFailedState = BootState.HotUpdate;
                ctx.lastError = { code: 'HOT_UPDATE_FAILED', msg: data.error };
                return BootState.BootError;
            }

            default:
                return null;
        }
    }
}
