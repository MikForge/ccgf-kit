import type { NetData } from 'db://ccgf-kit/net/defines/net-structs';
import type { IPacketHandler, IRequestPacket, IResponsePacket } from 'db://ccgf-kit/net/base/IPacketHandler';
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';

/**
 * JSON协议包处理器
 * 
 * 协议格式:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 请求包 (Request Packet)                                      │
 * ├──────────┬────────┬──────────┬──────────┬──────────────────┤
 * │ 魔数(4)  │版本(4) │消息ID(4) │长度(4)   │ JSON消息体(N)    │
 * └──────────┴────────┴──────────┴──────────┴──────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 响应包 (Response Packet)                                     │
 * ├──────────┬────────┬──────────┬──────────┬──────────────────┤
 * │ 魔数(4)  │版本(4) │消息ID(4) │长度(4)   │ JSON消息体(N)    │
 * └──────────┴────────┴──────────┴──────────┴──────────────────┘
 */
export class JsonPacketHandler implements IPacketHandler {

    /** 协议魔数 */
    private readonly MAGIC_NUMBER = 0x4A534F4E; // "JSON" 的 ASCII
    /** 协议版本号 */
    private readonly VERSION = 1.0;

    /** 魔数字节长度 */
    private readonly MAGIC_NUMBER_SIZE = 4;
    /** 版本号字节长度 */
    private readonly VERSION_SIZE = 4;
    /** 消息ID字节长度 */
    private readonly MESSAGE_ID_SIZE = 4;
    /** 消息体长度字节长度 */
    private readonly MESSAGE_LENGTH_SIZE = 4;

    /** 心跳协议号 */
    private readonly HEARTBEAT_CMD = 1000;
    /** 通用错误协议号 */
    private readonly ERROR_CMD = 0xFFFF;

    /** 获取协议头长度 */
    getHeadlen(): number {
        return this.MAGIC_NUMBER_SIZE +
            this.VERSION_SIZE +
            this.MESSAGE_ID_SIZE +
            this.MESSAGE_LENGTH_SIZE;
    }

    /**
     * 解析包头 (公共方法)
     * @param data 网络数据
     * @returns 包头信息,失败返回 null
     */
    private parseHeader(data: NetData): PacketHeader | null {
        if (typeof data === 'string') {
            LogHelper.error("JsonPacketHandler", "parseHeader: Data should not be string type.");
            return null;
        }

        let uint8Data: Uint8Array;
        if (data instanceof Uint8Array) {
            uint8Data = data;
        } else if (data instanceof ArrayBuffer) {
            uint8Data = new Uint8Array(data);
        } else if (ArrayBuffer.isView(data)) {
            uint8Data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        } else {
            LogHelper.error("JsonPacketHandler", "parseHeader: Unsupported data type.");
            return null;
        }

        if (uint8Data.length < this.getHeadlen()) {
            LogHelper.error("JsonPacketHandler", "parseHeader: Data length is less than header length.");
            return null;
        }

        const dataView = new DataView(uint8Data.buffer, uint8Data.byteOffset);
        let offset = 0;

        // 读取魔数
        const magicNumber = dataView.getUint32(offset, false);
        offset += this.MAGIC_NUMBER_SIZE;

        // 读取版本号
        const version = dataView.getFloat32(offset, false);
        offset += this.VERSION_SIZE;

        // 读取消息ID
        const messageId = dataView.getUint32(offset, false);
        offset += this.MESSAGE_ID_SIZE;

        // 读取消息体长度
        const messageLength = dataView.getUint32(offset, false);

        return {
            magicNumber,
            version,
            messageId,
            messageLength
        };
    }

    /** 返回一个心跳包 */
    getHeartbeatPacket(): NetData {
        const heartbeatData = {
            timestamp: Date.now()
        };

        const requestPacket: IRequestPacket = {
            cmd: this.HEARTBEAT_CMD.toString(),
            data: JSON.stringify(heartbeatData)
        };

        return this.encodeRequest(requestPacket);
    }

    /** 返回整个包的长度 */
    getPacketLength(msg: NetData): number {
        const header = this.parseHeader(msg);
        if (!header) {
            return 0;
        }

        // 总包长度 = 头部长度 + 消息体长度
        return this.getHeadlen() + header.messageLength;
    }

