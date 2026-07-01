/**
 * 包头信息
 */
interface PacketHeader {
    magicNumber: number;
    version: number;
    messageId: number;
    messageLength: number;
}
