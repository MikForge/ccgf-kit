import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc';
import { MVCInternalRegistry } from 'db://ccgf-kit/decorators';

export default class ModelPrepCmd extends SimpleCommand {

    constructor() {
        super();
    }

    public execute(notification: INotification): void {
        for (const [_, proxyCls] of MVCInternalRegistry.getInstance().allModels) {
            this.facade.registerProxy(new proxyCls());
        }
    }
}
