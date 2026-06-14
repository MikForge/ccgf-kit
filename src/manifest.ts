'use strict';

import * as fs from 'fs';
import * as path from 'path';

/**
 * 单条复制规则。
 */
export interface ManifestEntry {
    /** 模版相对路径（以 templates/ 为根）。以 / 结尾时为目录类型 */
    src: string;
    /** 目标相对路径（以项目根为根，即 assets/ 所在目录） */
    dest: string;
}

/**
 * 复制清单。
 */
export interface Manifest {
    /** 复制条目数组，按顺序处理 */
    entries: ManifestEntry[];
}

/**
 * 将 JSON 字符串解析为 Manifest。
 *
 * @param json - 待解析的 JSON 字符串
 * @returns 解析后的 Manifest 对象
 * @throws 如果 JSON 格式错误或缺少必填字段
 */
export function parseManifest(json: string): Manifest {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`模版清单解析失败：${msg}`);
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('模版清单解析失败：根元素必须为对象');
    }

    const obj = parsed as Record<string, unknown>;

    if (!Array.isArray(obj.entries)) {
        throw new Error('模版清单解析失败：缺少 entries 数组');
    }

    const entries: ManifestEntry[] = [];

    for (let i = 0; i < obj.entries.length; i++) {
        const entry = obj.entries[i];
        if (typeof entry !== 'object' || entry === null) {
            throw new Error(`模版清单解析失败：entries[${i}] 必须为对象`);
        }

        const e = entry as Record<string, unknown>;

        if (typeof e.src !== 'string') {
            throw new Error(`模版清单解析失败：entries[${i}].src 必须为字符串`);
        }
        if (typeof e.dest !== 'string') {
            throw new Error(`模版清单解析失败：entries[${i}].dest 必须为字符串`);
        }

        entries.push({ src: e.src, dest: e.dest });
    }

    return { entries };
}

/**
 * 从文件系统读取模版清单文件。
 *
 * @param templatesDir - templates 目录的绝对路径
 * @returns 解析后的 Manifest 对象
 * @throws 如果文件不存在或解析失败
 */
export function readManifest(templatesDir: string): Manifest {
    const manifestPath = path.join(templatesDir, 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
        throw new Error(`模版清单 templates/manifest.json 不存在`);
    }

    const content = fs.readFileSync(manifestPath, 'utf-8');
    return parseManifest(content);
}
