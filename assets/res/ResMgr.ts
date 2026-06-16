


import { __private, Asset, assetManager, AssetManager, Prefab, resources } from "cc";
import { Singleton } from "db://ccgf-kit/common/Singleton";
import { IResArgs, IResDirArgs } from "db://ccgf-kit/res/IResStructs";

import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';



/**
 * 资源管理器
 */
export class ResMgr extends Singleton<ResMgr> {


    /** 全局默认加载的资源包名 */
    defaultBundleName: string = "resources";

    private _prefabPendingSet: Set<string> = new Set();


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
     * 依赖 Cocos Bundle 原生 refCount 管理资源生命周期，不自定义计数
     * @param key    竞态防护标识
     * @param paths  prefab 路径
     * @param bundle 资源包名
     */
    async loadPrefab(key: string, paths: string, bundle: string): Promise<Prefab | null> {
        if (this._prefabPendingSet.has(key)) return null;

        this._prefabPendingSet.add(key);
        try {
            return await this.load({ paths, bundle, type: Prefab }) as Prefab;
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

}
