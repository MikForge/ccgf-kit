import { ByteArrayUtil } from "../../utils/ByteArrayUtil";
import { CompressionUtil } from "../../utils/CompressionUtil";
import { EncryptionUtil } from "../../utils/EncryptionUtil";
import { NetData } from "../defines/net-structs";
import { IPacketHandler, IRequestPacket, IResponsePacket } from "../base/IPacketHandler";

import * as root from 'db://ccgf-kit/core/net/proto/bundle.js';

/**
 * Protobuf协议包处理器
 * @export
 * @class ProtobufPacketHandler
 * @implements {IPacketHandler}
 * @description
 * 协议格式:
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 请求包 (Request Packet)                                       │
 * ├──────────┬────────┬──────────┬──────────┬───────────────────┤
 * │ 魔数(4)  │版本(4) │消息ID(4) │长度(4)   │ Protobuf消息体(N) │
 * └──────────┴────────┴──────────┴──────────┴───────────────────┘
 * 
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 响应包 (Response Packet)                                      │
 * ├──────────┬────────┬──────────┬──────────┬───────────────────┤
 * │ 魔数(4)  │版本(4) │消息ID(4) │长度(4)   │ Protobuf消息体(N) │
 * └──────────┴────────┴──────────┴──────────┴───────────────────┘
 * @example
 * // 创建协议处理器
 * const packetHandler = new ProtobufPacketHandler();
 */
export class ProtobufPacketHandler implements IPacketHandler {

    /** 协议魔数 */
    private readonly MAGIC_NUMBER = 0xABCD;
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

    /** 
     * 安全配置 
     * 注意: 这些配置不会暴露在网络协议中
     */
    private readonly SECURITY_CONFIG = {
        /** 是否始终加密 */
        alwaysEncrypt: true,
        /** 是否启用自动压缩 */
        autoCompress: true,
        /** 压缩阈值(字节),小于此值不压缩 */
        compressThreshold: 1024
    };

    /** 获取协议头长度 */
    getHeadlen(): number {
        return this.MAGIC_NUMBER_SIZE +
            this.VERSION_SIZE +
            this.MESSAGE_ID_SIZE +
            this.MESSAGE_LENGTH_SIZE
    }

    /** 返回一个心跳包 */
    getHeartbeatPacket(): NetData {

        const info: root.network.IHeartbeatRequest = {
            timestamp: Date.now()
        }

        const buffer = root.network.HeartbeatRequest.encode(info).finish();

        const requestPacket: IRequestPacket = {
            cmd: this.HEARTBEAT_CMD.toString(),
            data: buffer
        };

        return this.encodeRequest(requestPacket);
    }

    /** 返回 整个包的长度 */
    getPacketLength(msg: NetData): number {

        const unit8Data = ByteArrayUtil.toUint8Array(msg);

        if (!unit8Data) {
            H.log.error("ProtobufPacketHandler", "getPacketLength: Failed to convert NetData to Uint8Array.");
            return 0;
        }

        if (unit8Data.length < this.getHeadlen()) {
            H.log.error("ProtobufPacketHandler", "getPacketLength: Data length is less than header length.");
            return 0;
        }

        const dataView = new DataView(unit8Data.buffer);

        // 消息体长度偏移位置
        const messageLengthOffset = this.getHeadlen() - this.MESSAGE_LENGTH_SIZE;

        // 读取消息体长度
        const messageLength = dataView.getUint32(messageLengthOffset);

        // 总包长度 = 头部长度 + 消息体长度
        return this.getHeadlen() + messageLength;
    }

    /** 检查包数据是否合法  */
    checkPackage(msg: NetData): boolean {
        const unit8Data = ByteArrayUtil.toUint8Array(msg);

        if (!unit8Data) {
            H.log.error("ProtobufPacketHandler", "checkPackage: Failed to convert NetData to Uint8Array.");
            return false;
        }

        if (unit8Data.length < this.getHeadlen()) {
            H.log.error("ProtobufPacketHandler", "checkPackage: Data length is less than header length.");
            return false;
        }

        const dataView = new DataView(unit8Data.buffer);

        // 读取魔数
        const magicNumber = dataView.getUint32(0);

        if (magicNumber !== this.MAGIC_NUMBER) {
            H.log.error("ProtobufPacketHandler", "checkPackage: Invalid magic number.");
            return false;
        }

        // 读取版本号
        const version = dataView.getFloat32(this.MAGIC_NUMBER_SIZE);

        if (version !== this.VERSION) {
            H.log.error("ProtobufPacketHandler", "checkPackage: Unsupported version.");
            return false;
        }

        return false;
    }

