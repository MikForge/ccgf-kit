import { FrameEventOptions } from "db://ccgf-kit/core/utils";

import { InFlightTracker } from "./components/InFlightTracker";
import { INetworkTips } from "./defines/net-structs";
import { NetSession } from "./NetSeesion";
import { IPacketHandler, IResponsePacket } from "./base/IPacketHandler";
import { ISocket } from "./base/ISocket";

/**
 * NetSessionBuilder
 * @author Michael
 * @description 网络会话构建器 - 用于构建 NetSession 实例 
 * @example
 * const netSession = new NetSessionBuilder()
 *      .setAppProtocolAdapter(adapter)
 *      .setPacketHandler(packetHandler)
 *      .setNetworkTips(networkTips)
 *      .setSendBufferMgr(sendBufferMgr)
 *      .setReceiveBufferMgr(receiveBufferMgr)
 *      .setInFlightTracker(inFlightTracker)
 *      .setFrameEventOptions(frameEventOptions)
 *      .build();   
 */
export class NetSessionBuilder {

    private adapter: ISocket = null!;
    private packetHandler: IPacketHandler = null!;
    private networkTips: INetworkTips = null!;
    private inFlightTracker: InFlightTracker = null!;

    public setAppProtocolAdapter(adapter: ISocket): NetSessionBuilder {
        this.adapter = adapter;
        return this;
    }

    public setPacketHandler(handler: IPacketHandler): NetSessionBuilder {
        this.packetHandler = handler;
        return this;
    }

    public setNetworkTips(tips: INetworkTips): NetSessionBuilder {
        this.networkTips = tips;
        return this;
    }

    public setInFlightTracker(tracker: InFlightTracker): NetSessionBuilder {
        this.inFlightTracker = tracker;
        return this;
    }

    public build(): NetSession {

        this.validate();

        const session = new NetSession();

        session.init(
            this.adapter,
            this.packetHandler,
            this.networkTips,
            this.inFlightTracker
        );

        this.reset();

        return session;
    }

    private validate(): void {
        if (!this.adapter) {
            throw new Error("AppProtocolAdapter is not set.");
        }
        if (!this.packetHandler) {
            throw new Error("PacketHandler is not set.");
        }
        if (!this.networkTips) {
            throw new Error("NetworkTips is not set.");
        }
        if (!this.inFlightTracker) {
            throw new Error("InFlightTracker is not set.");
        }
    }


    private reset(): void {
        this.adapter = null!;
        this.packetHandler = null!;
        this.networkTips = null!;
        this.inFlightTracker = null!;
    }
}