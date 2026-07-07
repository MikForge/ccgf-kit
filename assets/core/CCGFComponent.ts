import { _decorator, Asset, Component, Node } from 'cc';
import { AssetType, IResArgs, IResDirArgs, LoadResRecord } from 'db://ccgf-kit/res/IResStructs';
import { LoadResType } from 'db://ccgf-kit/res/Res.enum';

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

    /** 资源使用记录：按加载类型分组，映射 key → 记录 */
    private _resPaths: Map<LoadResType, Map<string, LoadResRecord>> | null = null;

    protected onLoad(): void {
        this._nodeMap = new Map();
        this._buildNodeMap(this.node);
    }

    protected onDestroy(): void {
        // 自动释放本组件追踪的所有资源
        if (this._resPaths) {
            this._release();
            this._releaseDir();
            this._resPaths.clear();
            this._resPaths = null;
        }
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

    //#region 资源加载计数

    /** 生成资源记录键（bundle:key 复合键，防跨 bundle 同名冲突） */
    private _getResKey(bundle: string, key: string): string {
        return `${bundle}:${key}`;
    }

    /**
     * 添加资源使用记录
     * @param type      加载类型（Load / LoadDir）
     * @param bundle    资源包名
     * @param key       资源标识（Load 时为 pathkey，LoadDir 时为 dir）
     * @param assetType 资源类型构造器
     */
    private _addPathToRecord(type: LoadResType, bundle: string, key: string, assetType: AssetType): void {
        if (!this._resPaths) this._resPaths = new Map();

        let rps = this._resPaths.get(type);
        if (!rps) {
            rps = new Map();
            this._resPaths.set(type, rps);
        }

        const rk = this._getResKey(bundle, key);
        const record = rps.get(rk);
        if (record) {
            record.refCount++;
        } else {
            rps.set(rk, { bundle, path: key, type: assetType, refCount: 1 });
        }
    }

    /**
     * 加载资源（自动追踪引用计数，组件销毁时自动释放）
     * @param args 资源加载参数
     * @returns 加载完成的资源
     */
    async load<T extends Asset>(args: IResArgs<T>): Promise<T> {
        const bundle = args.bundle || M.res.defaultBundleName;
        this._addPathToRecord(LoadResType.Load, bundle, args.pathkey, args.type);
        return M.res.load(args);
    }

    /**
     * 加载目录资源（自动追踪引用计数，组件销毁时自动释放）
     * @param args 目录资源加载参数
     * @returns 加载完成的资源数组
     */
    async loadDir<T extends Asset>(args: IResDirArgs<T>): Promise<T[]> {
        const bundle = args.bundle || M.res.defaultBundleName;
        this._addPathToRecord(LoadResType.LoadDir, bundle, args.dir, args.type);
        return M.res.loadDir(args);
    }

    /** 释放组件追踪的 Load 类型资源（按 refCount 逐次 decRef） */
    private _release(): void {
        if (!this._resPaths) return;
        const rps = this._resPaths.get(LoadResType.Load);
        if (rps) {
            rps.forEach((record) => {
                for (let i = 0; i < record.refCount; i++) {
                    M.res.release({ bundle: record.bundle, pathkey: record.path, type: record.type });
                }
            });
            rps.clear();
        }
    }

    /** 释放组件追踪的 LoadDir 类型资源 */
    private _releaseDir(): void {
        if (!this._resPaths) return;
        const rps = this._resPaths.get(LoadResType.LoadDir);
        if (rps) {
            rps.forEach((record) => {
                for (let i = 0; i < record.refCount; i++) {
                    M.res.releaseDir({ bundle: record.bundle, dir: record.path, type: record.type });
                }
            });
            rps.clear();
        }
    }

    //#endregion 资源加载计数
}
