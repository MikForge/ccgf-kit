/**
 * Interface for heartbeat strategy implementations.
 */
export interface IReconnectStrategy {
    /**
     * Attempts to reconnect to the server.
     */
    reconnect(): void;

    /**
     * Resets the reconnection strategy state.
     */
    reset(): void;
}