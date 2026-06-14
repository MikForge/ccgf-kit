'use strict';

import * as fs from 'fs';
import * as path from 'path';

/**
 * 单条复制规则。仅支持目录类型（src 以 / 结尾）。
 */
export interface ManifestEntry {
    /** 远程源目录路径（相对于仓库根），必须以 / 结尾 */
    src: string;
    /** 目标相对路径（以项目根为根，即 assets/ 所在目录） */
    dest: string;
}

/**
 * 复制清单。包含远程仓库信息和复制条目。
 */
export interface Manifest {
    /** GitHub 仓库，owner/repo 格式 */
    repo: string;
    /** 分支 / tag / commit SHA */
    ref: string;
    /** 复制条目数组，按顺序处理 */
    entries: ManifestEntry[];
}

/** repo 字段格式校验 */
const REPO_PATTERN = /^[^\/\s]+\/[^\/\s]+$/;

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

    // repo 字段校验
    if (typeof obj.repo !== 'string' || obj.repo.length === 0) {
        throw new Error('模版清单解析失败：缺少 repo 字段');
    }
    if (!REPO_PATTERN.test(obj.repo)) {
        throw new Error(`模版清单解析失败：repo 格式无效（期望 owner/repo，实际 ${obj.repo}）`);
    }

    // ref 字段校验
    if (typeof obj.ref !== 'string' || obj.ref.length === 0) {
        throw new Error('模版清单解析失败：缺少 ref 字段');
    }

    // entries 数组校验
    if (!Array.isArray(obj.entries)) {
        throw new Error('模版清单解析失败：缺少 entries 数组');
    }

    if (obj.entries.length === 0) {
        throw new Error('模版清单解析失败：entries 数组为空');
    }

    const entries: ManifestEntry[] = [];

    for (let i = 0; i < obj.entries.length; i++) {
        const entry = obj.entries[i];
        if (typeof entry !== 'object' || entry === null) {
            throw new Error(`模版清单解析失败：entries[${i}] 必须为对象`);
        }

        const e = entry as Record<string, unknown>;

        if (typeof e.src !== 'string' || e.src.length === 0) {
            throw new Error(`模版清单解析失败：entries[${i}].src 必须为非空字符串`);
        }
        if (typeof e.dest !== 'string' || e.dest.length === 0) {
            throw new Error(`模版清单解析失败：entries[${i}].dest 必须为非空字符串`);
        }

        // src 必须以 / 结尾（仅支持目录类型）
        if (!e.src.endsWith('/')) {
            throw new Error(
                `模版清单解析失败：entries[${i}].src 必须以 / 结尾（仅支持目录类型），实际 ${e.src}`,
            );
        }

        entries.push({ src: e.src, dest: e.dest });
    }

    return { repo: obj.repo, ref: obj.ref, entries };
}

/**
 * 从文件系统读取模版清单文件。
 *
 * @param extensionRoot - 扩展根目录的绝对路径（extensions/ccgf-kit/）
 * @returns 解析后的 Manifest 对象
 * @throws 如果文件不存在或解析失败
 */
export function readManifest(extensionRoot: string): Manifest {
    const manifestPath = path.join(extensionRoot, 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
        throw new Error(`模版清单 manifest.json 不存在（${manifestPath}）`);
    }

    const content = fs.readFileSync(manifestPath, 'utf-8');
    return parseManifest(content);
}
