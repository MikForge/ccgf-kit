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
exports.initProject = initProject;
const path = __importStar(require("path"));
const manifest_1 = require("./manifest");
const github_fetcher_1 = require("./github-fetcher");
/**
 * 获取扩展所在目录（extensions/ccgf-kit/）。
 * 编译后 main.js 位于 dist/，因此上一级为扩展根目录。
 */
function getExtensionRoot() {
    return path.resolve(__dirname, '..');
}
/**
 * 将相对路径转换为 asset-db URL（db:// 格式）。
 * 例如 "assets/scripts/GlobalApi.ts" → "db://assets/scripts/GlobalApi.ts"
 */
function toDbUrl(relativePath) {
    return 'db://' + relativePath.replace(/\\/g, '/');
}
/**
 * 执行单条目复制：从远程 GitHub 下载目录并写入项目。
 *
 * @param repo - GitHub 仓库 owner/repo
 * @param ref - 分支 / tag / commit
 * @param entry - 复制清单条目（仅目录类型）
 * @returns 创建的文件数
 */
async function processEntry(repo, ref, entry) {
    const { src, dest } = entry;
    // 1. 从 GitHub Contents API 获取远程文件列表
    let files;
    try {
        files = await (0, github_fetcher_1.fetchDirListing)(repo, ref, src);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[ccgf-kit] [warn] 获取远程目录列表失败 ${src}：${message}`);
        return 0;
    }
    if (files.length === 0) {
        console.log(`[ccgf-kit] 远程目录为空：${src}`);
        return 0;
    }
    let createdCount = 0;
    for (const gitFile of files) {
        // 计算目标路径：src 目录前缀映射到 dest
        const relativePath = gitFile.path.slice(src.length);
        const destRelPath = path.join(dest, relativePath);
        const destUrl = toDbUrl(destRelPath);
        // 2. 检查目标是否已存在
        try {
            const existing = await Editor.Message.request('asset-db', 'query-asset-info', destUrl);
            if (existing) {
                console.log(`[ccgf-kit] [skipped] ${destRelPath}`);
                continue;
            }
        }
        catch {
            // query-asset-info 失败时假定不存在，继续写入
        }
        // 3. 下载文件内容
        let content;
        try {
            content = await (0, github_fetcher_1.downloadRawFile)(repo, ref, gitFile.path);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[ccgf-kit] [warn] 下载文件失败 ${gitFile.path}：${message}`);
            continue;
        }
        // 4. 通过 asset-db 写入项目
        try {
            await Editor.Message.request('asset-db', 'create-asset', destUrl, content, {});
            console.log(`[ccgf-kit] [created] ${destRelPath}`);
            createdCount++;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[ccgf-kit] [warn] 写入文件失败 ${destRelPath}：${message}`);
        }
    }
    return createdCount;
}
/**
 * 初始化项目脚本：从远程 GitHub 仓库下载模板文件到项目。
 *
 * 流程：
 * 1. 读取 manifest.json（位于扩展根目录）
 * 2. 遍历 entries，逐条从远程下载并写入
 * 3. 输出汇总日志
 */
async function initProject() {
    try {
        const extensionRoot = getExtensionRoot();
        // 1. 读取清单
        const manifest = (0, manifest_1.readManifest)(extensionRoot);
        // 2. 校验 entries
        if (manifest.entries.length === 0) {
            console.log('[ccgf-kit] 无待复制条目');
            return;
        }
        const { repo, ref } = manifest;
        // 3. 逐条处理
        let createdCount = 0;
        let skippedCount = 0;
        for (const entry of manifest.entries) {
            try {
                const created = await processEntry(repo, ref, entry);
                if (created > 0) {
                    createdCount += created;
                }
                else {
                    skippedCount++;
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                console.warn(`[ccgf-kit] [warn] 处理条目 ${entry.src} → ${entry.dest} 失败：${message}`);
                skippedCount++;
            }
        }
        // 4. 输出汇总
        console.log(`[ccgf-kit] [created] ${createdCount}, [skipped] ${skippedCount}`);
        console.log('');
        console.log('请手动完成以下步骤：');
        console.log('1. 将 Main.ts 拖到 root 节点上');
        console.log('2. 将 game 子节点拖入 Main 组件的 gameRoot 属性');
        console.log('3. 将 gui 子节点拖入 Main 组件的 uiRoot 属性');
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[ccgf-kit] ${message}`);
    }
}
