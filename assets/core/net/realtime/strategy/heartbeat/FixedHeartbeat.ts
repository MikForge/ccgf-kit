import { IHeartbeatStrategy } from "../IHeartbeatStrategy";
import { NetData } from "../../defines/net-structs";

/**
 * 固定间隔心跳策略
 * 按固定时间间隔发送心跳包
 */
export class FixedHeartbeat implements IHeartbeatStrategy {
    private interval: number = 0;
    private timer: number = 0;
    private isRunning: boolean = false;
    private sendHeartbeat: () => void = null;

    /**
     * @param interval 心跳间隔（秒）
     * @param sendHeartbeat 发送心跳的回调函数
     */
    constructor(interval: number, sendHeartbeat: () => void) {
        this.interval = interval;
        this.sendHeartbeat = sendHeartbeat;
    }

    /**
     * 启动心跳
     */
    public start(): void {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.timer = 0;
        H.log.info(`FixedHeartbeat: 启动心跳，间隔 ${this.interval} 秒`);
    }

    /**
     * 停止心跳
     */
    public stop(): void {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        this.timer = 0;
        H.log.info("FixedHeartbeat: 停止心跳");
    }

    /**
     * 重置心跳计时器
     */
    public reset(): void {
        this.timer = 0;
    }

    /**
     * 更新心跳逻辑
     * @param dt 帧间隔时间（秒）
     */
    public update(dt: number): void {
        if (!this.isRunning) {
            return;
        }

        this.timer += dt;
        
        if (this.timer >= this.interval) {
            this.timer = 0;
            this.sendHeartbeat?.();
            H.log.info("FixedHeartbeat: 发送心跳包");
        }
    }
}
