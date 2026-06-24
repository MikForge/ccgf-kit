import * as path from 'path';
import { scanResources } from './scanner';
import { generateResourceMap } from './generator';

/** 项目根目录（ccgf-kit extension src/ 的上一级是 ccgf-kit/, 上两级是项目根） */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

/**
 * 构建脚本入口：扫描 → 生成 JSON
 */
export function generateResourceMapAll(): void {
    const resourcesDir = path.resolve(PROJECT_ROOT, 'assets', 'resources');
    const outputPath = path.resolve(resourcesDir, 'resource-map.json');

    console.log('[resource-map-gen] 开始扫描资源目录:', resourcesDir);

    // 1. 扫描
    const scanResult = scanResources(resourcesDir);
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

    // 2. 生成 JSON
    const merged = generateResourceMap(scanResult, {
        resourcesDir,
        outputPath,
    });
    console.log(`[resource-map-gen] resource-map.json 已生成 (${Object.keys(merged).length} 个类型)`);

    console.log('[resource-map-gen] 完成');
}
