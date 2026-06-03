import { IState } from 'db://ccgf-kit/core/utils';
import { CoreEvents } from 'db://ccgf-kit/core/event';
import type { CoreEventMap } from 'db://ccgf-kit/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class SDKInitState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.SDKInit;

    onEnter(_ctx: BootContext, _prevState: BootState): void {
        M.sdk.init();
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.SDK_INIT_READY:
                ctx.resetRetry(BootState.SDKInit);
                return BootState.TokenCheck;

            case CoreEvents.SDK_INIT_FAILED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.SDK_INIT_FAILED];
                if (ctx.incrementRetry(BootState.SDKInit)) {
                    return BootState.SDKInit;
                }
                ctx.lastFailedState = BootState.SDKInit;
                ctx.lastError = { code: 'SDK_INIT_FAILED', msg: data.error };
                return BootState.BootError;
            }

            default:
                return null;
        }
    }
}
