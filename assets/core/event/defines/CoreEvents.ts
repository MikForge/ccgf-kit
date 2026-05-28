export enum CoreEvents {
    // 原有
    HOT_UPDATE_READY = "core:hot_update_ready",
    HOT_UPDATE_FAILED = "core:hot_update_failed",
    NET_CONNECTED = "core:net_connected",
    NET_DISCONNECTED = "core:net_disconnected",

    // 新增 - SDK
    SDK_INIT_READY = "core:sdk_init_ready",
    SDK_INIT_FAILED = "core:sdk_init_failed",
    SDK_LOGIN_SUCCESS = "core:sdk_login_success",
    SDK_LOGIN_FAILED = "core:sdk_login_failed",

    // 新增 - Token
    TOKEN_VERIFIED = "core:token_verified",
    TOKEN_VERIFY_FAILED = "core:token_verify_failed",

    // 新增 - 玩家数据
    PLAYER_DATA_READY = "core:player_data_ready",
    PLAYER_DATA_FAILED = "core:player_data_failed",
}
