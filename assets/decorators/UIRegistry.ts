import { Component } from "cc";
import { IMediator } from 'db://ccgf-kit/libs/puremvc/index';
import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import type { UIConfigMap, UIViewConfig, IUILifecycle } from 'db://ccgf-kit/gui/IUiStructs';

/* ─────────------ 独立装饰器 ────── */

export function registerView(key: string, config: Omit<UIViewConfig, "viewCls" | "meditorCls">) {
    return function (viewCls: new (...args: any[]) => (Component & IUILifecycle)) {
        UIRegistry.getInstance().register(key, { ...config, viewCls: viewCls });
    };
}

export function registerMediator(key: string, config?: Omit<UIViewConfig, "viewCls" | "meditorCls">) {
    return function (meditorCls: new (name: string, viewComponent: any, param?: any) => IMediator) {
        UIRegistry.getInstance().register(key, { ...config, meditorCls: meditorCls } as UIViewConfig);
    };
}

/* ─────────------ 注册表类 ────── */

export class UIRegistry extends Singleton<UIRegistry> {

    // ═══════════════════════════════════════════
    // UI 注册区（实例方法）
    // ═══════════════════════════════════════════

    private configs: Map<string, UIViewConfig> = new Map();
    private locked: boolean = false;

    /**
     * 批量初始化配置（只执行一次）
     * 由 UIMgr.registerUIComponents() 调用
     */
    init(configMap: UIConfigMap): void {
        if (this.locked) {
            LogHelper.warn("UIRegistry UI 配置已初始化，忽略重复调用");
            return;
        }

        for (const key in configMap) {
            if (!configMap.hasOwnProperty(key)) continue;
            this.configs.set(key, configMap[key]);
        }

        this.locked = true;
    }

    /**
     * 注册单个 UI 配置（同 key 多次注册合并，已有字段不覆盖）
     * 由 registerView / registerMediator 装饰器内部调用
     */
    register(key: string, config: UIViewConfig): void {
        if (this.configs.has(key)) {
            // 合并：新字段补充，已有字段优先
            this.configs.set(key, { ...config, ...this.configs.get(key) });
        } else {
            this.configs.set(key, config);
        }
    }

    /** 按 viewId 获取 UI 配置 */
    getConfigByViewId(key: string): UIViewConfig | null {
        return this.configs.get(key) || null;
    }

    /** 检查 UI 配置是否存在 */
    hasConfigByViewId(key: string): boolean {
        return this.configs.has(key);
    }

    /** 清空所有注册数据（测试用） */
    clear(): void {
        this.configs.clear();
        this.locked = false;
    }
}
