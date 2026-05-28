import type { BootErrorInfo } from '../defines/boot.structs';

export interface BootActions {
    /** 启动 PureMVC 框架注册（ModelPrepCmd / ViewPrepCmd / ControllerCmd） */
    startupFramework(): void;

    /** 打开 SDK 授权界面 */
    openLoginUI(): void;

    /** 打开错误重试界面 */
    openErrorUI(data: { error: BootErrorInfo; onRetry: () => void }): void;

    /** 打开启动游戏界面 */
    openStartupGameUI(): void;

    /** 读取本地缓存 token */
    getCachedToken(): string | null;

    /** 清除本地缓存 token */
    clearCachedToken(): void;

    /** 向游戏服务器验证 SDK 凭证，获取游戏 token；验证完成后 emit TOKEN_VERIFIED 或 TOKEN_VERIFY_FAILED */
    verifyToken(credential: unknown): void;

    /** 拉取玩家数据、配置表等；完成后 emit PLAYER_DATA_READY 或 PLAYER_DATA_FAILED */
    pullPlayerData(): void;
}
