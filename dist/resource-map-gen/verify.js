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
exports.verifyResourceMap = verifyResourceMap;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * CI 一致性校验：解析 resource-map.json 所有路径，逐个检查磁盘文件是否存在
 * 不同步时以非零退出码报错
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
