export enum HttpServer {
    /** 运营后台 (账号、选服、充值等) */
    Platform = "Platform",  // ✅ 改名

    /** 支付服务器 (可能独立部署) */
    Pay = "Pay",

    /** CDN 资源服务器 */
    Resource = "Resource",

    /** 数据统计 */
    Analytics = "Analytics",

    /** 广告服务器 */
    Ad = "Ad",

    /** 微信 API */
    WechatApi = "WechatApi",

    /** Facebook API */
    FacebookApi = "FacebookApi"
}

/** 请求事件 */
export enum HttpEvent {
    /** 断网 */
    NO_NETWORK = "http_request_no_network",
    /** 未知错误 */
    UNKNOWN_ERROR = "http_request_unknown_error",
    /** 请求超时 */
    TIMEOUT = "http_request_timout"
}


export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

/**
 * readyState 状态枚举
 */
export enum HttpReadyState {
    /** 请求未初始化 */
    UNSENT = 0,
    /** 服务器连接已建立 */
    OPENED = 1,
    /** 请求已接收 */
    HEADERS_RECEIVED = 2,
    /** 请求处理中 */
    LOADING = 3,
    /** 请求已完成，且响应已就绪 */
    DONE = 4
}

/**
 * http status 码枚举
 */
export enum HttpStatus {
    /** 网络错误 */
    NETWORK_ERROR = 0,
    /** 请求成功 */
    OK = 200,
    /** 重定向 */
    REDIRECT = 300,
    /** 资源未找到 */
    NOT_FOUND = 404,
    /** 服务器错误 */
    INTERNAL_SERVER_ERROR = 500
}
