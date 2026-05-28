

/** 当前运行的平台类型，只是 SDK 视角下的抽象 */
export enum SdkPlatformName {
    WEB = 'web',
    WX_MINI = 'wx-mini',
    NATIVE = 'native',
    // 以后可以加：OPPO = 'oppo', VIVO = 'vivo', TOUTIAO = 'toutiao' ...
}

/** 登录结果：SDK 帮你搞完渠道登录后，返回给游戏的统一结构 */
export interface LoginResult {
    uid: string;          // 游戏服里的 uid（或用于换取 uid 的 token）
    token: string;        // 登录态 token，后面请求你自己的 PHP 用
    nick?: string;
    avatar?: string;
    raw?: any;            // 原始返回，必要时调试用
}

/** 支付入参（游戏侧调用 SdkMgr.pay 的参数） */
export interface PayParams {
    productId: string;   // 商品 id（你自己定义的）
    amount: number;      // 金额（建议用“分”）
    extra?: string;      // 透传给后台的内容（区服、渠道、来源等）
}

/** 激励广告结果（看完 / 中断 / 失败） */
export enum RewardAdStatus {
    COMPLETED = 'completed',  // 正常看完，可以发奖励
    SKIPPED = 'skipped',      // 提前关了，不发奖励
    FAILED = 'failed',        // 加载失败等
}

export interface RewardAdResult {
    status: RewardAdStatus;
    placementId: string;     // 广告位 id
    raw?: any;               // SDK 原始回调
}

/** trackEvent 的统一结构，方便以后接别的统计 SDK */
export interface TrackEventPayload {
    event: string;                     // 事件名，如 "enter_level"
    params?: Record<string, any>;      // 参数
}

/** SDK 初始化时可以传的一些配置（可选） */
export interface SdkInitOptions {
    debug?: boolean;
    channel?: string;      // 自家渠道号，如 "official" / "tap" / "wx-mini"
    serverId?: string;     // 区服 id
}


/**
 * 分享渠道
 */
export enum ShareChannel {
    WECHAT_FRIEND = 'wechat_friend',
    WEIBO = 'weibo',
    // 保存至本机
    SAVE_IMAGE = 'save_image',
}

/**
 * 分享参数
 */
export interface ShareParams {
    channel: ShareChannel;
    title: string;
    imageUrl: string;
    query: string;
}
