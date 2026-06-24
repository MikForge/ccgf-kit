import * as fs from 'fs';
import * as path from 'path';

/** 扩展名 → 资源类型分类 */
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
