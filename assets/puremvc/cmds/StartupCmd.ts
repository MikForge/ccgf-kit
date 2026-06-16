import { INotification, MacroCommand } from 'db://ccgf-kit/libs/puremvc/index';
import ModelPrepCmd from 'db://ccgf-kit/puremvc/cmds/base/ModelPrepCmd';
import ViewPrepCmd from 'db://ccgf-kit/puremvc/cmds/base/ViewPrepCmd';
import ControllerCmd from 'db://ccgf-kit/puremvc/cmds/base/ControllerCmd';

export default class StartupCmd extends MacroCommand {
    constructor() {
        super();
    }

    public initializeMacroCommand(): void {
        /**
         * 命令会按照"先进先出"（FIFO）的顺序被执行.
         * 在用户与数据交互之前，Model必须处于一种一致的已知的状态.
         * 一旦Model 初始化完成，View视图就可以显示数据允许用户操作与之交互.
         */
        this.addSubCommand(() => new ModelPrepCmd());
        this.addSubCommand(() => new ViewPrepCmd());
        this.addSubCommand(() => new ControllerCmd());
    }

    public execute(notification: INotification): void {
        super.execute(notification);
    }
}
