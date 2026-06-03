import { IState } from 'db://ccgf-kit/core/utils';
import { CoreEvents } from 'db://ccgf-kit/core/event';
import type { CoreEventMap } from 'db://ccgf-kit/core/event';
import { BootState } from '../defines/boot.enum';
import { BootContext } from '../BootContext';

export class PullPlayerDataState implements IState<BootState, CoreEvents, BootContext> {
    readonly name = BootState.PullPlayerData;

    onEnter(ctx: BootContext, _prevState: BootState): void {
        ctx.actions.pullPlayerData();
    }

    handleEvent(event: CoreEvents, ctx: BootContext): BootState | null {
        switch (event) {
            case CoreEvents.PLAYER_DATA_READY:
                ctx.resetRetry(BootState.PullPlayerData);
                return BootState.EnterGame;

            case CoreEvents.PLAYER_DATA_FAILED: {
                const data = ctx.lastEventData as CoreEventMap[CoreEvents.PLAYER_DATA_FAILED];
                if (ctx.incrementRetry(BootState.PullPlayerData)) {
                    return BootState.PullPlayerData;
                }
                ctx.lastFailedState = BootState.PullPlayerData;
                ctx.lastError = { code: 'PLAYER_DATA_FAILED', msg: data.error };
                return BootState.BootError;
            }

            default:
                return null;
        }
    }
}
