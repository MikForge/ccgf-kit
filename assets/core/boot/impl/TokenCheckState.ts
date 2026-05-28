import { IState } from 'db://assets/core/utils';
import { CoreEvents } from 'db://assets/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

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
