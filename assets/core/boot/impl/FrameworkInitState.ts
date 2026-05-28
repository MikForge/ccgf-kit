import { IState } from 'db://assets/core/utils';
import { CoreEvents } from 'db://assets/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class FrameworkInitState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.FrameworkInit;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.startupFramework();
        ctx.fsm.transitionTo(BootState.HotUpdate);
    }
}
