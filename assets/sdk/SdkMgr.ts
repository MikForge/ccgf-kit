// sdk/SdkManager.ts
import { sys } from 'cc';
import { ISdkPlatform } from 'db://ccgf-kit/sdk/ISdkPlatform';
import { PayParams, TrackEventPayload } from 'db://ccgf-kit/sdk/ISdk';
import { WxMiniSdkPlatform } from 'db://ccgf-kit/sdk/impl/WxMiniSdkPlatform';
import { NativeSdkPlatform } from 'db://ccgf-kit/sdk/impl/NativeSdkPlatform';
import { WebSdkPlatform } from 'db://ccgf-kit/sdk/impl/WebSdkPlatform';
import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { CoreEvents } from 'db://ccgf-kit/event/CoreEvents.enum';
export class SdkMgr extends Singleton<SdkMgr> {

    private _platform!: ISdkPlatform;
    private _inited = false;

    /** 初始化：选平台 + 调平台 init */
    async init(): Promise<void> {
        if (this._inited) {
            M.event.emit(CoreEvents.SDK_INIT_READY);
            return;
        }

        try {
            this._platform = this.detectPlatform();
            H.log.info('[SDK] use platform:' + this._platform.name);
            await this._platform.init();
            this._inited = true;
            M.event.emit(CoreEvents.SDK_INIT_READY);
        } catch (e) {
            H.log.error('[SDK] init failed:', e);
            M.event.emit(CoreEvents.SDK_INIT_FAILED, { error: String(e) });
        }
    }

    private detectPlatform(): ISdkPlatform {
        // 这里只是示例，实际可以再细分渠道
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            return new WxMiniSdkPlatform();
        } else if (sys.isNative) {
            return new NativeSdkPlatform();
        } else {
            return new WebSdkPlatform();
        }
    }

    // ==== 对外封装接口 ====

    async login() {
        if (!this._inited) await this.init();
        try {
            const credential = await this._platform.login();
            M.event.emit(CoreEvents.SDK_LOGIN_SUCCESS, { credential });
            return credential;
        } catch (e: any) {
            const canceled = e?.canceled === true || e?.code === 'USER_CANCEL';
            M.event.emit(CoreEvents.SDK_LOGIN_FAILED, {
                error: canceled ? '用户取消授权' : String(e),
                canceled,
            });
            throw e;
        }
    }

    async pay(params: PayParams) {
        if (!this._inited) await this.init();
        return this._platform.pay(params);
    }

    async showRewardAd(placementId: string) {
        if (!this._inited) await this.init();
        return this._platform.showRewardAd(placementId);
    }

    trackEvent(data: TrackEventPayload) {
        if (!this._inited) {
            // 简单做法：没初始化就先丢日志，或者缓存起来
            H.log.warn(`[SDK] trackEvent before init: ${data.event}` + JSON.stringify(data));
            return;
        }
        this._platform.trackEvent(data);
    }
}
