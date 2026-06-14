import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import type { CoreEventMap } from 'db://ccgf-kit/event';
import { BootState } from 'db://ccgf-kit/boot/defines/boot.enum';
import { BootContext } from 'db://ccgf-kit/boot/BootContext';

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
