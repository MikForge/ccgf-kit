"use strict";
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
exports.scanResources = scanResources;
exports.generateResourceMap = generateResourceMap;
exports.verifyResourceMap = verifyResourceMap;
exports.generateResourceMapAll = generateResourceMapAll;
// ============================================================
// 导入
// ============================================================
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ============================================================
// 常量：扩展名 → 资源类型分类
// ============================================================
const EXT_TO_CATEGORY = {
    '.prefab': 'prefab',
    '.png': 'texture',
    '.jpg': 'texture',
    '.jpeg': 'texture',
    '.webp': 'texture',
    '.mp3': 'audio',
    '.wav': 'audio',
    '.ogg': 'audio',
    '.skel': 'spine',
    '.json': 'spine',
    '.atlas': 'spine',
};
// ============================================================
// 1. 扫描器：递归扫描 resources/ 目录，按扩展名分类
// ============================================================
/**
 * 递归扫描 resources/ 目录，按扩展名分类。
 * 重复 key 收集全部冲突后统一报告，不中断扫描。
 */
function scanResources(resourcesDir) {
    const categories = {};
    const summary = {};
    const duplicates = [];
    if (!fs.existsSync(resourcesDir)) {
        return { categories, summary, duplicates, hasDuplicates: false };
    }
    const seenKeys = {}; // category → Set<key>
    function walk(dir, relativeBase) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath, relativeBase);
                continue;
            }
            const ext = path.extname(entry.name).toLowerCase();
            const category = EXT_TO_CATEGORY[ext];
            if (!category)
                continue;
            const key = path.basename(entry.name, ext);
            const relPath = path.relative(relativeBase, fullPath).replace(/\\/g, '/');
            const value = relPath.replace(/\.[^/.]+$/, '');
            if (!categories[category])
                categories[category] = {};
            if (!seenKeys[category])
                seenKeys[category] = new Set();
            if (seenKeys[category].has(key)) {
                // 收集重复，跳过此条目（保留首次遇到的映射）
                duplicates.push({
                    category,
                    key,
                    kept: categories[category][key],
                    skipped: value,
                });
                continue;
            }
            seenKeys[category].add(key);
            categories[category][key] = value;
            summary[category] = (summary[category] ?? 0) + 1;
        }
    }
    walk(resourcesDir, resourcesDir);
    return { categories, summary, duplicates, hasDuplicates: duplicates.length > 0 };
}
// ============================================================
// 2. 生成器：接收扫描结果，写入 resource-map.json
// ============================================================
/**
 * 接收 scanner 结果，生成 resource-map.json
 */
