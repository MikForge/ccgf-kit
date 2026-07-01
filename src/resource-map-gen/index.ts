// ============================================================
// 导入
// ============================================================
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// 常量：扩展名 → 资源类型分类
// ============================================================
const EXT_TO_CATEGORY: Record<string, string> = {
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
// 类型定义
// ============================================================

export interface DuplicateEntry {
    category: string;
    key: string;
    /** 首次遇到的文件（保留在映射中） */
    kept: string;
    /** 冲突的文件（被跳过） */
    skipped: string;
}

export interface ScanResult {
    /** 资源类型 → (key → 相对路径)，重复 key 仅保留首次遇到的 */
    categories: Record<string, Record<string, string>>;
    /** 生成摘要 */
    summary: Record<string, number>;
    /** 重复 key 列表 */
    duplicates: DuplicateEntry[];
    /** 是否有重复（CI 可用此字段判断是否报错） */
    hasDuplicates: boolean;
}

export interface GenerateOptions {
    /** assets/resources/ 绝对路径 */
    resourcesDir: string;
    /** resource-map.json 输出绝对路径 */
    outputPath: string;
}

// ============================================================
// 1. 扫描器：递归扫描 resources/ 目录，按扩展名分类
// ============================================================

/**
 * 递归扫描 resources/ 目录，按扩展名分类。
 * 重复 key 收集全部冲突后统一报告，不中断扫描。
 */
export function scanResources(resourcesDir: string): ScanResult {
    const categories: Record<string, Record<string, string>> = {};
    const summary: Record<string, number> = {};
    const duplicates: DuplicateEntry[] = [];

    if (!fs.existsSync(resourcesDir)) {
        return { categories, summary, duplicates, hasDuplicates: false };
    }

    const seenKeys: Record<string, Set<string>> = {}; // category → Set<key>

    function walk(dir: string, relativeBase: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath, relativeBase);
                continue;
            }
            const ext = path.extname(entry.name).toLowerCase();
            const category = EXT_TO_CATEGORY[ext];
            if (!category) continue;

            const key = path.basename(entry.name, ext);
            const relPath = path.relative(relativeBase, fullPath).replace(/\\/g, '/');
            const value = relPath.replace(/\.[^/.]+$/, '');

            if (!categories[category]) categories[category] = {};
            if (!seenKeys[category]) seenKeys[category] = new Set();

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
export function generateResourceMap(
    scanResult: ScanResult,
    options: GenerateOptions,
): Record<string, Record<string, string>> {
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
 * CI 一致性校验：解析统一的 resource-map.json，按 bundle 分目录检查磁盘文件是否存在。
 * 不同步时返回 false。
 */
export function verifyResourceMap(resourcesDir: string): boolean {
    const mapPath = path.resolve(resourcesDir, 'resource-map.json');

    if (!fs.existsSync(mapPath)) {
        console.error('[verify-resource-map] resource-map.json 不存在，请先执行"生成资源映射表"');
        return false;
    }

    let map: any;
    try {
        const raw = fs.readFileSync(mapPath, 'utf-8');
        map = JSON.parse(raw);
    } catch (e: any) {
        console.error(`[verify-resource-map] resource-map.json 解析失败: ${e.message}`);
        return false;
    }

    // resourcesDir = assets/resources/ → assetsDir = assets/
    const assetsDir = path.dirname(resourcesDir);
    let allOk = true;
    let checked = 0;

    for (const [bundleName, categories] of Object.entries(map)) {
        const bundleDir = path.join(assetsDir, bundleName);
        for (const [category, entries] of Object.entries(categories as Record<string, Record<string, string>>)) {
            for (const [key, relPath] of Object.entries(entries)) {
                checked++;
                // 检查对应文件（不带扩展名，尝试常见扩展名）
                const basePath = path.resolve(bundleDir, relPath);
                const exts = ['.prefab', '.png', '.jpg', '.mp3', '.wav', '.skel', '.json', '.atlas', ''];
                let found = false;
                for (const ext of exts) {
                    if (fs.existsSync(basePath + ext)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.error(
                        `[verify-resource-map] 缺失: [${bundleName}][${category}] key="${key}" → 路径 "${relPath}" 在磁盘上不存在`,
                    );
                    allOk = false;
                }
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
 * 构建脚本入口：自动发现所有 Cocos Creator bundle，合并为统一的 resource-map.json 写入 resources/。
 *
 * 输出格式: { [bundleName]: { [category]: { [key]: path } } }
 *
 * @param assetsDir - 可选，assets 目录绝对路径（默认从 PROJECT_ROOT 推导），用于测试注入
 */
export function generateResourceMapAll(assetsDir?: string): void {
    const assetsRoot = assetsDir ?? path.join(PROJECT_ROOT, 'assets');

    console.log('[resource-map-gen] 开始发现 bundle:', assetsRoot);

    if (!fs.existsSync(assetsRoot)) {
        console.warn(`[resource-map-gen] assets 目录不存在: ${assetsRoot}`);
        return;
    }

    // 1. 发现所有 bundle：扫描 *.meta，筛选 isBundle
    const bundleDirs: string[] = [];
    const metaEntries = fs.readdirSync(assetsRoot, { withFileTypes: true });
    for (const entry of metaEntries) {
        if (!entry.isFile() || !entry.name.endsWith('.meta')) continue;
        const metaPath = path.join(assetsRoot, entry.name);
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (meta?.userData?.isBundle === true) {
                const bundleDir = path.join(assetsRoot, path.basename(entry.name, '.meta'));
                if (fs.existsSync(bundleDir) && fs.statSync(bundleDir).isDirectory()) {
                    bundleDirs.push(bundleDir);
                }
            }
        } catch (e: any) {
            console.warn(`[resource-map-gen] 跳过无法解析的 .meta: ${entry.name} (${e.message})`);
        }
    }

    console.log(`[resource-map-gen] 发现 ${bundleDirs.length} 个 bundle:`,
        bundleDirs.map(d => path.basename(d)).join(', ') || '(无)');

    if (bundleDirs.length === 0) {
        console.warn('[resource-map-gen] 未发现任何 bundle，未生成 resource-map.json');
        return;
    }

    // 2. 扫描所有 bundle，合并到统一映射表
    const unifiedMap: Record<string, Record<string, Record<string, string>>> = {};
    let totalEntries = 0;
    let totalDuplicates = 0;

    for (const bundleDir of bundleDirs) {
        const bundleName = path.basename(bundleDir);

        console.log(`\n[resource-map-gen] 扫描 bundle: ${bundleName} (${bundleDir})`);

        const scanResult = scanResources(bundleDir);
        console.log('[resource-map-gen] 扫描完成，分类统计:');
        for (const [cat, count] of Object.entries(scanResult.summary)) {
            console.log(`  ${cat}: ${count} 个资源`);
        }
        totalEntries += Object.values(scanResult.summary).reduce((a, b) => a + b, 0);

        // 重复 key 告警（非阻断，跳过冲突条目继续生成）
        if (scanResult.hasDuplicates) {
            totalDuplicates += scanResult.duplicates.length;
            console.warn(
                `\n[resource-map-gen] ⚠️  检测到 ${scanResult.duplicates.length} 个重复 key（已跳过，保留首次遇到的文件）:\n`,
            );
            for (const d of scanResult.duplicates) {
                console.warn(`  [${d.category}] key="${d.key}"`);
                console.warn(`    保留: ${d.kept}`);
                console.warn(`    跳过: ${d.skipped}\n`);
            }
            console.warn('请重命名冲突的资源文件后重新生成以消除告警。\n');
        }

        unifiedMap[bundleName] = scanResult.categories;
    }

    // 3. 写入统一 JSON 到 resources bundle
    const outputPath = path.join(assetsRoot, 'resources', 'resource-map.json');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(unifiedMap, null, 2), 'utf-8');

    const bundleCount = Object.keys(unifiedMap).length;
    console.log(
        `\n[resource-map-gen] ✅ 统一 resource-map.json 已生成: ${outputPath}`,
    );
    console.log(
        `[resource-map-gen]    ${bundleCount} 个 bundle, ${totalEntries} 个资源条目`,
    );
    if (totalDuplicates > 0) {
        console.warn(
            `[resource-map-gen]    ⚠️  ${totalDuplicates} 个重复 key（已跳过）`,
        );
    }
    console.log('[resource-map-gen] 全部完成');
}

// CLI 入口：直接执行时运行校验
if (require.main === module) {
    const resourcesDir = path.resolve(PROJECT_ROOT, 'assets', 'resources');
    const ok = verifyResourceMap(resourcesDir);
    process.exit(ok ? 0 : 1);
}
