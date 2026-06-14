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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const manifest_1 = require("./manifest");
/** 项目 root 目录的缓存 */
let _projectRoot = '';
/**
 * 获取 Cocos Creator 项目根目录。
 */
function getProjectRoot() {
    if (!_projectRoot) {
        // Editor.Project.path 在 Cocos Creator 3.x 中可用
        _projectRoot = Editor.Project.path || '';
    }
    return _projectRoot;
}
/**
 * 获取扩展所在目录（extensions/ccgf-kit/）。
 * 编译后 main.js 位于 dist/，因此上两级为扩展根目录。
 */
function getExtensionRoot() {
    // __dirname 指向 dist/，回到上级即扩展根
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
 * 获取目录下所有文件的相对路径列表（递归）。
 *
 * @param dirPath 目录绝对路径
 * @param basePath 用于计算相对路径的基准路径
 * @returns 相对路径数组
 */
function listFilesRecursive(dirPath, basePath) {
    const files = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.relative(basePath, fullPath);
        if (entry.isDirectory()) {
            // 递归遍历子目录
            files.push(...listFilesRecursive(fullPath, basePath));
        }
        else if (entry.isFile()) {
            files.push(relPath);
        }
    }
    return files;
}
/**
 * 执行单条目复制（文件或目录）。
 *
 * @param templatesDir templates 目录的绝对路径
 * @param entry 复制清单条目
 * @returns 创建的文件数
 */
async function processEntry(templatesDir, entry) {
    const { src, dest } = entry;
    // 判断是否为目录类型（src 以 / 结尾）
    if (src.endsWith('/')) {
        // 目录条目：递归复制目录下所有文件
        const srcDir = path.join(templatesDir, src);
        if (!fs.existsSync(srcDir)) {
            console.warn(`[ccgf-kit] [warn] 模版目录不存在：${src}`);
            return 0;
        }
        const files = listFilesRecursive(srcDir, path.join(templatesDir, src));
        let createdCount = 0;
        for (const relFile of files) {
            const srcFile = path.join(srcDir, relFile);
            const destRelPath = path.join(dest, relFile);
            const destUrl = toDbUrl(destRelPath);
            // 检查目标是否已存在
            const existing = await Editor.Message.request('asset-db', 'query-asset-info', destUrl);
            if (existing) {
                console.log(`[ccgf-kit] [skipped] ${destRelPath}`);
                continue;
            }
            const content = fs.readFileSync(srcFile, 'utf-8');
            // 确保父目录存在（asset-db 的 create-asset 会自动创建父目录）
            await Editor.Message.request('asset-db', 'create-asset', destUrl, content, {});
            console.log(`[ccgf-kit] [created] ${destRelPath}`);
            createdCount++;
        }
        return createdCount;
    }
    else {
        // 文件条目：复制单个文件
        const srcFile = path.join(templatesDir, src);
        if (!fs.existsSync(srcFile)) {
            console.warn(`[ccgf-kit] [warn] 模版文件不存在：${src}`);
            return 0;
        }
        const destUrl = toDbUrl(dest);
        // 检查目标是否已存在
        const existing = await Editor.Message.request('asset-db', 'query-asset-info', destUrl);
        if (existing) {
            console.log(`[ccgf-kit] [skipped] ${dest}`);
            return 0;
        }
        const content = fs.readFileSync(srcFile, 'utf-8');
        await Editor.Message.request('asset-db', 'create-asset', destUrl, content, {});
        console.log(`[ccgf-kit] [created] ${dest}`);
        return 1;
    }
}
/**
 * 初始化项目脚本：将模版文件按清单复制到项目 scripts 目录。
 *
 * 流程：
 * 1. 读取 templates/manifest.json
 * 2. 遍历 entries，逐条执行复制
 * 3. 输出汇总日志
 */
async function initProject() {
    try {
        const extensionRoot = getExtensionRoot();
        const templatesDir = path.join(extensionRoot, 'templates');
        // 1. 读取清单
        const manifest = (0, manifest_1.readManifest)(templatesDir);
        // 2. 检查是否为空
        if (manifest.entries.length === 0) {
            console.log('[ccgf-kit] 无待复制条目');
            return;
        }
        // 3. 逐条处理
        let createdCount = 0;
        let skippedCount = 0;
        for (const entry of manifest.entries) {
            try {
                const created = await processEntry(templatesDir, entry);
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
