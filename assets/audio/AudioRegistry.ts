import { Singleton } from 'db://ccgf-kit/common';

import { LogHelper } from 'db://ccgf-kit/helper';
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
    readonly bgm:   readonly IAudioEntry[];
    readonly sfx:   readonly IAudioEntry[];
    readonly voice: readonly IAudioEntry[];
}

/**
 * 注册后存储的完整音频定义
 */
export interface AudioDefinition extends IAudioEntry {
    readonly category: keyof IAudioManifest;
}

/**
 * 音频注册容器（Singleton）
 *
 * 对标 MVCInternalRegistry，但无需装饰器：
 * Main.ts 启动时调用 registerManifest 完成集中注册。
 */
export class AudioRegistry extends Singleton<AudioRegistry> {

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
                    LogHelper.warn(`AudioRegistry: "${entry.name}" 重复注册，将被覆盖`);
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
