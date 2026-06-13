
import { sys,native } from 'cc';
import { ISdkPlatform } from '../base/ISdkPlatform';
import { LoginResult, PayParams, RewardAdResult, RewardAdStatus, SdkPlatformName, TrackEventPayload } from '../defines/SdkTypes';


export class NativeSdkPlatform implements ISdkPlatform {
    readonly name = SdkPlatformName.NATIVE;

    async init(): Promise<void> {
        // 可以让原生侧初始化 SDK，然后通过 jsb 回调一个 "ready" 事件过来
    }

    async login(): Promise<LoginResult> {
        // 通常原生这边会弹出登录（微信/游客），然后通过 jsb 回调给 JS
        return new Promise<LoginResult>((resolve, reject) => {
            // 1. 调原生 login
            if (sys.os === sys.OS.ANDROID) {
                native.reflection.callStaticMethod(
                    'org/cocos2dx/javascript/AppActivity',
                    'login',
                    '()V'
                );
            } else if (sys.os === sys.OS.IOS) {
                native.reflection.callStaticMethod(
                    'AppController',
                    'login',
                    '()V'
                );
            }
            // 2. 在全局挂一个回调，给原生调用
            (window as any).onNativeLoginResult = (data: any) => {
                // data 里包含 uid/token 或用于换取 uid/token 的临时票据
                resolve({
                    uid: data.uid,
                    token: data.token,
                });
            };
        });
    }

    async pay(params: PayParams): Promise<void> {
        // 直接将订单信息透传给原生，让原生调微信/支付宝 SDK
        const json = JSON.stringify(params);
        if (sys.os === sys.OS.ANDROID) {
            native.reflection.callStaticMethod(
                'org/cocos2dx/javascript/AppActivity',
                'pay',
                '(Ljava/lang/String;)V',
                json,
            );
        } else if (sys.os === sys.OS.IOS) {
            native.reflection.callStaticMethod(
                'AppController',
                'pay:',
                json,
            );
        }
        // 是否需要等原生回调，看你设计
    }

    async showRewardAd(placementId: string): Promise<RewardAdResult> {
        // 原生侧调激励广告 SDK
        return { status: RewardAdStatus.FAILED, placementId }; // 返回广告结果
    }

    trackEvent(data: TrackEventPayload): void {
        // 大数据统计 SDK 埋点
        
    }
}
