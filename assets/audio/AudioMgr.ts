import { AudioSource, AudioClip } from 'cc';
import { Singleton } from 'db://ccgf-kit/common/Singleton';

/**
 * 音频管理器（Singleton）
 *
 * 消费端，通过 AudioRegistry 查找音频定义后驱动 AudioSource 播放。
 *
 * BGM: 独占播放（自动切歌），默认循环，使用托管通道（clip + play/pause/stop + loop）
 * SFX: 可叠加播放，不循环，使用 playOneShot（一次性通道）
 * Voice: 预留扩展（v2 启用）
 *
 * 使用前必须调用 init(bgm, sfx, voice?) 注入 AudioSource 组件。
 * 
 * 缓存 由 ResMgr（Cocos assetManager）统一管理。
 */
export class AudioMgr extends Singleton<AudioMgr> {

    private _registry = AudioRegistry.getInstance();
    private _initialized: boolean = false;

    // AudioSource 通道（由外部注入）
    private _bgmSource: AudioSource | null = null;
    private _sfxSource: AudioSource | null = null;
    private _voiceSource: AudioSource | null = null;

    private _currentBGM: string | null = null;


    public constructor() {
        super();
    }

    public registerManifest(manifest: IAudioManifest): void {
        this._registry.registerManifest(manifest);
    }

    // ── 初始化 ──

    /**
     * 初始化音频管理器。
     * 必须在首次播放前调用，由 GameBootstrap 在启动阶段注入 AudioSource。
     *
     * @param bgm  BGM 通道 AudioSource 组件
     * @param sfx  SFX 通道 AudioSource 组件
     * @param voice Voice 通道 AudioSource 组件（可选，v2 启用）
     */
    init(bgm: AudioSource, sfx: AudioSource, voice?: AudioSource): void {
        this._bgmSource = bgm;
        this._sfxSource = sfx;
        this._voiceSource = voice ?? null;
        this._initialized = true;
    }

    /** 检查是否已初始化，未初始化时输出 warn 并返回 false */
    private _checkInit(): boolean {
        if (!this._initialized) {
            H.log.warn('AudioMgr: 未初始化，请先调用 init()');
            return false;
        }
        return true;
    }

    // ── 资源加载 ──

    /**
     * 按名称加载 AudioClip。
     * 通过 ResMgr 异步加载，缓存由 ResMgr（Cocos assetManager）统一管理。
     */
    private async _loadClip(name: string): Promise<AudioClip | null> {
        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: "${name}" 未注册`);
            return null;
        }

        try {
            const clip = await M.res.load<AudioClip>({
                paths: def.path,
                type: AudioClip,
            });
            return clip as AudioClip;
        } catch (err) {
            H.log.warn(`AudioMgr: "${name}" 加载失败`, err);
            return null;
        }
    }

    // ── BGM ──

    /**
     * 播放背景音乐，默认循环。
     * 异步加载 AudioClip，加载完成后设置到 BGM 通道并播放。
     * 如果已有 BGM 正在播放，先停止再播新曲。
     */
    async playBGM(name: string, loop: boolean = true, volume: number = 1): Promise<void> {
        if (!this._checkInit()) return;

        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: BGM "${name}" 未注册`);
            return;
        }

        const clip = await this._loadClip(name);
        if (!clip) return;

        const source = this._bgmSource!;
        source.stop();
        source.clip = clip;
        source.loop = loop;
        source.volume = volume;
        source.play();
        this._currentBGM = name;
    }

    /** 停止当前 BGM */
    stopBGM(): void {
        if (!this._checkInit()) return;
        this._bgmSource?.stop();
        this._currentBGM = null;
    }

    /** 暂停当前 BGM */
    pauseBGM(): void {
        if (!this._checkInit()) return;
        this._bgmSource?.pause();
    }

    /** 恢复已暂停的 BGM */
    resumeBGM(): void {
        if (!this._checkInit()) return;
        this._bgmSource?.play();
    }

    /** 当前 BGM 名称（只读） */
    get currentBGM(): string | null {
        return this._currentBGM;
    }

    // ── SFX ──

    /**
     * 播放音效，不循环。
     * 内部异步加载 AudioClip，加载后通过 playOneShot 播放。
     * 多次调用可叠加，互不干扰（fire-and-forget）。
     */
    playSFX(name: string, volume: number = 1): void {
        if (!this._checkInit()) return;

        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: SFX "${name}" 未注册`);
            return;
        }

        // fire-and-forget：异步加载完成后播放
        void this._loadClip(name).then(clip => {
            if (clip) {
                this._sfxSource?.playOneShot(clip, volume);
            }
        });
    }

    // ── 通用 ──

    /**
     * 停止所有正在播放的 BGM 和 Voice。
     * SFX 的 playOneShot 无法中途停止，由引擎自然播放完毕。
     */
    stopAll(): void {
        if (!this._checkInit()) return;
        this._bgmSource?.stop();
        this._voiceSource?.stop();
        this._currentBGM = null;
    }
}


import type { IAudioEntry, IAudioManifest, AudioDefinition } from 'db://ccgf-kit/audio/IAudioRegistry';

/**
 * 音频注册容器（Singleton）
 *
 * 对标 DecoratorRegistry MVC 注册区，但无需装饰器：
 * Main.ts 启动时调用 registerManifest 完成集中注册。
 */
class AudioRegistry extends Singleton<AudioRegistry> {

    private _defs = new Map<string, AudioDefinition>();

    /**
     * 注册音频清单
     * 遍历 bgm / sfx / voice 三个分类，将每条 IAudioEntry 注入 category 后存入 _defs。
     * 同名重复注册：覆盖旧值 + 输出 warn。
     */
    registerManifest(manifest: IAudioManifest): void {
        const categories = ['bgm', 'sfx', 'voice'] as const;
        for (const category of categories) {
            for (const entry of manifest[category]) {
                if (this._defs.has(entry.name)) {
                    H.log.warn(`AudioRegistry: "${entry.name}" 重复注册，将被覆盖`);
                }
                this._defs.set(entry.name, {
                    name: entry.name,
                    path: entry.path,
                    category,
                });
            }
        }
    }

    /**
     * 按名称查询音频定义
     * @returns AudioDefinition 或 undefined（未注册）
     */
    get(name: string): AudioDefinition | undefined {
        return this._defs.get(name);
    }

    /**
     * 清空所有注册条目（主要用于测试/热重载）
     */
    clear(): void {
        this._defs.clear();
    }

    /**
     * 可迭代 — 遍历所有已注册音频定义
     */
    [Symbol.iterator](): Iterator<AudioDefinition> {
        return this._defs.values();
    }
}
