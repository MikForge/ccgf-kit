import { Singleton } from 'db://ccgf-kit/common/Singleton';
import type { UIConfigMap, UIViewConfig, ViewClassCtor, MediatorClassCtor } from 'db://ccgf-kit/gui/IUiStructs';

/* ─────────------ 独立装饰器 ────── */

export function registerView(key: string, config: Omit<UIViewConfig, "viewCls" | "meditorCls">) {
    return function (viewCls: ViewClassCtor) {
        UIRegistry.getInstance().registerViewClass(key, config as UIViewConfig, viewCls);
    };
}

export function registerMediator(key: string) {
    return function (meditorCls: MediatorClassCtor) {
        UIRegistry.getInstance().registerMediatorClass(key, meditorCls);
    };
}

/* ─────────------ 注册表类 ────── */

export class UIRegistry extends Singleton<UIRegistry> {

    // ═══════════════════════════════════════════
    // UI 注册区（实例方法）
    // ═══════════════════════════════════════════

    private viewConfigs: Map<string, UIViewConfig> = new Map();
    private viewClasses: Map<string, ViewClassCtor> = new Map();
    private mediatorClasses: Map<string, MediatorClassCtor> = new Map();
    private locked: boolean = false;

    /**
     * 批量初始化配置（只执行一次）
     * 由 UIMgr.registerUIComponents() 调用
     */
    init(configMap: UIConfigMap): void {
        if (this.locked) {
            H.log.warn("UIRegistry UI 配置已初始化，忽略重复调用");
            return;
        }

        for (const key in configMap) {
            if (!configMap.hasOwnProperty(key)) continue;
            this.viewConfigs.set(key, configMap[key]);
        }

        this.locked = true;
    }

    /**
     * 注册 View 类 — 写 viewConfigs + viewClasses，独立覆盖
     * 由 registerView 装饰器内部调用
     */
    registerViewClass(key: string, config: UIViewConfig, viewCtor: ViewClassCtor): void {
        this.viewConfigs.set(key, config);
        this.viewClasses.set(key, viewCtor);
    }

    /**
     * 注册 Mediator 类 — 写 mediatorClasses
     * 由 registerMediator 装饰器内部调用
     */
    registerMediatorClass(key: string, mediatorCtor: MediatorClassCtor): void {
        this.mediatorClasses.set(key, mediatorCtor);
    }

    /** 按 viewId 获取 UI 配置 */
    getConfigByViewId(key: string): UIViewConfig | null {
        return this.viewConfigs.get(key) || null;
    }

    /** 按 viewId 获取 View 构造器 */
    getViewClass(key: string): ViewClassCtor | null {
        return this.viewClasses.get(key) || null;
    }

    /** 按 viewId 获取 Mediator 构造器 */
    getMediatorClass(key: string): MediatorClassCtor | null {
        return this.mediatorClasses.get(key) || null;
    }

    /** 检查 UI 配置是否存在 */
    hasConfigByViewId(key: string): boolean {
        return this.viewConfigs.has(key);
    }

    /** 清空所有注册数据（测试用） */
    clear(): void {
        this.viewConfigs.clear();
        this.viewClasses.clear();
        this.mediatorClasses.clear();
        this.locked = false;
    }
}
