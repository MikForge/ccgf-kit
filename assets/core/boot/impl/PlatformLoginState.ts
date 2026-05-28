import { IState } from 'db://assets/core/utils';
import { CoreEvents } from 'db://assets/core/event';
import type { CoreEventMap } from 'db://assets/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class PlatformLoginState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.PlatformLogin;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.clearCachedToken();
        ctx.actions.openLoginUI();
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.SDK_LOGIN_SUCCESS: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.SDK_LOGIN_SUCCESS];
                ctx.sdkLoginResult = data.credential;
                ctx.resetRetry(BootState.PlatformLogin);
                return BootState.VerifyToken;
            }

            case CoreEvents.SDK_LOGIN_FAILED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.SDK_LOGIN_FAILED];
                if (data.canceled) return null;
                if (ctx.incrementRetry(BootState.PlatformLogin)) {
                    return BootState.PlatformLogin;
                }
                ctx.lastFailedState = BootState.PlatformLogin;
                ctx.lastError = { code: 'SDK_LOGIN_FAILED', msg: data.error };
                return BootState.BootError;
            }

            default:
                return null;
        }
    }
}
