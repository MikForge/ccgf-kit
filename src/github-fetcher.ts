'use strict';

import * as https from 'https';

/**
 * GitHub Contents API 返回的单个目录条目。
 */
export interface GitHubDirEntry {
    /** 相对于仓库根的路径 */
    path: string;
    /** 条目类型：file 或 dir */
    type: 'file' | 'dir';
    /** 文件原始下载地址（目录为 null） */
    download_url: string | null;
    /** 文件/目录名 */
    name: string;
}

/**
 * 执行 HTTP GET 请求并返回响应体字符串。
 *
 * @param url - 完整的 HTTPS URL
 * @param headers - 额外的请求头
 * @returns 响应体字符串
 * @throws 非 2xx 状态码或网络错误
 */
function httpsGet(url: string, headers: Record<string, string> = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const req = https.get(
            url,
            { headers: { 'User-Agent': 'ccgf-kit', ...headers } },
            (res) => {
                const chunks: Buffer[] = [];

                res.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    const body = Buffer.concat(chunks).toString('utf-8');
                    if (res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(body);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage || 'Unknown'}`));
                    }
                });

                res.on('error', reject);
            },
        );

        req.on('error', reject);
        req.end();
    });
}

/**
 * 递归获取 GitHub 仓库指定目录下的所有文件列表。
 *
 * 使用 GitHub Contents API：
 *   GET /repos/{owner}/{repo}/contents/{path}?ref={ref}
 *
 * @param repo - 仓库 owner/repo 格式
 * @param ref - 分支 / tag / commit SHA
 * @param srcPath - 远程源目录路径（相对于仓库根）
 * @returns 文件条目数组（仅 file 类型，已递归展开子目录）
 * @throws 网络错误时抛出
 */
export async function fetchDirListing(
    repo: string,
    ref: string,
    srcPath: string,
): Promise<GitHubDirEntry[]> {
    // 去除末尾 / 用于 API 调用
    const cleanPath = srcPath.replace(/\/+$/, '');

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${cleanPath}?ref=${ref}`;
    const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
    };

    let body: string;
    try {
        body = await httpsGet(apiUrl, headers);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        // 404 表示目录不存在，返回空数组
        if (msg.includes('404')) {
            return [];
        }
        throw e;
    }

    let entries: GitHubDirEntry[];
    try {
        entries = JSON.parse(body) as GitHubDirEntry[];
    } catch {
        throw new Error(`GitHub Contents API 返回非 JSON 数据：${body.substring(0, 200)}`);
    }

    if (!Array.isArray(entries)) {
        return [];
    }

    const files: GitHubDirEntry[] = [];

    for (const entry of entries) {
        if (entry.type === 'file') {
            files.push(entry);
        } else if (entry.type === 'dir') {
            // 递归展开子目录
            const subFiles = await fetchDirListing(repo, ref, entry.path + '/');
            files.push(...subFiles);
        }
    }

    return files;
}

/**
 * 从 raw.githubusercontent.com 下载单个文件内容。
 *
 * URL 格式：https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{filePath}
 *
 * @param repo - 仓库 owner/repo 格式
 * @param ref - 分支 / tag / commit SHA
 * @param filePath - 文件路径（相对于仓库根）
 * @returns 文件内容（UTF-8 字符串）
 * @throws HTTP 错误或网络错误
 */
export async function downloadRawFile(
    repo: string,
    ref: string,
    filePath: string,
): Promise<string> {
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;

    try {
        return await httpsGet(rawUrl);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`下载文件失败 ${filePath}：${msg}`);
    }
}
