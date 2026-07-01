
export enum LocalStorageKey {
    
    /** 是否第一次进入游戏 */
    IsFirstEnter = "IsFirstEnter",

    /** cached token */
    CachedToken = "CachedToken",

    /** BGM 音量 (0-1) */
    AudioBgmVolume = "AudioBgmVolume",

    /** SFX 音量 (0-1) */
    AudioSfxVolume = "AudioSfxVolume",

    /** BGM 开关状态 ("1"=开, "0"=关) */
    AudioBgmEnabled = "AudioBgmEnabled",

    /** SFX 开关状态 ("1"=开, "0"=关) */
    AudioSfxEnabled = "AudioSfxEnabled",
}