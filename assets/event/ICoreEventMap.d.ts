import type { CoreEvents } from "db://ccgf-kit/event/CoreEvents.enum";

export interface CoreEventMap {
    // 原有
    [CoreEvents.HOT_UPDATE_READY]: { version: string };
    [CoreEvents.HOT_UPDATE_FAILED]: { error: string };
    [CoreEvents.NET_CONNECTED]: void;
    [CoreEvents.NET_DISCONNECTED]: { reason: string; code?: number };

    // 新增 - SDK
    [CoreEvents.SDK_INIT_READY]: void;
    [CoreEvents.SDK_INIT_FAILED]: { error: string };
    [CoreEvents.SDK_LOGIN_SUCCESS]: { credential: unknown };
    [CoreEvents.SDK_LOGIN_FAILED]: { error: string; canceled?: boolean };

    // 新增 - Token
    [CoreEvents.TOKEN_VERIFIED]: { token: string };
    [CoreEvents.TOKEN_VERIFY_FAILED]: void;

    // 新增 - 玩家数据
    [CoreEvents.PLAYER_DATA_READY]: void;
    [CoreEvents.PLAYER_DATA_FAILED]: { error: string };
}
