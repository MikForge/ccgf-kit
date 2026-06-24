'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.load = load;
exports.unload = unload;
const scene_builder_1 = require("./scene-builder");
const index_1 = require("./resource-map-gen/index");
/**
 * 菜单处理：创建启动场景
 *
 * 流程：
 * 1. 自动生成场景文件名（默认 main.scene，冲突时递增）
 * 2. 生成场景 JSON → asset-db 写入
 * 3. 控制台输出操作指引
 *
 * 注意：Cocos Creator 3.x 没有 Editor.Dialog API，
 * 因此使用固定默认路径而非弹出保存对话框。
 */
async function createBootstrapScene() {
    try {
        // 1. 自动生成唯一文件名
        const filePath = await resolveScenePath('db://assets/main.scene');
        // 2. 提取场景名称
        const parts = filePath.replace(/\\/g, '/').split('/');
        const fileName = parts[parts.length - 1];
        const sceneName = fileName.replace(/\.scene$/, '');
        // 3. 生成场景 JSON
        const sceneJson = (0, scene_builder_1.buildSceneJson)(sceneName);
        // 4. 写入 asset-db
        await Editor.Message.request('asset-db', 'create-asset', filePath, sceneJson, {});
        // 5. 控制台输出操作指引
        console.log(`[ccgf-kit] 启动场景已创建：${filePath}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[ccgf-kit] 创建启动场景失败：${message}`);
    }
}
/**
 * 解析场景文件路径：基础路径冲突时自动递增编号。
 *
 * 例如 db://assets/main.scene 已存在时依次尝试
 * main-1.scene、main-2.scene ...
 *
 * @param basePath 基础路径（db:// 格式）
 * @returns 不冲突的路径
 */
async function resolveScenePath(basePath) {
    // 确保以 .scene 结尾
    let target = basePath;
    if (!target.endsWith('.scene')) {
        target = target + '.scene';
    }
    // 检查基础路径是否可用
    const exists = !!(await Editor.Message.request('asset-db', 'query-asset-info', target));
    if (!exists) {
        return target;
    }
    // 递增编号
    const base = target.replace(/\.scene$/, '');
    let index = 1;
    while (true) {
        const candidate = `${base}-${index}.scene`;
        const existsCandidate = !!(await Editor.Message.request('asset-db', 'query-asset-info', candidate));
        if (!existsCandidate) {
            return candidate;
        }
        index++;
    }
}
/* ======== 扩展生命周期 ======== */
function load() {
    console.log('[ccgf-kit] 扩展已激活');
}
function unload() {
    console.log('[ccgf-kit] 扩展已卸载');
}
/**
 * 菜单处理：生成资源映射表
 *
 * 流程：
 * 1. 扫描 assets/resources/ 目录
 * 2. 生成 resource-map.json + error 退出
 * 3. 生成按资源类型拆分的 const enum 文件
 * 4. 控制台输出统计摘要
 */
function generateResourceMap() {
    try {
        (0, index_1.generateResourceMapAll)();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[ccgf-kit] 生成资源映射表失败：${message}`);
    }
}
exports.methods = {
    createBootstrapScene,
    generateResourceMap,
};
