import { registerCmdMetadata } from 'db://ccgf-kit/decorators/RegisterCmd';
import { INotification, SimpleCommand } from 'db://ccgf-kit/libs/puremvc/index';

export default class ControllerCmd extends SimpleCommand {
    constructor() {
        super();
    }

    public execute(_note: INotification): void {
        registerCmdMetadata.forEach((key, cmdCls) => {
            this.facade.registerCommand(key, () => new cmdCls());
        });
    }
}
