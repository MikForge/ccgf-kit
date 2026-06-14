import { Singleton } from 'db://ccgf-kit/common';
import { AudioRegistry } from 'db://ccgf-kit/audio/AudioRegistry';
import { audioEngine } from 'cc';

/**
 * 音频管理器（Singleton）
 *
 * 消费端，通过 AudioRegistry 查找音频定义后调用 cc.audioEngine 播放。
 *
 * BGM: 独占播放（自动切歌），默认循环
 * SFX: 可叠加播放，不循环
 */
export class AudioMgr extends Singleton<AudioMgr> {

    private _registry = AudioRegistry.getInstance();
    private _bgmAudioId: number = -1;
    private _currentBGM: string | null = null;

    // ── BGM ──

    /**
     * 播放背景音乐，默认循环。
     * 如果当前正在播放 BGM，先停止再播新曲。
     */
    playBGM(name: string, loop: boolean = true, volume: number = 1): void {
        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: BGM "${name}" 未注册`);
            return;
        }
        this.stopBGM();
        this._currentBGM = name;
        this._bgmAudioId = audioEngine.play(def.path, loop, volume);
    }

    /** 停止当前 BGM */
    stopBGM(): void {
        if (this._bgmAudioId >= 0) {
            audioEngine.stop(this._bgmAudioId);
            this._bgmAudioId = -1;
            this._currentBGM = null;
        }
    }

    /** 暂停当前 BGM */
    pauseBGM(): void {
        if (this._bgmAudioId >= 0) {
            audioEngine.pause(this._bgmAudioId);
        }
    }

    /** 恢复已暂停的 BGM */
    resumeBGM(): void {
        if (this._bgmAudioId >= 0) {
            audioEngine.resume(this._bgmAudioId);
        }
    }

    /** 当前 BGM 名称（只读） */
    get currentBGM(): string | null {
        return this._currentBGM;
    }

    // ── SFX ──

    /**
     * 播放音效，不循环。
     * 多次调用可叠加，互不干扰。
     */
    playSFX(name: string, volume: number = 1): void {
        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: SFX "${name}" 未注册`);
            return;
        }
        audioEngine.play(def.path, false, volume);
    }

    // ── 通用 ──

    /** 停止所有音频，重置 BGM 追踪状态 */
    stopAll(): void {
        audioEngine.stopAll();
        this._bgmAudioId = -1;
        this._currentBGM = null;
    }
}
