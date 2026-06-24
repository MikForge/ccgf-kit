
import type { NetConnectOptions, NetData } from 'db://ccgf-kit/net/defines/net-structs';
import { BaseSocket } from 'db://ccgf-kit/net/base/BaseSocket';

/**
 * Soket.IO协议适配器
 * coco 引擎自带的soket.io-client已不维护，且版本过低，建议使用第三方库
 */
export class SocketIOImpl extends BaseSocket {


    public connect(options: NetConnectOptions): boolean {
        return true;
    }

    public close(code?: number, reason?: string): void {

    }

    public send(data: NetData): boolean {
        return true;
    }

}