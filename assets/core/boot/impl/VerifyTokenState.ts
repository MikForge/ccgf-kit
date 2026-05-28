import { IState } from 'db://assets/core/utils';
import { CoreEvents } from 'db://assets/core/event';
import type { CoreEventMap } from 'db://assets/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class VerifyTokenState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.VerifyToken;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.verifyToken(ctx.sdkLoginResult);
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.TOKEN_VERIFIED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.TOKEN_VERIFIED];
                ctx.serverToken = data.token;
                ctx.resetRetry(BootState.VerifyToken);
                return BootState.ServerConnect;
            }

            case CoreEvents.TOKEN_VERIFY_FAILED:
                ctx.actions.clearCachedToken();
                ctx.resetRetry(BootState.VerifyToken);
                return BootState.PlatformLogin;

            default:
                return null;
        }
    }
}
