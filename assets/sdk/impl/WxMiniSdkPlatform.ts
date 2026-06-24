import type { ISdkPlatform } from "db://ccgf-kit/sdk/ISdkPlatform";
import { SdkPlatformName, RewardAdStatus } from "db://ccgf-kit/sdk/Sdk.enum";
import type { LoginResult, PayParams, RewardAdResult, TrackEventPayload } from "db://ccgf-kit/sdk/ISdk";
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import { NetMgr } from 'db://ccgf-kit/net/mgr/NetMgr';

declare const wx: any;

export class WxMiniSdkPlatform implements ISdkPlatform {
    readonly name = SdkPlatformName.WX_MINI;

    async init(): Promise<void> {
        // 统计 SDK，广告 SDK 等初始化
    }

    async login(): Promise<LoginResult> {
        const code: string = await new Promise((resolve, reject) => {
            wx.login({
                success: (res: any) => resolve(res.code),
                fail: reject,
            });
        });

        // 用 code 换 uid/token（找你自己的 PHP）
        const response = await NetMgr.getInstance().http.postAsync(
            'Platform',
            '/api/login_wx',
            { code }
        );

        if (response.code == 200) {
            const data = response.data;

            NetMgr.getInstance().setHttpToken(data.token);

            LogHelper.info('[登录成功]', data);

            return {
                uid: data.uid,
                token: data.token,
            };
        }else{
            throw new Error(response.msg || '登录失败');
        }

    }

    async pay(params: PayParams): Promise<void> {
        // 1. 先找你自己的 PHP 要 wx.requestPayment 的参数
        const resp = await fetch('/api/order/create_wx_mini', {
            method: 'POST',
            body: JSON.stringify(params),
        });
        const payCfg = await resp.json();

        // 2. 调用微信小游戏支付 API
        return new Promise<void>((resolve, reject) => {
            wx.requestPayment({
                timeStamp: payCfg.timeStamp,
                nonceStr:  payCfg.nonceStr,
                package:   payCfg.package,
                signType:  payCfg.signType,
                paySign:   payCfg.paySign,
                success: () => resolve(),
                fail: (err: any) => reject(err),
            });
        });
    }

    async showRewardAd(placementId: string): Promise<RewardAdResult> {
        // wx.createRewardedVideoAd(...)

        return { status: RewardAdStatus.FAILED, placementId }; // 返回广告结果
    }

    trackEvent(data: TrackEventPayload): void {
        // 大数据统计 SDK 埋点

    }
}