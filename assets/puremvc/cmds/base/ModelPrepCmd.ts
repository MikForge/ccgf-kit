import { SimpleCommand, INotification } from 'db://ccgf-kit/libs/puremvc/index';
import { registerProxyMetadata } from 'db://ccgf-kit/decorators/RegisterProxy';

export default class ModelPrepCmd extends SimpleCommand {

    constructor() {
        super();
    }

    public execute(notification: INotification): void {
        registerProxyMetadata.forEach((key, proxyCls) => {
            const proxyInstance = new proxyCls(key);
            this.facade.registerProxy(proxyInstance);
        });
    }


}