function generateResourceMap(scanResult, options) {
    const merged = scanResult.categories;
    // 确保输出目录存在
    const dir = path.dirname(options.outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(options.outputPath, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
}
// ============================================================
// 3. 校验器：CI 一致性校验，检查 JSON 中的路径在磁盘上是否存在
// ============================================================
/**
 * CI 一致性校验：解析 resource-map.json 所有路径，逐个检查磁盘文件是否存在。
 * 不同步时返回 false。
 */
function verifyResourceMap(resourcesDir) {
    const mapPath = path.resolve(resourcesDir, 'resource-map.json');
    if (!fs.existsSync(mapPath)) {
        console.error('[verify-resource-map] resource-map.json 不存在，请先执行"生成资源映射表"');
        return false;
    }
    let map;
    try {
        const raw = fs.readFileSync(mapPath, 'utf-8');
        map = JSON.parse(raw);
    }
    catch (e) {
        console.error(`[verify-resource-map] resource-map.json 解析失败: ${e.message}`);
        return false;
    }
    let allOk = true;
    let checked = 0;
    for (const [category, entries] of Object.entries(map)) {
        for (const [key, relPath] of Object.entries(entries)) {
            checked++;
            // 检查对应文件（不带扩展名，尝试常见扩展名）
            const basePath = path.resolve(resourcesDir, relPath);
            const exts = ['.prefab', '.png', '.jpg', '.mp3', '.wav', '.skel', '.json', '.atlas', ''];
            let found = false;
            for (const ext of exts) {
                if (fs.existsSync(basePath + ext)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.error(`[verify-resource-map] 缺失: [${category}] key="${key}" → 路径 "${relPath}" 在磁盘上不存在`);
                allOk = false;
            }
        }
    }
    console.log(`[verify-resource-map] 已检查 ${checked} 个映射条目，${allOk ? '全部一致' : '存在不一致'}`);
    return allOk;
}
// ============================================================
// 4. 编排入口：扫描 → 生成 JSON 全流程
// ============================================================
/** 项目根目录（ccgf-kit extension src/ 的上一级是 ccgf-kit/，上两级是项目根） */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
/**
 * 构建脚本入口：自动发现所有 Cocos Creator bundle，为每个独立生成 resource-map.json。
 * @param assetsDir - 可选，assets 目录绝对路径（默认从 PROJECT_ROOT 推导），用于测试注入
 */
function generateResourceMapAll(assetsDir) {
    const assetsRoot = assetsDir ?? path.join(PROJECT_ROOT, 'assets');
    console.log('[resource-map-gen] 开始发现 bundle:', assetsRoot);
    if (!fs.existsSync(assetsRoot)) {
        console.warn(`[resource-map-gen] assets 目录不存在: ${assetsRoot}`);
        return;
    }
    // 1. 发现所有 bundle：扫描 *.meta，筛选 isBundle
    const bundleDirs = [];
    const metaEntries = fs.readdirSync(assetsRoot, { withFileTypes: true });
    for (const entry of metaEntries) {
        if (!entry.isFile() || !entry.name.endsWith('.meta'))
            continue;
        const metaPath = path.join(assetsRoot, entry.name);
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta?.userData?.isBundle === true) {
                const bundleDir = path.join(assetsRoot, path.basename(entry.name, '.meta'));
                if (fs.existsSync(bundleDir) && fs.statSync(bundleDir).isDirectory()) {
                    bundleDirs.push(bundleDir);
                }
            }
        }
        catch (e) {
            console.warn(`[resource-map-gen] 跳过无法解析的 .meta: ${entry.name} (${e.message})`);
        }
    }
    console.log(`[resource-map-gen] 发现 ${bundleDirs.length} 个 bundle:`, bundleDirs.map(d => path.basename(d)).join(', ') || '(无)');
    if (bundleDirs.length === 0) {
        console.warn('[resource-map-gen] 未发现任何 bundle，未生成 resource-map.json');
        return;
    }
    // 2. 对每个 bundle 执行扫描 + 生成
    for (const bundleDir of bundleDirs) {
        const outputPath = path.resolve(bundleDir, 'resource-map.json');
        console.log(`\n[resource-map-gen] 扫描 bundle: ${path.basename(bundleDir)} (${bundleDir})`);
        const scanResult = scanResources(bundleDir);
        console.log('[resource-map-gen] 扫描完成，分类统计:');
        for (const [cat, count] of Object.entries(scanResult.summary)) {
            console.log(`  ${cat}: ${count} 个资源`);
        }
        // 重复 key 告警（非阻断，跳过冲突条目继续生成）
        if (scanResult.hasDuplicates) {
            console.warn(`\n[resource-map-gen] ⚠️  检测到 ${scanResult.duplicates.length} 个重复 key（已跳过，保留首次遇到的文件）:\n`);
            for (const d of scanResult.duplicates) {
                console.warn(`  [${d.category}] key="${d.key}"`);
                console.warn(`    保留: ${d.kept}`);
                console.warn(`    跳过: ${d.skipped}\n`);
            }
            console.warn('请重命名冲突的资源文件后重新生成以消除告警。\n');
        }
        // 生成 JSON
        const merged = generateResourceMap(scanResult, {
            resourcesDir: bundleDir,
            outputPath,
        });
        console.log(`[resource-map-gen] ${path.basename(bundleDir)}/resource-map.json 已生成 (${Object.keys(merged).length} 个类型)`);
    }
    console.log('\n[resource-map-gen] 全部完成');
}
// CLI 入口：直接执行时运行校验
if (require.main === module) {
    const resourcesDir = path.resolve(PROJECT_ROOT, 'assets', 'resources');
    const ok = verifyResourceMap(resourcesDir);
    process.exit(ok ? 0 : 1);
}
