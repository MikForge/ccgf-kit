import type { ICommand } from 'db://ccgf-kit/libs/puremvc/index';

export type registerCmdCtor = new () => ICommand;

export const registerCmdMetadata = new Map<registerCmdCtor, string>();

export function registerCmd(key: string) {
    return function (cmdCls: registerCmdCtor): void {
        if (registerCmdMetadata.has(cmdCls)) {
            H.log.error(`Command class ${cmdCls.name} is already registered `);
            return;
        }
        registerCmdMetadata.set(cmdCls, key);
    };
}
