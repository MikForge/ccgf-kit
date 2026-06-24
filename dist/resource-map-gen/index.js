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
exports.generateResourceMapAll = generateResourceMapAll;
const path = __importStar(require("path"));
const scanner_1 = require("./scanner");
const generator_1 = require("./generator");
/** 项目根目录（ccgf-kit extension src/ 的上一级是 ccgf-kit/, 上两级是项目根） */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
/**
 * 构建脚本入口：扫描 → 生成 JSON
 */
function generateResourceMapAll() {
    const resourcesDir = path.resolve(PROJECT_ROOT, 'assets', 'resources');
    const outputPath = path.resolve(resourcesDir, 'resource-map.json');
    console.log('[resource-map-gen] 开始扫描资源目录:', resourcesDir);
    // 1. 扫描
    const scanResult = (0, scanner_1.scanResources)(resourcesDir);
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
    const merged = (0, generator_1.generateResourceMap)(scanResult, {
        resourcesDir,
        outputPath,
    });
    console.log(`[resource-map-gen] resource-map.json 已生成 (${Object.keys(merged).length} 个类型)`);
    console.log('[resource-map-gen] 完成');
}
