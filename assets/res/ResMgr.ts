


import { __private, Asset, assetManager, AssetManager, JsonAsset, Prefab } from "cc";
import { Singleton } from "db://ccgf-kit/common/Singleton";
import { IResArgs, IResDirArgs, AssetType } from "db://ccgf-kit/res/IResStructs";
import { ResourceCategory } from 'db://ccgf-kit/res/Res.enum';



/**
 * 资源管理器
 */
export class ResMgr extends Singleton<ResMgr> {


    /** 全局默认加载的资源包名 */
    defaultBundleName: string = "resources";

    private _prefabPendingSet: Set<string> = new Set();

    /** resource-map.json 映射表缓存：{ bundle名 → { 类型名 → { key → 路径 } } } */
    private _resourceMap: Record<string, Record<string, Record<string, string>>> = {};

    /**
     * 初始化资源管理器：从 resources bundle 加载统一的 resource-map.json。
     * 统一 JSON 格式: { [bundleName]: { [category]: { [key]: path } } }
     * @returns true 加载成功，false 加载失败
     */
    public async init(): Promise<boolean> {
        try {
            await this.initResourceMap();
            return true;
        } catch (err) {
            H.log.error(`ResMgr.init: ${(err as Error).message}`);
            return false;
        }
    }

    /**
     * 从 resources bundle 加载统一的 resource-map.json 并缓存全部 bundle 映射。
     * 直接调 bundle.load 加载原始文件，不经过 this.load（避免循环依赖）。
     */
    public async initResourceMap(): Promise<void> {
        const b = await this.ensureBundle(this.defaultBundleName);
        return new Promise<void>((resolve, reject) => {
            b.load("resource-map", JsonAsset, null, (err: Error | null, asset: JsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    // 统一格式: { bundleName: { category: { key: path } } }
                    this._resourceMap = asset.json as Record<string, Record<string, Record<string, string>>>;
                    resolve();
                }
            });
        });
    }

    /**
     * 从 _resourceMap 获取指定 bundle 的完整映射数据。
     * 纯数据查询，不感知业务类型。
     * @param bundleName bundle 名称
     * @returns { category → { key → path } } 或 null（bundle 不在缓存中）
     */
    public getResMapManifest(bundleName: string): Record<string, Record<string, string>> | null {
        return this._resourceMap[bundleName] ?? null;
    }

    /**
     * 从 type 推导 category 并在 _resourceMap 中查表，返回资源路径
     * @returns 资源路径；未命中返回 null
     */
    private _resolvePath<T extends Asset>(type: AssetType<T>, key: string, bundle?: string): string | null {
        const bundleName = bundle || this.defaultBundleName;
        if (!this._resourceMap[bundleName]) return null;
        const category = ResourceCategory[(type as any).name as keyof typeof ResourceCategory];
        if (!category) return null;
        return this._resourceMap[bundleName]?.[category]?.[key] ?? null;
    }

    /**
     * 加载资源
     * 内部通过 pathkey 查 _resourceMap 获取实际路径
     * @throws 若 pathkey 在 _resourceMap 中未命中则抛出错误
     */
    async load<T extends Asset>(args: IResArgs<T>): Promise<T> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const path = this._resolvePath(args.type, args.pathkey, bundleName);
        if (!path) {
            throw new Error(`ResMgr.load: pathkey "${args.pathkey}" not found in resource-map`);
        }

        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<T>((resolve, reject) => {
            bundle.load(
                path,
                args.type,
                args.onProgress ?? null,
                (err: Error | null, assets: any) => {
                    if (err) {
                        reject(err);
                        H.log.error(`ResManager: 资源加载失败 - Bundle: ${bundleName}, Path: ${path}, Error: ${err.message}`);
                    } else {
                        resolve(assets as T);
                        args.onComplete?.(null, assets);
                    }
                }
            );
        });
    }

    /**
     * 预加载资源
     * 内部通过 pathkey 查 _resourceMap 获取实际路径
     * @throws 若 pathkey 在 _resourceMap 中未命中则抛出错误
     */
    async preload<T extends Asset>(args: IResArgs<T>): Promise<void> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const path = this._resolvePath(args.type, args.pathkey, bundleName);
        if (!path) {
            throw new Error(`ResMgr.preload: pathkey "${args.pathkey}" not found in resource-map`);
        }

        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<void>((resolve, reject) => {
            bundle.preload(
                path,
                args.type,
                args.onProgress ?? null,
                (err: Error | null) => {
                    if (err) {
                        reject(err);
                        H.log.error(`ResManager: 资源预加载失败 - Bundle: ${bundleName}, Path: ${path}, Error: ${err.message}`);
                    } else {
                        resolve();
                        args.onComplete?.(null, null);
                    }
                }
            );
        });
    }

    /**
     * 加载目录资源
     * @param args IResDirArgs 参数
     */
    async loadDir<T extends Asset>(args: IResDirArgs<T>): Promise<T[]> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<T[]>((resolve, reject) => {
            bundle.loadDir(
                args.dir,
                args.type,
                args.onProgress ?? null,
                (err: Error | null, assets: T[]) => {
                    if (err) {
                        reject(err);
                        H.log.error(`ResManager: 目录资源加载失败 - Bundle: ${bundleName}, Dir: ${args.dir}, Error: ${err.message}`);
                    } else {
                        resolve(assets);
                        args.onComplete?.(null, assets);
                    }
                }
            );
        });
    }

    /**
     * 预加载目录资源
     * @param args IResDirArgs 参数
     */
    async preloadDir<T extends Asset>(args: IResDirArgs<T>): Promise<void> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<void>((resolve, reject) => {
            bundle.preloadDir(
                args.dir,
                args.type,
                args.onProgress ?? null,
                (err: Error | null) => {
                    if (err) {
                        reject(err);
                        H.log.error(`ResManager: 目录资源预加载失败 - Bundle: ${bundleName}, Dir: ${args.dir}, Error: ${err.message}`);
                    } else {
                        resolve();
                        args.onComplete?.(null, null);
                    }
                }
            );
        });
    }

    /**
     * 加载资源包
     * @param name 资源包名
     * @param options 资源参数,例:{ version: "74fbe" }
     */
    async loadBundle(name: string, options: Record<string, any> = {}): Promise<AssetManager.Bundle> {
        const bundlePromise: Promise<AssetManager.Bundle> = new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(name, options, (err: Error | null, bundle: AssetManager.Bundle) => {
                if (err) {
                    reject(err);
                    H.log.error(`ResManager: 资源包加载失败 - Name: ${name}, Error: ${err.message}`);
                } else {
                    resolve(bundle);
                }
            });
        });

        return bundlePromise;
    }

    /**
     * 获取资源包
     * @param name 资源包名
     */
    getBundle(name: string): AssetManager.Bundle | undefined {
        return assetManager.bundles.get(name);
    }

    /**
     * 从已加载的 bundle 缓存中同步取出资源
     * 内部通过 pathkey 查 _resourceMap 获取实际路径
     * @param pathkey 资源标识（resource-map.json 中的 key）
     * @param type    资源类型构造函数
     * @param bundle  资源包名，默认 "resources"
     * @returns 资源实例，未找到返回 null
     */
    getAsset<T extends Asset>(pathkey: string, type: AssetType<T>, bundle?: string): T | null {
        const b = assetManager.getBundle(bundle || this.defaultBundleName);
        if (!b) return null;

        const path = this._resolvePath(type, pathkey, bundle);
        if (!path) return null;

        return b.get(path, type as any) as T ?? null;
    }

    /**
     * 确保资源包已加载
     */
    private async ensureBundle(name: string): Promise<AssetManager.Bundle> {
        let bundle = assetManager.bundles.get(name);
        if (!bundle) {
            bundle = await this.loadBundle(name);
        }
        return bundle;
    }


    /**
     * 释放资源
     * 内部通过 pathkey 查 _resourceMap 获取实际路径
     * @throws 若 pathkey 在 _resourceMap 中未命中则抛出错误
     */
    release<T extends Asset>(args: IResArgs<T>) {
        const bundleName = args.bundle || this.defaultBundleName;
        const bundle = assetManager.getBundle(bundleName);
        if (!bundle) return;

        const path = this._resolvePath(args.type, args.pathkey, bundleName);
        if (!path) {
            throw new Error(`ResMgr.release: pathkey "${args.pathkey}" not found in resource-map`);
        }

        const asset = bundle.get(path);
        if (asset) asset.decRef();
    }

    /**
     * 释放目录资源
     * @param args 释放选项
     */
    releaseDir<T extends Asset>(args: IResDirArgs<T>) {
        const bundleName = args.bundle || this.defaultBundleName;
        const bundle = assetManager.getBundle(bundleName);

        if (bundle) {
            const infos = bundle.getDirWithPath(args.dir);
            infos.forEach(info => {
                const asset = bundle.get(info.path, args.type);
                if (asset) asset.decRef();
            });
        }
    }

    /**
     * 加载远程资源
     * @param remoteUrl 远程资源的 URL
     * @param type 资源类型
     * @returns 返回加载的资源
     * @throws 加载失败时抛出错误
     * @example
     * try {
     *   const remoteAsset = await resMgr.loadRemoteAsset("https://example.com/asset.png", SpriteFrame);
     *   // 使用 remoteAsset
     * } catch (error) {
     *   H.log.error("远程资源加载失败:", error);
     * }    
     */
    public async loadRemoteAsset<T extends Asset>(remoteUrl: string, type: new () => T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            assetManager.loadRemote(remoteUrl, { type }, (err: Error | null, asset: T) => {
                if (err) {
                    reject(err);
                    H.log.error(`ResManager: 远程资源加载失败 - URL: ${remoteUrl}, Error: ${err.message}`);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    /**
     * 加载 Prefab（带竞态防护）
     * 内部委托 this.load，仅做 pending-set 去重
     * @param args pathkey + type: Prefab + bundle?
     */
    async loadPrefab(args: IResArgs<Prefab>): Promise<Prefab | null> {
        if (this._prefabPendingSet.has(args.pathkey)) return null;

        this._prefabPendingSet.add(args.pathkey);
        try {
            return await this.load(args);
        } catch {
            return null;
        } finally {
            this._prefabPendingSet.delete(args.pathkey);
        }
    }


}
