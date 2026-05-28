
import { NetConnectOptions, NetData } from "../defines/net-structs";
import { BaseSocket } from "../base/BaseSocket";

/**
 * Soket.IO协议适配器
 * coco 引擎自带的soket.io-client已不维护，且版本过低，建议使用第三方库
 */
export class SoketIOImpl extends BaseSocket {


    public connect(options: NetConnectOptions): boolean {
        return true;
    }

    public close(code?: number, reason?: string): void {

    }

    public send(data: NetData): boolean {
        return true;
    }

}