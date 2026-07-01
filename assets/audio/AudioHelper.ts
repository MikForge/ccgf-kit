import { AudioMgr } from 'db://ccgf-kit/audio/AudioMgr';
import { IAudioManifest, IAudioEntry } from 'db://ccgf-kit/audio/IAudioRegistry';
import { AudioCategory } from 'db://ccgf-kit/audio/audio.enum';
import { ResMgr } from 'db://ccgf-kit/res/ResMgr';

/**
 * 音频注册工具类
 *
 * 从 ResMgr._resourceMap 拉取指定 bundle 的音频配置，
 * 按 path 目录前缀分桶（bgm/ → BGM, sfx/ → SFX, voice/ → Voice），
 * 组装 IAudioManifest 后自动注册到 AudioMgr。
 *
 * 用法：
 * ```ts
 * AudioHelper.registerFromRes("audios");  // 一行完成注册
 * ```
 */
export class AudioHelper {
    /**
     * 一站式注册：从 ResMgr 查表 → 按 path 前缀分桶 → 组装 IAudioManifest → 注册到 AudioMgr
     * @param bundleName  bundle 名称，默认 "audios"
     */
    static registerFromRes(bundleName: string = "audios"): void {
        const bundleMap = ResMgr.getInstance().getResMapManifest(bundleName);
        if (!bundleMap) {
            H.log.warn(`AudioHelper: bundle "${bundleName}" 不在 resource-map 中`);
            return;
        }

        const rawMap = bundleMap["audio"];
        if (!rawMap) {
            H.log.warn(`AudioHelper: bundle "${bundleName}" 无 audio 分类数据`);
            return;
        }

        const manifest = this._buildManifest(rawMap);
        
        AudioMgr.getInstance().registerManifest(manifest);
    }

    /**
     * 将 {key → path} 原始映射按 path 目录前缀分桶为 IAudioManifest
     * @param rawMap  资源映射表 { key → path }
     * @returns       按 AudioCategory 分桶的 IAudioManifest
     */
    private static _buildManifest(rawMap: Record<string, string>): IAudioManifest {
        const manifest: IAudioManifest = {
            [AudioCategory.BGM]: [],
            [AudioCategory.SFX]: [],
            [AudioCategory.Voice]: [],
        };

        for (const key in rawMap) {
            if (!rawMap.hasOwnProperty(key)) continue;
            const path = rawMap[key];
            if (path.startsWith("bgm/")) {
                (manifest[AudioCategory.BGM] as IAudioEntry[]).push({ name: key, path });
            } else if (path.startsWith("sfx/")) {
                (manifest[AudioCategory.SFX] as IAudioEntry[]).push({ name: key, path });
            } else if (path.startsWith("voice/")) {
                (manifest[AudioCategory.Voice] as IAudioEntry[]).push({ name: key, path });
            } else {
                H.log.warn(`AudioHelper: 无法分类 "${key}" (path: ${path})，已跳过`);
            }
        }

        return manifest;
    }
}
