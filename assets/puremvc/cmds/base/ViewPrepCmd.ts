import { INotification, SimpleCommand } from 'db://ccgf-kit/libs/puremvc/index';

export default class ViewPrepCmd extends SimpleCommand {
    constructor() {
        super();
    }

    public execute(_note: INotification): void { }

}
