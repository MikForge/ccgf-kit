'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDirListing = fetchDirListing;
exports.downloadRawFile = downloadRawFile;
const https = __importStar(require("https"));
/**
 * 执行 HTTP GET 请求并返回响应体字符串。
 *
 * @param url - 完整的 HTTPS URL
 * @param headers - 额外的请求头
 * @returns 响应体字符串
 * @throws 非 2xx 状态码或网络错误
 */
function httpsGet(url, headers = {}) {
    const token = process.env['GITHUB_TOKEN'] || '';
    return new Promise((resolve, reject) => {
        const baseHeaders = { 'User-Agent': 'ccgf-kit' };
        if (token) {
            baseHeaders['Authorization'] = `Bearer ${token}`;
        }
        const req = https.get(url, { headers: { ...baseHeaders, ...headers } }, (res) => {
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf-8');
                if (res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(body);
                }
                else {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage || 'Unknown'}`));
                }
            });
            res.on('error', reject);
        });
        req.on('error', reject);
        req.end();
    });
}
/**
 * 根据 ref（分支/tag/commit）获取树 SHA。
 *
 * GET /repos/{owner}/{repo}/commits/{ref} → commit.tree.sha
 *
 * @param repo - 仓库 owner/repo 格式
 * @param ref - 分支 / tag / commit SHA
 * @returns 树 SHA 字符串
 * @throws HTTP 错误或网络错误
 */
async function getTreeSha(repo, ref) {
    const apiUrl = `https://api.github.com/repos/${repo}/commits/${ref}`;
    const headers = {
        Accept: 'application/vnd.github.v3+json',
    };
    const body = await httpsGet(apiUrl, headers);
    const data = JSON.parse(body);
    const sha = data?.commit?.tree?.sha;
    if (!sha) {
        throw new Error(`无法获取 ref ${ref} 的树 SHA：${body.substring(0, 200)}`);
    }
    return sha;
}
/**
 * 获取 GitHub 仓库指定目录下的所有文件列表。
 *
 * 使用 Git Trees API（一次请求获取完整仓库树，然后按前缀过滤）：
 *   GET /repos/{owner}/{repo}/commits/{ref}     → tree SHA
 *   GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1  → 完整文件树
 *
 * 每次 initProject 仅 2 次 API 调用，不递归，不耗尽速率限额。
 *
 * @param repo - 仓库 owner/repo 格式
 * @param ref - 分支 / tag / commit SHA
 * @param srcPath - 远程源目录路径（相对于仓库根）
 * @returns 文件条目数组（仅 file 类型，已按前缀过滤）
 * @throws 网络错误或 ref 无效时抛出
 */
async function fetchDirListing(repo, ref, srcPath) {
    // 1. 获取树 SHA
    const treeSha = await getTreeSha(repo, ref);
    // 2. 获取完整仓库文件树
    const treeUrl = `https://api.github.com/repos/${repo}/git/trees/${treeSha}?recursive=1`;
    const headers = {
        Accept: 'application/vnd.github.v3+json',
    };
    let body;
    try {
        body = await httpsGet(treeUrl, headers);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('404')) {
            return [];
        }
        throw e;
    }
    let data;
    try {
        data = JSON.parse(body);
    }
    catch {
        throw new Error(`Git Trees API 返回非 JSON 数据：${body.substring(0, 200)}`);
    }
    if (!data.tree || !Array.isArray(data.tree)) {
        return [];
    }
    // 3. 按 srcPath 前缀过滤，仅保留 blob（文件）类型
    const prefix = srcPath.replace(/\/+$/, '');
    return data.tree
        .filter((item) => item.type === 'blob' && item.path.startsWith(prefix + '/'))
        .map((item) => ({
        path: item.path,
        type: 'file',
        download_url: null,
        name: item.path.split('/').pop() || '',
    }));
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
async function downloadRawFile(repo, ref, filePath) {
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;
    try {
        return await httpsGet(rawUrl);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`下载文件失败 ${filePath}：${msg}`);
    }
}
