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
exports.parseManifest = parseManifest;
exports.readManifest = readManifest;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * 将 JSON 字符串解析为 Manifest。
 *
 * @param json - 待解析的 JSON 字符串
 * @returns 解析后的 Manifest 对象
 * @throws 如果 JSON 格式错误或缺少必填字段
 */
function parseManifest(json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`模版清单解析失败：${msg}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('模版清单解析失败：根元素必须为对象');
    }
    const obj = parsed;
    if (!Array.isArray(obj.entries)) {
        throw new Error('模版清单解析失败：缺少 entries 数组');
    }
    const entries = [];
    for (let i = 0; i < obj.entries.length; i++) {
        const entry = obj.entries[i];
        if (typeof entry !== 'object' || entry === null) {
            throw new Error(`模版清单解析失败：entries[${i}] 必须为对象`);
        }
        const e = entry;
        if (typeof e.src !== 'string') {
            throw new Error(`模版清单解析失败：entries[${i}].src 必须为字符串`);
        }
        if (typeof e.dest !== 'string') {
            throw new Error(`模版清单解析失败：entries[${i}].dest 必须为字符串`);
        }
        entries.push({ src: e.src, dest: e.dest });
    }
    return { entries };
}
/**
 * 从文件系统读取模版清单文件。
 *
 * @param templatesDir - templates 目录的绝对路径
 * @returns 解析后的 Manifest 对象
 * @throws 如果文件不存在或解析失败
 */
function readManifest(templatesDir) {
    const manifestPath = path.join(templatesDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`模版清单 templates/manifest.json 不存在`);
    }
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return parseManifest(content);
}
