import type { NetData } from 'db://ccgf-kit/net/defines/net-structs';

/** 响应协议 */
export interface IResponsePacket {
    /** 协议命令编号 */
    cmd: string,
    /** 协议数据 */
    data?: NetData,
}


/** 请求协议 */
export interface IRequestPacket {
    /** 协议命令编号 */
    cmd: string,
    /** 消息内容 */
    data?: NetData;
}


export interface IPacketHandler {
    /** 获取协议头长度 */
    getHeadlen(): number;
    /** 返回一个心跳包 */
    getHeartbeatPacket(): NetData;
    /** 返回 整个包的长度 */
    getPacketLength(msg: NetData): number;
    /** 检查包数据是否合法  */
    checkPackage(msg: NetData): boolean;
    /** 获取包的命令编号 */
    getPackageId(msg: NetData): number;
    // ========== 编码：业务对象 → 网络字节 ==========
    encodeRequest(packet: IRequestPacket): NetData;
    // ========== 解码：网络字节 → 业务对象 ==========
    decodeResponse(data: NetData): IResponsePacket;

}