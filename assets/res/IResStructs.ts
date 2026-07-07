import { __private, Asset } from "cc";

export type AssetType<T = Asset> = __private.__types_globals__Constructor<T>;

// 补充类型声明
export type Paths = string | string[];
export type ProgressCallback = (finished: number, total: number, item: any) => void;
export type CompleteCallback = (err: Error | null, asset: any) => void;

/** 资源加载记录 */
export interface LoadResRecord {
    /** 资源包名 */
    bundle: string,
    /** 资源路径 */
    path: string,
    /** 资源类型 */
    type: AssetType,
    /** 引用计数 */
    refCount: number,
    /** 资源编号 */
    resId?: number
}


/** 加载普通资源的参数 */
export interface IResArgs<T extends Asset> {
    /** 资源包名 */
    bundle?: string;
    /** 资源标识（先查 _resourceMap，命中用映射路径；未命中用原始值作为路径） */
    pathkey: string;
    /** 资源类型 */
    type: AssetType<T>;
    /** 资源加载进度 */
    onProgress?: ProgressCallback;
    /** 资源加载完成 */
    onComplete?: CompleteCallback;
}

/** 加载目录资源的参数 */
export interface IResDirArgs<T extends Asset> {
    /** 资源包名 */
    bundle?: string;
    /** 资源文件夹路径 */
    dir: string;
    /** 资源类型 */
    type: AssetType<T>;
    /** 资源加载进度 */
    onProgress?: ProgressCallback;
    /** 资源加载完成 */
    onComplete?: CompleteCallback;
}
