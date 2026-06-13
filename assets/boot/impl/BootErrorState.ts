import { IState } from 'db://ccgf-kit/utils';
import { CoreEvents } from 'db://ccgf-kit/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class BootErrorState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.BootError;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.openErrorUI({
            error: ctx.lastError!,
            onRetry: () => {
                const target = ctx.lastFailedState!;
                ctx.resetRetry(target);
                ctx.fsm.transitionTo(target);
            },
        });
    }
}
