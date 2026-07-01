import { AudioSource, AudioClip } from 'cc';
import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { AudioDefinition, IAudioManifest } from 'db://ccgf-kit/audio/IAudioRegistry';
import { AudioCategory } from 'db://ccgf-kit/audio/audio.enum';

/**
 * 音频管理器（Singleton）
 *
 * 消费端，通过 AudioRegistry 查找音频定义后驱动 AudioSource 播放。
 *
 * BGM:  独占播放（自动切歌），默认循环，使用托管通道（clip + play/pause/stop + loop）
 * SFX:  可叠加播放，不循环，使用 playOneShot（一次性通道）
 * Voice: 独占播放，不循环，使用托管通道（clip + play/stop）
 *
 * 使用前必须调用 init(sources: Record<AudioCategory, AudioSource>) 注入 AudioSource 组件。
 *
 * 缓存 由 ResMgr（Cocos assetManager）统一管理。
 */
export class AudioMgr extends Singleton<AudioMgr> {

    private _registry = AudioRegistry.getInstance();
    
    private _initialized: boolean = false;

    // AudioSource 通道（由外部注入），按 AudioCategory 索引
    private _sources: Record<AudioCategory, AudioSource | null> = {
        [AudioCategory.BGM]: null,
        [AudioCategory.SFX]: null,
        [AudioCategory.Voice]: null,
    };

    private _currentBGM: string | null = null;

    // 播放列表管理
    private _playlist: string[] = [];
    private _playlistIndex: number = 0;

    // 音量缓存
    private _volumeCache: Record<AudioCategory, number> = {
        [AudioCategory.BGM]: 1,
        [AudioCategory.SFX]: 1,
        [AudioCategory.Voice]: 1,
    };


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
     * @param sources 按 AudioCategory 索引的 AudioSource 映射
     */
    init(sources: Record<AudioCategory, AudioSource>): void {
        this._sources = { ...sources };
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
     * 按 category + name 查找并加载 AudioClip。
     * 通过 ResMgr 异步加载，缓存由 ResMgr（Cocos assetManager）统一管理。
     * 类型校验：def.category 与传入 category 不匹配时 warn 并返回 null。
     */
    private async _loadClip(category: AudioCategory, name: string): Promise<AudioClip | null> {
        const def = this._registry.get(name);
        if (!def) {
            H.log.warn(`AudioMgr: "${name}" 未注册`);
            return null;
        }
        if (def.category !== category) {
            H.log.warn(`AudioMgr: "${name}" 不属于 ${AudioCategory[category]}（实际: ${AudioCategory[def.category]}）`);
            return null;
        }

        try {
            const clip = await M.res.load<AudioClip>({
                pathkey: name,
                type: AudioClip,
                bundle: "audios"
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

        const clip = await this._loadClip(AudioCategory.BGM, name);
        if (!clip) return;

        const source = this._sources[AudioCategory.BGM]!;
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
        this._currentBGM = null;
        this._sources[AudioCategory.BGM]?.stop();
        this._playlist = [];
        this._playlistIndex = 0;
    }

    /** 暂停当前 BGM */
    pauseBGM(): void {
        if (!this._checkInit()) return;
        this._sources[AudioCategory.BGM]?.pause();
    }

    /** 恢复已暂停的 BGM */
    resumeBGM(): void {
        if (!this._checkInit()) return;
        this._sources[AudioCategory.BGM]?.play();
    }

    /** 当前 BGM 名称（只读） */
    get currentBGM(): string | null {
        return this._currentBGM;
    }

    // ── 播放列表 ──

    /**
     * 播放 BGM 列表，自动切歌 + 列表循环
     */
    playBGMList(list: string[]): void {
        if (!this._checkInit()) return;
        if (list.length === 0) {
            H.log.warn('AudioMgr: BGM 列表为空');
            return;
        }
        this._playlist = [...list];
        this._playlistIndex = 0;
        this._playNextInList();
    }

    /** 播放列表中当前索引的曲目 */
    private async _playNextInList(): Promise<void> {
        if (this._playlist.length === 0) return;
        const name = this._playlist[this._playlistIndex];
        const clip = await this._loadClip(AudioCategory.BGM, name);
        if (!clip) {
            H.log.error(`AudioMgr: ${name} can not get`)
            return;
        }
        const source = this._sources[AudioCategory.BGM]!;
        source.stop();
        source.clip = clip;
        source.loop = false;
        source.volume = this._volumeCache[AudioCategory.BGM];
        source.play();
        this._currentBGM = name;

        // 监听播放完毕事件 → 自动切歌
        source.node.once(AudioSource.EventType.ENDED, () => {
            if (this._currentBGM !== null) {
                this._advancePlaylist();
            }
        });
    }

    /** 推进到列表下一首（列表循环） */
    private _advancePlaylist(): void {
        if (this._playlist.length === 0) return;
        this._playlistIndex++;
        if (this._playlistIndex >= this._playlist.length) {
            this._playlistIndex = 0;
        }
        this._playNextInList();
    }

    // ── SFX ──

    /**
     * 播放音效，不循环。
     * 内部异步加载 AudioClip，加载后通过 playOneShot 播放。
     * 多次调用可叠加，互不干扰（fire-and-forget）。
     */
    playSFX(name: string, volume: number = this._volumeCache[AudioCategory.SFX]): void {
        if (!this._checkInit()) return;

        // fire-and-forget：异步加载完成后播放
        void this._loadClip(AudioCategory.SFX, name).then(clip => {
            if (clip) {
                this._sources[AudioCategory.SFX]?.playOneShot(clip, volume);
            }
        });
    }

    // ── Voice ──

    /**
     * 播放语音，默认不循环。
     * 独占 Voice 通道 — 新语音自动中断当前语音。
     */
    async playVoice(name: string, volume: number = this._volumeCache[AudioCategory.Voice]): Promise<void> {
        if (!this._checkInit()) return;

        const clip = await this._loadClip(AudioCategory.Voice, name);
        if (!clip) return;

        const source = this._sources[AudioCategory.Voice]!;
        source.stop();
        source.clip = clip;
        source.loop = false;
        source.volume = volume;
        source.play();
    }

    /** 停止当前语音 */
    stopVoice(): void {
        if (!this._checkInit()) return;
        this._sources[AudioCategory.Voice]?.stop();
    }

    // ── 音量 ──

    /**
     * 设置音量（0-1），立即更新缓存和 AudioSource
     */
    setVolume(category: AudioCategory, vol: number): void {
        this._volumeCache[category] = Math.max(0, Math.min(1, vol));
        const source = this._sources[category];
        if (source) source.volume = this._volumeCache[category];
    }

    /**
     * 读取缓存中的音量
     */
    getVolume(category: AudioCategory): number {
        return this._volumeCache[category];
    }

    // ── 通用 ──

    /**
     * 停止所有正在播放的 BGM 和 Voice。
     * SFX 的 playOneShot 无法中途停止，由引擎自然播放完毕。
     */
    stopAll(): void {
        if (!this._checkInit()) return;
        this._currentBGM = null;
        this._playlist = [];
        this._playlistIndex = 0;
        this._sources[AudioCategory.BGM]?.stop();
        this._sources[AudioCategory.Voice]?.stop();
    }
}




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
     * 遍历 AudioCategory 枚举所有分类，将每条 IAudioEntry 注入 category 后存入 _defs。
     * 同名重复注册：覆盖旧值 + 输出 warn。
     */
    registerManifest(manifest: IAudioManifest): void {
        const categories = [AudioCategory.BGM, AudioCategory.SFX, AudioCategory.Voice];
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
