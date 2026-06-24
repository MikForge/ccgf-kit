import * as fs from 'fs';
import * as path from 'path';

/**
 * CI 一致性校验：解析 resource-map.json 所有路径，逐个检查磁盘文件是否存在
 * 不同步时以非零退出码报错
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

    let allOk = true;
    let checked = 0;

    for (const [category, entries] of Object.entries(map)) {
        for (const [key, relPath] of Object.entries(entries as Record<string, string>)) {
            checked++;
            // 检查对应文件（不带扩展名，尝试 .prefab / .png 等常见扩展名）
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

// CLI 入口：作为脚本直接执行时运行校验
if (require.main === module) {
    const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const resourcesDir = path.resolve(projectRoot, 'assets', 'resources');
    const ok = verifyResourceMap(resourcesDir);
    process.exit(ok ? 0 : 1);
}
