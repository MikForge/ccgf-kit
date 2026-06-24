import * as fs from 'fs';
import * as path from 'path';
import type { ScanResult } from './scanner';

export interface GenerateOptions {
    /** assets/resources/ 绝对路径 */
    resourcesDir: string;
    /** resource-map.json 输出绝对路径 */
    outputPath: string;
}

/**
 * 接收 scanner 结果，生成 resource-map.json
 */
export function generateResourceMap(
    scanResult: ScanResult,
    options: GenerateOptions
): Record<string, Record<string, string>> {
    const merged = scanResult.categories;

    // 写入输出
    const dir = path.dirname(options.outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(options.outputPath, JSON.stringify(merged, null, 2), 'utf-8');

    return merged;
}