    /** 获取包的命令编号 */
    getPackageId(msg: NetData): number {
        const unit8Data = ByteArrayUtil.toUint8Array(msg);

        if (!unit8Data) {
            H.log.error("ProtobufPacketHandler", "getPackageId: Failed to convert NetData to Uint8Array.");
            return 0;
        }

        if (unit8Data.length < this.getHeadlen()) {
            H.log.error("ProtobufPacketHandler", "getPackageId: Data length is less than header length.");
            return 0;
        }

        const dataView = new DataView(unit8Data.buffer);

        // 读取消息ID
        const messageIdOffset = this.MAGIC_NUMBER_SIZE + this.VERSION_SIZE;

        const messageId = dataView.getUint32(messageIdOffset);

        return messageId;
    }

    encodeRequest(info: IRequestPacket): NetData {

        let handledData: Uint8Array = ByteArrayUtil.toUint8Array(info.data);

        if (!handledData) {
            H.log.error("ProtobufPacketHandler", "encodeRequest: Failed to convert request data to Uint8Array.");
            return null;
        }

        if (this.SECURITY_CONFIG.autoCompress && handledData.length >= this.SECURITY_CONFIG.compressThreshold) {
            handledData = CompressionUtil.compress(handledData);
        }

        if (this.SECURITY_CONFIG.alwaysEncrypt) {
            handledData = EncryptionUtil.encrypt(handledData);
        }

        //数据包长度
        const dataLen = ByteArrayUtil.getDataLength(handledData)

        const totalLen = this.getHeadlen() + dataLen;

        const newPacket = new Uint8Array(totalLen);

        const cmdView = new DataView(newPacket.buffer);

        let offset = 0;

        // 写入魔数
        cmdView.setUint32(offset, this.MAGIC_NUMBER);
        offset += this.MAGIC_NUMBER_SIZE;

        // 写入版本号
        cmdView.setFloat32(offset, this.VERSION);
        offset += this.VERSION_SIZE;

        // 写入消息ID
        cmdView.setUint32(offset, parseInt(info.cmd));
        offset += this.MESSAGE_ID_SIZE;

        // 写入消息体长度
        cmdView.setUint32(offset, dataLen);
        offset += this.MESSAGE_LENGTH_SIZE;

        if (dataLen === 0) {
            return newPacket;
        }

        if (!handledData) {
            H.log.error("ProtobufPacketHandler", "encodeRequest: Data is null but dataLen > 0.");
            return null;
        }

        // 写入消息体
        newPacket.set(handledData, offset);

        return newPacket;
    }

    decodeResponse(data: NetData): IResponsePacket {

        const unit8Data = ByteArrayUtil.toUint8Array(data);

        if (!unit8Data) {
            H.log.error("ProtobufPacketHandler", "decodeResponse: Failed to convert NetData to Uint8Array.");
            return null;
        }

        if (unit8Data.length < this.getHeadlen()) {
            H.log.error("ProtobufPacketHandler", "decodeResponse: Data length is less than header length.");
            return null;
        }

        const dataView = new DataView(unit8Data.buffer);

        let offset = 0;

        // 读取魔数
        const magicNumber = dataView.getUint32(offset);
        offset += this.MAGIC_NUMBER_SIZE;

        if (magicNumber !== this.MAGIC_NUMBER) {
            H.log.error("ProtobufPacketHandler", "decodeResponse: Invalid magic number.");
            return null;
        }

        // 读取版本号
        const version = dataView.getFloat32(offset);
        offset += this.VERSION_SIZE;

        if (version !== this.VERSION) {
            H.log.error("ProtobufPacketHandler", "decodeResponse: Unsupported version.");
            return null;
        }

        // 读取消息ID
        const messageId = dataView.getUint32(offset);
        offset += this.MESSAGE_ID_SIZE;

        // 读取消息体长度
        const messageLength = dataView.getUint32(offset);
        offset += this.MESSAGE_LENGTH_SIZE;

        if (unit8Data.length < offset + messageLength) {
            H.log.error("ProtobufPacketHandler", "decodeResponse: Incomplete message body.");
            return null;
        }

        let messageBody: Uint8Array | null = null;
        if (messageLength > 0) {

            messageBody = unit8Data.subarray(offset, offset + messageLength);

            if (this.SECURITY_CONFIG.alwaysEncrypt) {
                messageBody = EncryptionUtil.decrypt(messageBody);
            }

            if (this.SECURITY_CONFIG.autoCompress) {
                messageBody = CompressionUtil.decompress(messageBody);
            }
        }

        let responseData: IResponsePacket = null!;
        responseData = {
            cmd: messageId.toString(),
            data: messageBody
        };

        return responseData;
    }





}