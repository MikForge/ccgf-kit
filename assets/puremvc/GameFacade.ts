import { Facade, ICommand, IFacade } from 'db://ccgf-kit/libs/puremvc/index';
import StartupCmd from 'db://ccgf-kit/puremvc/cmds/StartupCmd';
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import { CmdEnum } from 'db://ccgf-kit/puremvc/cmds/cmd.enum';

export class GameFacade extends Facade implements IFacade {
    constructor() {
        super()
    }

    public static getInstance(): GameFacade {
        if (!this.instance) this.instance = new GameFacade();
        return <GameFacade>this.instance;
    }


    protected initializeFacade(): void {
        super.initializeFacade();
        this.registerCommand(CmdEnum.STARTUP, () => new StartupCmd());

    }

    public registerCommand(notificationName: string, factory: () => ICommand): void {
        super.registerCommand(notificationName, factory);
        LogHelper.debug(`Registered command: ${notificationName}`);
    }

    public sendNotification(notificationName: string, body?: any, type?: string): void {
        if (this.hasCommand(notificationName) == false) {
            LogHelper.error(`No command registered for notification: ${notificationName}`);
        }
        super.sendNotification(notificationName, body, type);
        LogHelper.debug(`Sent notification: ${notificationName} with body: ${JSON.stringify(body)} and type: ${type}`);
    }


    public startup(): void {
        this.sendNotification(CmdEnum.STARTUP);

    }

}