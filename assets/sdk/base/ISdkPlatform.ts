
import {
    SdkPlatformName,
    LoginResult,
    PayParams,
    RewardAdResult,
    TrackEventPayload,
    SdkInitOptions,
} from 'db://ccgf-kit/sdk/defines/SdkTypes';

export interface ISdkPlatform {

    readonly name: SdkPlatformName;

    /**
     * 初始化 SDK
     * @param options 
     */
    init(options?: SdkInitOptions): Promise<void>;


    /**
     * 登录
     * @return 登录结果
     */
    login(): Promise<LoginResult>;


    /**
     * 拉起支付
     * @param params 
     */
    pay(params: PayParams): Promise<void>;   // 拉起支付，不发钻石


    /**
     * 激励广告位 ID
     * @param placementId 
     */
    showRewardAd(placementId: string): Promise<RewardAdResult>;

    /**
     * 埋点上报
     * @param payload 
     */
    trackEvent(payload: TrackEventPayload): void;

    /**
     * 退出登录
     */
    // logout(): Promise<void>;

    /**
     * 切换账号
     */
    // switchAccount(): Promise<LoginResult>;

    /**
     * 分享
     */
    // share(params: ShareParams): Promise<void>;

    /**
     * 隐私协议弹窗
     */
    // showPrivacyAgreement(): Promise<boolean>;



}
