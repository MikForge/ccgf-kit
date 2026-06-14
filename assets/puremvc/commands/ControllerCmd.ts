import { INotification, SimpleCommand } from 'db://ccgf-kit/libs/puremvc';
import { MVCInternalRegistry } from 'db://ccgf-kit/decorators';

export default class ControllerCmd extends SimpleCommand {
    constructor() {
        super();
    }

    public execute(_note: INotification): void {
        for (const [key, cmdCls] of MVCInternalRegistry.getInstance().allCommands) {
            this.facade.registerCommand(key, () => new cmdCls());
        }
    }
}
