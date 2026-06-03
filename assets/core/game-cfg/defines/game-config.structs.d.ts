export interface GameConfig {
    type: string;
    config: Record<string, EnvConfig>;
}

export interface EnvConfig {
    httpServer: string;
    webSocketServer: string;
}
