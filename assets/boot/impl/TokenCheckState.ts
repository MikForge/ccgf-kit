import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import { BootState } from 'db://ccgf-kit/boot/defines/boot.enum';
import { BootContext } from 'db://ccgf-kit/boot/BootContext';

export class TokenCheckState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.TokenCheck;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        const token = ctx.actions.getCachedToken();
        if (token) {
            ctx.cachedToken = token;
            ctx.fsm.transitionTo(BootState.ServerConnect);
        } else {
            ctx.fsm.transitionTo(BootState.PlatformLogin);
        }
    }
}
