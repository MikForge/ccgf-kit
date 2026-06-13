import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class FrameworkInitState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.FrameworkInit;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.startupFramework();
        ctx.fsm.transitionTo(BootState.HotUpdate);
    }
}
