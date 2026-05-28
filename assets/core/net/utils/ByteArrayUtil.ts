import { NetData } from "../realtime/defines/net-structs";

export class ByteArrayUtil {
    /**
     * 获取数据长度
     * @param data 支持多种数据类型
     * @returns 数据的字节长度
     */
    static getDataLength(data: NetData): number {
        if (data == null) {
            return 0;
        }

        // 字符串类型
        if (typeof data === 'string') {
            return new TextEncoder().encode(data).length;
        }

        // Blob类型
        if (data instanceof Blob) {
            return data.size;
        }

        // ArrayBuffer类型
        if (data instanceof ArrayBuffer) {
            return data.byteLength;
        }

        // ArrayBufferView类型 (Uint8Array, DataView等)
        if (ArrayBuffer.isView(data)) {
            return data.byteLength;
        }

        return 0;
    }


    /**
     * 转换为Uint8Array
     * @param data 
     * @returns 
     */
    static toUint8Array(data: NetData): Uint8Array {
        if (data instanceof Uint8Array) {
            return data;
        } else if (data instanceof ArrayBuffer) {
            return new Uint8Array(data);
        } else if (data instanceof Blob) {
            // Blob转换为Uint8Array需要异步处理，这里简化处理，实际使用中请注意
            throw new Error("Blob to Uint8Array conversion requires async handling.");
        } else if (typeof data === 'string') {
            return new TextEncoder().encode(data);
        } else if (ArrayBuffer.isView(data)) {
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        } else {
            throw new Error("Unsupported NetData type.");
        }
    }
}