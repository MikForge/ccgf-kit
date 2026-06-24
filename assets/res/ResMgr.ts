


import { __private, Asset, assetManager, AssetManager, JsonAsset, Prefab } from "cc";
import { Singleton } from "db://ccgf-kit/common/Singleton";
import { IResArgs, IResDirArgs, IResKeyArgs, IResDirKeyArgs, AssetType } from "db://ccgf-kit/res/IResStructs";
import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';
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
     * 加载 resource-map.json 并缓存到 _resourceMap
     * public — GameBootstrap 启动阶段显式调用预热，后续 *ByKey 调用直接查表
     */
    public async initResourceMap(bundle?: string): Promise<void> {
        const bundleName = bundle || this.defaultBundleName;
        if (this._resourceMap[bundleName]) return;

        let asset: JsonAsset = null

        try {
            asset = await this.load({ paths: "resource-map", type: JsonAsset, bundle: bundleName }) as JsonAsset;
        } catch (err: any) {
            LogHelper.error(`ResManager: resource-map.json 加载失败 - Bundle: ${bundleName}, Error: ${err.message}`);
            return;
        }
        this._resourceMap[bundleName] = asset.json as Record<string, Record<string, string>>;
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
     * key-based 加载资源（替代 load 的 paths 参数）
     */
    async loadByKey<T extends Asset>(args: IResKeyArgs<T>): Promise<T | null> {
        await this.initResourceMap(args.bundle);

        const path = this._resolvePath(args.type, args.key, args.bundle);
        if (!path) {
            LogHelper.warn(`ResManager: key "${args.key}" 未在 resource-map.json 中找到对应路径`);
            return null;
        }

        return this.load({
            paths: path,
            type: args.type,
            bundle: args.bundle,
            onProgress: args.onProgress,
            onComplete: args.onComplete,
        }) as Promise<T | null>;
    }

    /**
     * key-based 加载目录资源
     */
    async loadDirByKey<T extends Asset>(args: IResDirKeyArgs<T>): Promise<T[] | null> {
        await this.initResourceMap(args.bundle);

        const dir = this._resolvePath(args.type, args.key);
        if (!dir) return null;

        return this.loadDir({
            dir,
            type: args.type,
            bundle: args.bundle,
            onProgress: args.onProgress,
            onComplete: args.onComplete,
        });
    }

    /**
     * key-based 预加载资源（可用于启动阶段预热 resource-map.json）
     */
    async preloadByKey<T extends Asset>(args: IResKeyArgs<T>): Promise<void> {
        await this.initResourceMap(args.bundle);

        const path = this._resolvePath(args.type, args.key, args.bundle);
        if (!path) return;

        await this.preload({
            paths: path,
            type: args.type,
            bundle: args.bundle,
            onProgress: args.onProgress,
            onComplete: args.onComplete,
        });
    }

    /**
     * key-based 同步取出已缓存资源（与 getAsset 保持位置参数风格）
     */
    getAssetByKey<T extends Asset>(key: string, type: AssetType<T>, bundle?: string): T | null {
        const bundleName = bundle || this.defaultBundleName;
        if (!this._resourceMap[bundleName]) return null;

        const path = this._resolvePath(type, key, bundle);
        if (!path) return null;

        return this.getAsset(path, type as any, bundle);
    }

    /**
     * 加载资源
     * @param args IResArgs 参数
     */
    async load<T extends Asset>(args: IResArgs<T>): Promise<T | T[]> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<T | T[]>((resolve, reject) => {
            bundle.load(
                args.paths as any,
                args.type,
                args.onProgress ?? null,
                (err: Error | null, assets: any) => {
                    if (err) {
                        reject(err);
                        LogHelper.error(`ResManager: 资源加载失败 - Bundle: ${bundleName}, Paths: ${JSON.stringify(args.paths)}, Error: ${err.message}`);
                    } else {
                        resolve(assets);
                        args.onComplete?.(null, assets);
                    }
                }
            );
        });
    }

    /**
     * 预加载资源
     * @param args IResArgs 参数
     */
    async preload<T extends Asset>(args: IResArgs<T>): Promise<void> {
        const bundleName: string = args.bundle || this.defaultBundleName;
        const bundle: AssetManager.Bundle = await this.ensureBundle(bundleName);

        return new Promise<void>((resolve, reject) => {
            bundle.preload(
                args.paths as any,
                args.type,
                args.onProgress ?? null,
                (err: Error | null) => {
                    if (err) {
                        reject(err);
                        LogHelper.error(`ResManager: 资源预加载失败 - Bundle: ${bundleName}, Paths: ${JSON.stringify(args.paths)}, Error: ${err.message}`);
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
                        LogHelper.error(`ResManager: 目录资源加载失败 - Bundle: ${bundleName}, Dir: ${args.dir}, Error: ${err.message}`);
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
                        LogHelper.error(`ResManager: 目录资源预加载失败 - Bundle: ${bundleName}, Dir: ${args.dir}, Error: ${err.message}`);
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
                    LogHelper.error(`ResManager: 资源包加载失败 - Name: ${name}, Error: ${err.message}`);
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
     * @param path   资源路径（相对于 bundle 根目录）
     * @param type   资源类型构造函数
     * @param bundle 资源包名，默认 "resources"
     * @returns 资源实例，未找到返回 null
     */
    getAsset<T extends Asset>(path: string, type: new () => T, bundle?: string): T | null {
        const b = assetManager.getBundle(bundle || this.defaultBundleName);
        return b?.get(path, type) as T ?? null;
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
     * @param args 释放选项
     */
    release<T extends Asset>(args: IResArgs<T>) {
        const bundleName = args.bundle || this.defaultBundleName;
        const bundle = assetManager.getBundle(bundleName);
        const path = args.paths;

        if (bundle) {
            if (Array.isArray(path)) {
                path.forEach(p => {
                    const asset = bundle.get(p);
                    if (asset) asset.decRef();
                });
            } else {
                const asset = bundle.get(path);
                if (asset) asset.decRef();
            }
        }
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
     *   LogHelper.error("远程资源加载失败:", error);
     * }    
     */
    public async loadRemoteAsset<T extends Asset>(remoteUrl: string, type: new () => T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            assetManager.loadRemote(remoteUrl, { type }, (err: Error | null, asset: T) => {
                if (err) {
                    reject(err);
                    LogHelper.error(`ResManager: 远程资源加载失败 - URL: ${remoteUrl}, Error: ${err.message}`);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    /**
     * 加载 Prefab（带竞态防护）
     * 统一走 key 查表，不再接受裸路径
     * @param key    竞态防护标识（同时也是 resource-map.json 中的资源 key）
     * @param bundle 资源包名，默认 "resources"
     */
    async loadPrefab(key: string, bundle?: string): Promise<Prefab | null> {
        if (this._prefabPendingSet.has(key)) return null;

        this._prefabPendingSet.add(key);
        try {
            await this.initResourceMap(bundle);
            const mappedPath = this._resourceMap?.[bundle ?? this.defaultBundleName]?.["prefab"]?.[key];
            if (!mappedPath) {
                LogHelper.warn(`loadPrefab: key "${key}" 未在 resource-map.json 中找到对应路径`);
                return null;
            }
            return await this.load({
                paths: mappedPath,
                bundle: bundle ?? this.defaultBundleName,
                type: Prefab,
            }) as Prefab;
        } catch {
            return null;
        } finally {
            this._prefabPendingSet.delete(key);
        }
    }

    /**
     * 释放 Prefab，委托 Cocos 原生 decRef
     * @param paths  prefab 路径
     * @param bundle 资源包名
     */
    releasePrefab(paths: string, bundle: string): void {
        this.release({ paths, bundle, type: Prefab });
    }

    /**
     * key-based 释放 Prefab
     * 依赖已缓存的 _resourceMap 做同步查表，调用前需确保 resource-map 已加载
     * @param key    resource-map.json 中的 prefab key
     * @param bundle 资源包名
     */
    releasePrefabByKey(key: string, bundle?: string): void {
        const path = this._resourceMap?.[bundle ?? this.defaultBundleName]?.["prefab"]?.[key];
        if (!path) return;
        this.release({ paths: path, bundle: bundle ?? this.defaultBundleName, type: Prefab });
    }

}
