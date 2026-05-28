/**
 * Interface for heartbeat strategy implementations.
 */
export interface IHeartbeatStrategy {
    /**
     * Starts the heartbeat mechanism.
     */
    start(): void;

    /**
     * Stops the heartbeat mechanism.
     */
    stop(): void;

    /**
     * Resets the heartbeat timer.
     */
    reset(): void;

    /** Updates the heartbeat mechanism with the given delta time. */
    update?(dt: number): void;
}