    /** 检查包数据是否合法 */
    checkPackage(msg: NetData): boolean {
        const header = this.parseHeader(msg);
        if (!header) {
            return false;
        }

        // 验证魔数
        if (header.magicNumber !== this.MAGIC_NUMBER) {
            LogHelper.error("JsonPacketHandler", "checkPackage: Invalid magic number.");
            return false;
        }

        // 验证版本号
        if (header.version !== this.VERSION) {
            LogHelper.error("JsonPacketHandler", "checkPackage: Unsupported version.");
            return false;
        }

        return true;
    }

    /** 获取包的命令编号 */
    getPackageId(msg: NetData): number {
        const header = this.parseHeader(msg);
        if (!header) {
            return 0;
        }

        return header.messageId;
    }

    /** 编码请求 */
    encodeRequest(packet: IRequestPacket): NetData {
        
        // 1. 将数据转换为 JSON 字符串
        let jsonString: string;
        if (typeof packet.data === 'string') {
            jsonString = packet.data;
        } else if (packet.data) {
            try {
                jsonString = JSON.stringify(packet.data);
            } catch (error) {
                LogHelper.error("JsonPacketHandler", "encodeRequest: Failed to stringify data:", error);
                return null;
            }
        } else {
            jsonString = '{}';
        }

        // 2. 转换为字节数组
        const bodyData = new TextEncoder().encode(jsonString);
        const dataLen = bodyData.length;

        // 3. 构建数据包
        const totalLen = this.getHeadlen() + dataLen;
        const newPacket = new Uint8Array(totalLen);
        const cmdView = new DataView(newPacket.buffer);

        let offset = 0;

        // 写入魔数
        cmdView.setUint32(offset, this.MAGIC_NUMBER, false);
        offset += this.MAGIC_NUMBER_SIZE;

        // 写入版本号
        cmdView.setFloat32(offset, this.VERSION, false);
        offset += this.VERSION_SIZE;

        // 写入消息ID
        cmdView.setUint32(offset, parseInt(packet.cmd), false);
        offset += this.MESSAGE_ID_SIZE;

        // 写入消息体长度
        cmdView.setUint32(offset, dataLen, false);
        offset += this.MESSAGE_LENGTH_SIZE;

        // 写入消息体
        if (dataLen > 0) {
            newPacket.set(bodyData, offset);
        }

        return newPacket;
    }

    /** 解码响应 */
    decodeResponse(data: NetData): IResponsePacket {
        
        // 1. 解析包头
        const header = this.parseHeader(data);
        if (!header) {
            LogHelper.error("JsonPacketHandler", "decodeResponse: Failed to parse header.");
            return null;
        }

        // 2. 验证魔数
        if (header.magicNumber !== this.MAGIC_NUMBER) {
            LogHelper.error("JsonPacketHandler", "decodeResponse: Invalid magic number.");
            return null;
        }

        // 3. 验证版本号
        if (header.version !== this.VERSION) {
            LogHelper.error("JsonPacketHandler", "decodeResponse: Unsupported version.");
            return null;
        }

        // 4. 读取消息体
        let uint8Data: Uint8Array;
        if (data instanceof Uint8Array) {
            uint8Data = data;
        } else if (data instanceof ArrayBuffer) {
            uint8Data = new Uint8Array(data);
        } else if (ArrayBuffer.isView(data)) {
            uint8Data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        } else {
            LogHelper.error("JsonPacketHandler", "decodeResponse: Unsupported data type.");
            return null;
        }

        const bodyOffset = this.getHeadlen();

        if (uint8Data.length < bodyOffset + header.messageLength) {
            LogHelper.error("JsonPacketHandler", "decodeResponse: Incomplete message body.");
            return null;
        }

        let messageData: any = null;
        if (header.messageLength > 0) {
            const messageBody = uint8Data.subarray(bodyOffset, bodyOffset + header.messageLength);
            
            // 将字节数组转换为字符串
            const jsonString = new TextDecoder().decode(messageBody);
            
            // 解析 JSON
            try {
                messageData = JSON.parse(jsonString);
            } catch (error) {
                LogHelper.error("JsonPacketHandler", "decodeResponse: Failed to parse JSON:", error);
                return null;
            }
        }


        return {
            cmd: header.messageId.toString(),
            data: messageData
        }
    }
}