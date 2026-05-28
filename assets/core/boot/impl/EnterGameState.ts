import { IState } from 'db://assets/core/utils';
import { CoreEvents } from 'db://assets/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class EnterGameState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.EnterGame;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.openStartupGameUI();
    }
}
