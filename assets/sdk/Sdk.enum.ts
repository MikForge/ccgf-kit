/** 当前运行的平台类型，只是 SDK 视角下的抽象 */
export enum SdkPlatformName {
    WEB = 'web',
    WX_MINI = 'wx-mini',
    NATIVE = 'native',
    // 以后可以加：OPPO = 'oppo', VIVO = 'vivo', TOUTIAO = 'toutiao' ...
}

/** 激励广告结果（看完 / 中断 / 失败） */
export enum RewardAdStatus {
    COMPLETED = 'completed',  // 正常看完，可以发奖励
    SKIPPED = 'skipped',      // 提前关了，不发奖励
    FAILED = 'failed',        // 加载失败等
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
