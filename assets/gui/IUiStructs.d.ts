import type { Component, Constructor } from "cc";
import type { BIND_COMPT_TYPE, LayerType } from 'db://ccgf-kit/gui/UILayer.enum';
import type { BaseView } from 'db://ccgf-kit/gui/base/BaseView';
import type { IMediator } from 'db://ccgf-kit/libs/puremvc/index';

export type UIConfigMap = { [key: string]: UIViewConfig }

export type BindComptInfo = {
    type: Constructor<Component>;
    str: string;
}

export type BindComptCfg = Partial<Record<BIND_COMPT_TYPE, BindComptInfo>>

/** View 组件构造器 */
export type ViewClassCtor = Constructor<BaseView>;

/** Mediator 构造器 */
export type MediatorClassCtor = new (name: string, viewComponent: any, param?: any) => IMediator;

/**
 * UI 生命周期接口（工业级，对齐 Android Activity / React 模式）
 */
export interface IUILifecycle {
    /** 创建时调用一次，接收初始数据 */
    ui_on_init(data: any): void;
    /** 每次变为可见（首次 + 从隐藏池恢复） */
    ui_on_show(): void;
    /** 进入隐藏池（active=false，未销毁） */
    ui_on_hide(): void;
    /** 已显示状态下推送新数据 */
    ui_on_refresh(data: any): void;
    /** 永久移除前调用一次 */
    ui_on_destroy(): void;
}

export interface UIViewConfig {

    /** 窗口层级 */
    layer: LayerType;
    /** resource-map.json 中的 prefab key（对应 PrefabNames 枚举值） */
    prefabKey: string;
    /** 远程包名 */
    bundle?: string;
    /** 是否自动释放（默认自动释放） */
    destroy?: boolean;
    /** 是否触摸非窗口区域关闭 */
    vacancy?: boolean;
    /** 是否打开窗口后显示背景遮罩 */
    mask?: boolean;
    /** 是否启动真机安全区域显示 */
    safeArea?: boolean;
    /** 界面弹出时的节点排序索引 */
    siblingIndex?: number;
}

export interface UIOpenParams {
    /** 界面唯一标识 */
    viewId: string;
    /** 自定义传递参数 */
    data?: any;
    /** 是否开启预加载（默认不开启） */
    preload?: boolean;
}
