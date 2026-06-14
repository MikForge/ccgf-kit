import { Singleton } from "db://ccgf-kit/common";
import { UIViewConfig, UIConfigMap } from "db://ccgf-kit/gui/defines/ui-structs";

import { LogHelper } from 'db://ccgf-kit/helper';


/**
 * UI 配置注册器
 * 职责：管理所有 UI 配置的注册、查询、初始化
 */
export class UIConfigRegistry extends Singleton<UIConfigRegistry> {


    private configs: Map<string, UIViewConfig> = new Map();
    private locked: boolean = false;


    /** 批量初始化配置（只执行一次） */
    init(configMap: UIConfigMap): void {
        if (this.locked) {
            LogHelper.warn("UIConfigRegistry 已初始化，忽略重复调用");
            return;
        }

        for (const key in configMap) {
            if (!configMap.hasOwnProperty(key)) continue;
            this.configs.set(key, configMap[key]);
        }

        this.locked = true;
    }

    /** 注册单个配置（同 key 多次注册合并，已有字段不覆盖） */
    register(key: string, config: UIViewConfig): void {
        if (this.configs.has(key)) {
            // 合并：新字段补充，已有字段优先
            this.configs.set(key, { ...config, ...this.configs.get(key) });
        } else {
            this.configs.set(key, config);
        }
    }

    /** 获取配置 */
    getConfigByViewId(key: string): UIViewConfig | null {
        return this.configs.get(key) || null;
    }

    /** 检查是否存在 */
    hasConfigByViewId(key: string): boolean {
        return this.configs.has(key);
    }

    /** 清空（测试用） */
    clear(): void {
        this.configs.clear();
        this.locked = false;
    }
}