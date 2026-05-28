/**
 * 网络通道类型枚举
 */
export enum NetChannelType {
    /** 默认通道 */
    DEFAULT = 0,
    /** 游戏通道 */
    GAME = 1,
    /** 聊天通道 */
    CHAT = 2,
    /** 语音通道 */
    VOICE = 3
}



/** 网络提示类型枚举 */
export enum NetTipsType {
    /** 连接中 */
    Connecting,
    /** 重连中 */
    ReConnecting,
    /** 请求中 */
    Requesting,
}

// ========== 状态枚举 ==========

export enum NetSessionState {
    /** 已关闭 */
    CLOSED = "CLOSED",
    /** 工作中 (认证完成,可以收发业务消息) */
    WORKING = "WORKING",
    /** 连接中 (正在建立连接) */
    CONNECTING = "CONNECTING",
    /** 验证中 (正在进行身份验证) */
    CHECKING = "CHECKING",
}

export enum NetSessionEvent {
    /** 认证成功,开始工作 */
    TO_WORKING = "TO_WORKING",
    /** 关闭连接 */
    TO_CLOSED = "TO_CLOSED",
    /** 开始连接 */
    TO_CONNECTING = "TO_CONNECTING",
    /** 开始验证 */
    TO_CHECKING = "TO_CHECKING",
}

export enum NetErrorCode {
    /** 正常关闭 */
    SOCKET_CLOSED = 1000,
    /** 异常关闭 */
    SOCKET_ERROR = 1006,
    /** 心跳超时 */
    HEARTBEAT_TIMEOUT = 4001,
    /** 认证失败 */
    AUTH_FAILED = 4002,
}