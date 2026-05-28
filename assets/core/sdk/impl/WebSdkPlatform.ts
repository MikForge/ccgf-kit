import { sys } from "cc";
import { HttpServer } from "db://assets/core/net/http";
import { ISdkPlatform } from "../base/ISdkPlatform";
import { LoginResult, PayParams, RewardAdResult, RewardAdStatus, SdkPlatformName, TrackEventPayload } from "../defines/SdkTypes";

declare const WeixinJSBridge: any;  // 在微信 H5 里会有

export class WebSdkPlatform implements ISdkPlatform {
    readonly name = SdkPlatformName.WEB;

    async init(): Promise<void> {
        // 可做统计 SDK 初始化等
    }

    async login(): Promise<LoginResult> {
        try {
            // ✅ 正确用法
            const response = await M.net.http.postAsync(
                HttpServer.Platform,
                '/api/login',
                {
                    platform: 'web',
                    deviceId: this.getDeviceId()
                }
            );

            // ✅ 检查返回结果
            if (response.code === 200) {
                const data = response.data;

                // ⭐ 保存 Token 到拦截器（自动携带到后续请求）
                M.net.setHttpToken(data.token);

                H.log.info('[登录成功]', data);

                return {
                    uid: data.uid,
                    token: data.token,
                    nick: data.nick || '玩家' + data.uid
                };
            } else {
                // ✅ 处理登录失败
                throw new Error(response.msg || '登录失败');
            }
        } catch (error) {
            H.log.error('[登录异常]', error);
            throw error;
        }
    }

    async pay(params: PayParams): Promise<void> {

    }

    async showRewardAd(placementId: string): Promise<RewardAdResult> {
        // H5 激励广告，按你接的广告 SDK 来
        return { status: RewardAdStatus.FAILED, placementId }; // 返回广告结果
    }

    trackEvent(data: TrackEventPayload): void {
        // 大数据统计 SDK 埋点

    }

    /**
     * 获取设备ID
     */
    private getDeviceId(): string {
        let deviceId = sys.localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'web_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
            sys.localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    }
}
