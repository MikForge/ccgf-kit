import { Node, Camera, Constructor, instantiate, Prefab } from "cc";
// import { LayerContainerType, LayerType, UIType } from "db://ccgf-kit/types/ui-layer.enum";
import type { UIConfigMap, UIViewConfig, UIOpenParams } from 'db://ccgf-kit/gui/IUiStructs';
import { UIGameLayerNode } from 'db://ccgf-kit/gui/impl/UIGameLayerNode';
import { UILayerNodeBase } from 'db://ccgf-kit/gui/base/UILayerNodeBase';
import { LayerType } from 'db://ccgf-kit/gui/UILayer.enum';
import { UIViewState } from 'db://ccgf-kit/gui/base/UIViewState';
import { utils } from 'db://ccgf-kit/utils/utils';
import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { UIRegistry } from "db://ccgf-kit/decorators/UIRegistry";



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
                layerNode = new UILayerNodeBase(layerName);
            }

            // 将创建的节点加入 uiRoot 并记录
            this.uiRoot.addChild(layerNode);
            if (layerNode instanceof UILayerNodeBase) {
                this.uiLayersMap.set(layerName, layerNode);
            }
        }
    }



    public async open(viewId: string, params?: UIOpenParams): Promise<Node | null> {
        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);

        if (!uiConfig) {
            H.log.error(`UI 配置未找到: ${viewId}`);
            return null;
        }


        const layerName = LayerType[uiConfig.layer];

        let layerNode = this.uiLayersMap.get(layerName);

        if (!layerNode) {
            H.log.error(`UI 层未找到: ${layerName} for viewId: ${viewId}`);
            return null;
        }

        // 创建 UIViewState 实例
        let uiInfo = new UIViewState().init(viewId, uiConfig, params);

        let node = await layerNode.addView(uiInfo);

        if (!node) {
            H.log.error(`UI 打开失败: ${viewId} on layer: ${layerName}`);
            return Promise.reject(`UI 打开失败: ${viewId} on layer: ${layerName}`);
        }

        return node;

    }

    public close(viewId: string): void {
        
        const uiConfig: UIViewConfig | null = UIRegistry.getInstance().getConfigByViewId(viewId);

        if (!uiConfig) {
            H.log.error(`UI 配置未找到: ${viewId}`);
            return;
        }

        const layerName = LayerType[uiConfig.layer];
        let layerNode = this.uiLayersMap.get(layerName);
        if (!layerNode) {
            H.log.error(`UI 层未找到: ${layerName} for viewId: ${viewId}`);
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
            H.log.warn(`UI 配置未找到（refresh）: ${viewId}`);
            return;
        }
        const layerName = LayerType[uiConfig.layer];
        const layerNode = this.uiLayersMap.get(layerName);
        if (!layerNode) return;
        layerNode.refreshView(viewId, data);
    }

  

}
