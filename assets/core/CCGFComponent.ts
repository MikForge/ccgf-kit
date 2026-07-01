import { _decorator, Component, Node } from 'cc';

const { ccclass } = _decorator;

/**
 * 全局组件基类
 * - 所有项目组件的继承根
 * - 为后续 ECS 混合架构预留扩展入口
 */
@ccclass('CCGFComponent')
export class CCGFComponent extends Component {

    /** 摊平的子节点映射（递归所有子孙），用于 O(1) 按名查找 */
    protected _nodeMap: Map<string, Node> = new Map();

    protected onLoad(): void {
        this._nodeMap = new Map();
        this._buildNodeMap(this.node);
    }

    protected onDestroy(): void {
        this._nodeMap.clear();
    }

    /** 递归摊平所有子节点到 _nodeMap，重复名报警 */
    private _buildNodeMap(root: Node): void {
        for (const child of root.children) {
            if (child.name) {
                if (this._nodeMap.has(child.name)) {
                    H.log.debug(`[CCGFComponent] 重复节点名: ${child.name}`);
                    continue
                }
                this._nodeMap.set(child.name, child);
            }
            this._buildNodeMap(child);
        }
    }
}
