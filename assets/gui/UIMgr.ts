import { Node, Camera, Constructor, instantiate } from "cc";
// import { LayerContainerType, LayerType, UIType } from "db://ccgf-kit/types/ui-layer.enum";
import type { UIConfigMap, UIViewConfig, UIOpenParams } from 'db://ccgf-kit/gui/IUiStructs';
import { UIGameLayerNode } from 'db://ccgf-kit/gui/impl/UIGameLayerNode';
import { UILayerNodeBase } from 'db://ccgf-kit/gui/base/UILayerNodeBase';
import { BaseView } from 'db://ccgf-kit/gui/base/BaseView';
import { UIComptBase } from 'db://ccgf-kit/gui/base/UIComptBase';
import { LayerType, LayerContainerType } from 'db://ccgf-kit/gui/UILayer.enum';
import { UIViewState } from 'db://ccgf-kit/gui/base/UIViewState';
import { utils } from 'db://ccgf-kit/utils/utils';
import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { UIRegistry } from "db://ccgf-kit/decorators/UIRegistry";

import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
import { UIHelper } from 'db://ccgf-kit/gui/UIHelper';
import { ResMgr } from 'db://ccgf-kit/res/ResMgr';



export class UIMgr extends Singleton<UIMgr> {
    /** UI 根节点 */
    uiRoot!: Node;
    /** UI 摄像机 */
    uiCamera!: Camera

    /** 界面层集合 - 无自定义类型 */
    private uiLayersMap: Map<string, UILayerNodeBase> = new Map<string, UILayerNodeBase>();

    private uiGameLayerNode!: UIGameLayerNode;

    constructor() {
        super();
    }

    /** 
     * 初始化 UI节点
     * @param uiRoot UI 根节点
     */
    initLayer(uiRoot: Node): void {

        this.uiRoot = uiRoot;

        this.uiCamera = this.uiRoot.getComponentInChildren(Camera)!;

        // 按枚举值升序排序后遍历
        const layerEntries = utils.enumEntries(LayerType).sort((a, b) => Number(a[1]) - Number(b[1]));

        for (const [layerName, layerTypeValue] of layerEntries) {
            const layerType = Number(layerTypeValue) as LayerType;

            let layerNode: Node;

            // 特殊处理 UIGame 层
            if (layerType === LayerType.UIGame) {
                const n = new UIGameLayerNode(layerName);
                this.uiGameLayerNode = n;
                layerNode = n;
            } else {
                // 从 layerMap 获取容器类型
                const containerType = UIHelper.layerMap[layerType];

                // 根据容器类型创建对应的层节点
                if (containerType) {
                    layerNode = new UILayerNodeBase(layerName, containerType);
                } else {
                    // 未配置则默认创建普通节点
                    layerNode = new Node(layerName);
                }
            }

            // 将创建的节点加入 uiRoot 并记录
            this.uiRoot.addChild(layerNode);
            if (layerNode instanceof UILayerNodeBase) {
                this.uiLayersMap.set(layerName, layerNode);
            }

            const containerTypeName = UIHelper.layerMap[layerType] || 'None';
            LogHelper.debug(`[UIMgr] Created layer: ${layerName} (LayerType: ${LayerType[layerType]}, Container: ${containerTypeName})`);
        }
    }


    /** 
     * 注册 UI 组件
     * @param configMap UI 组件配置映射表
     */
    public registerUIComponents(configMap: UIConfigMap): void {
        UIRegistry.getInstance().init(configMap);
    }


    public async open(viewId: string, params?: UIOpenParams): Promise<Node | null> {
        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);

        if (!uiConfig) {
            LogHelper.error(`UI 配置未找到: ${viewId}`);
            return null;
        }


        const layerName = LayerType[uiConfig.layer];

        let layerNode = this.uiLayersMap.get(layerName);

        if (!layerNode) {
            LogHelper.error(`UI 层未找到: ${layerName} for viewId: ${viewId}`);
            return null;
        }

        // 创建 UIViewState 实例
        let uiInfo = new UIViewState().init(viewId, uiConfig, params);

        let node = await layerNode.addView(uiInfo);

        if (!node) {
            LogHelper.error(`UI 打开失败: ${viewId} on layer: ${layerName}`);
            return Promise.reject(`UI 打开失败: ${viewId} on layer: ${layerName}`);
        }

        return node;

    }

    public close(viewId: string): void {
        
        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);

        if (!uiConfig) {
            LogHelper.error(`UI 配置未找到: ${viewId}`);
            return;
        }

        const layerName = LayerType[uiConfig.layer];
        let layerNode = this.uiLayersMap.get(layerName);
        if (!layerNode) {
            LogHelper.error(`UI 层未找到: ${layerName} for viewId: ${viewId}`);
            return;
        }

        layerNode.removeView(viewId);
    }

    /**
     * 向已显示的 UI 推送新数据，不关闭重开
     * @param viewId 界面唯一标识
     * @param data 新数据
     */
    public refresh(viewId: string, data: any): void {
        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);
        if (!uiConfig) {
            LogHelper.warn(`UI 配置未找到（refresh）: ${viewId}`);
            return;
        }
        const layerName = LayerType[uiConfig.layer];
        const layerNode = this.uiLayersMap.get(layerName);
        if (!layerNode) return;
        layerNode.refreshView(viewId, data);
    }

    public async loadView<T extends UIComptBase & BaseView>(
        key: string,
        paths: string,
        bundle: string,
        viewCtor: Constructor<T>,
        data?: any
    ): Promise<Node | null> {
        const prefab = await ResMgr.getInstance().loadPrefab(key, paths, bundle);
        if (!prefab) return null;

        if (!viewCtor) {
            LogHelper.error(`[UIMgr] loadView: viewCtor 为空，key: ${key}`);
            ResMgr.getInstance().releasePrefab(paths, bundle);
            return null;
        }

        const node = instantiate(prefab);
        let item = node.getComponent(viewCtor) as T | null;
        if (!item) item = node.addComponent(viewCtor);

        item.ui_on_preload();
        item.viewId = key;
        const ok = await item.ui_on_init(data);

        if (!ok) {
            node.destroy();
            ResMgr.getInstance().releasePrefab(paths, bundle);
            return null;
        }

        return node;
    }

    /**
     * 加载子组件节点（内置 instantiate + lifecycle）
     * @param key    竞态防护标识
     * @param paths  prefab 路径
     * @param bundle 资源包名
     * @param compCls 组件类
     * @param data   初始数据
     * @returns      节点实例，失败返回 null
     */
    public async loadSubComp<T extends UIComptBase>(
        key: string,
        paths: string,
        bundle: string,
        compCls: Constructor<T>,
        data?: any
    ): Promise<Node | null> {
        const prefab = await ResMgr.getInstance().loadPrefab(key, paths, bundle);
        if (!prefab) return null;

        if (!compCls) {
            LogHelper.error(`[UIMgr] loadSubComp: compCls 为空，key: ${key}`);
            ResMgr.getInstance().releasePrefab(paths, bundle);
            return null;
        }

        const node = instantiate(prefab);
        let item = node.getComponent(compCls) as T | null;
        if (!item) item = node.addComponent(compCls);

        item.ui_on_preload();
        const ok = await item.ui_on_init(data);

        if (!ok) {
            node.destroy();
            ResMgr.getInstance().releasePrefab(paths, bundle);
            return null;
        }

        return node;
    }

    /**
     * 释放子组件缓存
     * @param paths  prefab 路径
     * @param bundle 资源包名
     */
    public releaseSubNode(paths: string, bundle: string): void {
        ResMgr.getInstance().releasePrefab(paths, bundle);
    }
}
