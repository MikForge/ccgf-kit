import { AudioCategory } from 'db://ccgf-kit/audio/audio.enum';

/**
 * 单个音频条目的输入定义
 */
export interface IAudioEntry {
    readonly name: string;
    readonly path: string;
}

/**
 * 音频清单 — 应用层按此结构声明数据
 */
export interface IAudioManifest {
    readonly [AudioCategory.BGM]:   readonly IAudioEntry[];
    readonly [AudioCategory.SFX]:   readonly IAudioEntry[];
    readonly [AudioCategory.Voice]: readonly IAudioEntry[];
}

/**
 * 注册后存储的完整音频定义
 */
export interface AudioDefinition extends IAudioEntry {
    readonly category: AudioCategory;
}
