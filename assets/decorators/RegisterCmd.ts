import type { ICommand } from 'db://ccgf-kit/libs/puremvc/index';
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';

export type registerCmdCtor = new () => ICommand;

export const registerCmdMetadata = new Map<registerCmdCtor, string>();

export function registerCmd(key: string) {
    return function (cmdCls: registerCmdCtor): void {
        if (registerCmdMetadata.has(cmdCls)) {
            LogHelper.error(`Command class ${cmdCls.name} is already registered `);
            return;
        }
        registerCmdMetadata.set(cmdCls, key);
    };
}
