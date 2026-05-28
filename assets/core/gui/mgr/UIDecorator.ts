

/**
 * UI 组件装饰器
 * 用于标记 UI 组件类并注册配置
 * 
 */
import { Component } from "cc";
import { IUILifecycle, UIViewConfig, UIViewParam } from "../defines/ui-structs";
import { UIConfigRegistry } from "./UIConfigRegistry";
import { IMediator } from "db://assets/core/libs/puremvc";


/** View 元数据标记键 */
export const UI_VIEW_KEY = "UI_VIEW_KEY";

/** Mediator 元数据标记键 */
export const UI_MEDITOR_KEY = "UI_MEDITOR_KEY";

/**
 * View 装饰器
 * 自动将 viewCls 填入 config
 * @param key    UI 唯一标识
 * @param config UI 配置（layer、prefab 等）
 */
export function registerView(key: string, config: Omit<UIViewConfig, "viewCls" | "meditorCls">) {
    return function (viewCls: new (...args: any[]) => (Component & IUILifecycle)) {
        viewCls[UI_VIEW_KEY] = key;
        UIConfigRegistry.getInstance().register(key, { ...config, viewCls: viewCls });
    };
}

/**
 * Mediator 装饰器
 * 自动将 meditorCls 填入 config
 * @param key    UI 唯一标识
 * @param config UI 配置（可选；无 View 时 Mediator 可承载配置）
 */
export function registerMediator(key: string, config?: Omit<UIViewConfig, "viewCls" | "meditorCls">) {
    return function (meditorCls: new (name: string, viewComponent: any, param?: UIViewParam) => IMediator) {
        meditorCls[UI_MEDITOR_KEY] = key;
        UIConfigRegistry.getInstance().register(key, { ...config, meditorCls: meditorCls } as UIViewConfig);
    };
}

/** 获取 View 类上注册的 UI key */
export function getUIViewKey(viewCls: any): string | undefined {
    return viewCls[UI_VIEW_KEY];
}

/** 获取 Mediator 类上注册的 UI key */
export function getUIMeditorKey(meditorCls: any): string | undefined {
    return meditorCls[UI_MEDITOR_KEY];
}