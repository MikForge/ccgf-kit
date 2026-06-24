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
exports.writeEnumFiles = writeEnumFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const HEADER = '// CLI 自动生成，勿手动编辑\n// source: assets/resources/resource-map.json\n\n';
/**
 * 将资源 key 转为合法 TypeScript 标识符
 * 替换非法字符为 _，数字开头加前缀 _
 */
function sanitizeIdentifier(key) {
    let id = key.replace(/[^a-zA-Z0-9_$]/g, '_');
    if (/^[0-9]/.test(id))
        id = '_' + id;
    return id;
}
/**
 * 生成单个 enum 文件内容
 */
function formatEnum(typename, keys) {
    const enumName = `${typename.charAt(0).toUpperCase() + typename.slice(1)}Names`;
    const sorted = [...keys].sort();
    const members = sorted.map(k => `    ${sanitizeIdentifier(k)} = "${k}",`).join('\n');
    return `${HEADER}export const enum ${enumName} {\n${members}\n}\n`;
}
/**
 * 按 resource-map.json 第一层类型生成 const enum 文件
 */
function writeEnumFiles(options) {
    // 路径守卫：仅允许写入 enums/resource-keys/ 子目录
    const normalized = options.outputDir.replace(/\\/g, '/');
    if (!normalized.endsWith('enums/resource-keys') && !normalized.endsWith('enums/resource-keys/')) {
        throw new Error(`enum-writer 仅允许写入 enums/resource-keys/ 目录，拒绝写入: ${options.outputDir}`);
    }
    const written = [];
    if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir, { recursive: true });
    }
    for (const [typename, entries] of Object.entries(options.mergedMap)) {
        // 跳过以下划线开头的元数据 key（如 _comment、_example）
        if (typename.startsWith('_'))
            continue;
        const keys = Object.keys(entries);
        if (keys.length === 0)
            continue;
        const enumName = `${typename.charAt(0).toUpperCase() + typename.slice(1)}Names`;
        const fileName = `${enumName}.enum.ts`;
        const filePath = path.join(options.outputDir, fileName);
        const content = formatEnum(typename, keys);
        fs.writeFileSync(filePath, content, 'utf-8');
        written.push(filePath);
    }
    return written;
}
