import type { RewardAdStatus, ShareChannel } from "db://ccgf-kit/sdk/Sdk.enum";

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
    amount: number;      // 金额（建议用"分"）
    extra?: string;      // 透传给后台的内容（区服、渠道、来源等）
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
 * 分享参数
 */
export interface ShareParams {
    channel: ShareChannel;
    title: string;
    imageUrl: string;
    query: string;
}
