import type { NetData } from 'db://ccgf-kit/net/defines/INetStructs';
import type { IPacketHandler, IResponsePacket } from 'db://ccgf-kit/net/base/IPacketHandler';
import { InFlightTracker } from 'db://ccgf-kit/net/components/InFlightTracker';
import { FrameEventDispatcher } from 'db://ccgf-kit/utils/dispatcher/FrameEventDispatcher';
import { BoundedQueue } from 'db://ccgf-kit/utils/queue/BoundedQueue';
import { overflowStrategy } from 'db://ccgf-kit/utils/queue/BoundedQueue.enum';

/**
 * 消息处理管道
 * 职责：接收原始数据 → 解密/解压/反序列化 → 请求匹配 → 分发
 */
export class MessagePipeline {
    private inBoxQueue: BoundedQueue<NetData>;
    private packeter: IPacketHandler;
    private inFlightTracker: InFlightTracker;
    private dispatcher: FrameEventDispatcher<IResponsePacket>;

    constructor(
        packeter: IPacketHandler,
        inFlightTracker: InFlightTracker,
        dispatcher: FrameEventDispatcher<IResponsePacket>
    ) {
        this.inBoxQueue = new BoundedQueue<NetData>({
            maxSize: 2000,
            overflowStrategy: overflowStrategy.DROP_NEW,
            onOverflow: (item: NetData) => {
                H.log.warn("MessagePipeline: inBoxQueue overflow, dropped item:", item);
            }
        });
        this.packeter = packeter;
        this.inFlightTracker = inFlightTracker;
        this.dispatcher = dispatcher;
    }

    /**
     * 处理接收到的原始数据
     * @param data 原始网络数据
     */
    public processRawData(data: NetData): void {
        // 快进：加入队列
        if (!this.inBoxQueue.enqueue(data)) {
            H.log.warn("MessagePipeline: 接收队列已满，丢弃数据包");
            return;
        }

        // 快出：处理队列中的数据包
        this.processPackets();
    }

    /**
     * 处理接收到的数据包
     * @private
     */
    private processPackets(): void {
        if (!this.packeter) {
            return;
        }

        // 循环处理队列中的所有数据包
        while (!this.inBoxQueue.isEmpty()) {
            const rawPacket = this.inBoxQueue.dequeue();
            if (!rawPacket) {
                break;
            }

            try {
                // 解密/解压/反序列化数据包
                const packet: IResponsePacket = this.packeter.decodeResponse(rawPacket);

                if (!packet) {
                    H.log.error("MessagePipeline: 数据包解析失败");
                    continue;
                }

                if (!packet.cmd) {
                    H.log.error("MessagePipeline: 数据包缺少命令编号 cmd");
                    continue;
                }
                const request = this.inFlightTracker.getRequest(packet.cmd);

                if (request) {
                    // 匹配到在途请求，调用请求的回调
                    request.onSuccess?.(packet.data);
                } else {
                    // 服务端推送或无匹配请求，分发响应包事件
                    this.dispatcher.enqueueEvent(packet);
                }


            } catch (error) {
                H.log.error("MessagePipeline: 处理数据包异常", error);
            }
        }
    }

    /**
     * 清理
     */
    public clear(): void {
        this.inBoxQueue.clear();
    }
}