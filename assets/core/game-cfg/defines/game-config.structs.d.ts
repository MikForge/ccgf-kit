interface GameConfig {
    type: string;
    config: Record<string, EnvConfig>;
}

interface EnvConfig {
    httpServer: string;
    webSocketServer: string;
}
