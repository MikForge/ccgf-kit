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
    /** 引用计数 */
    refCount: number,
    /** 资源编号 */
    resId?: number
}


/** 加载普通资源的参数 */
export interface IResArgs<T extends Asset> {
    /** 资源包名 */
    bundle?: string;
    /** 资源路径 */
    paths: Paths;
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

/** key-based 加载资源参数（key 替代 paths） */
export interface IResKeyArgs<T extends Asset> {
    /** 资源包名 */
    bundle?: string;
    /** 资源名称（resource-map.json 第二层 key，即文件名无扩展名） */
    key: string;
    /** 资源类型 */
    type: AssetType<T>;
    /** 资源加载进度 */
    onProgress?: ProgressCallback;
    /** 资源加载完成 */
    onComplete?: CompleteCallback;
}

/** key-based 加载目录资源参数（key 替代 dir） */
export interface IResDirKeyArgs<T extends Asset> {
    /** 资源包名 */
    bundle?: string;
    /** 目录名称（resource-map.json 第二层 key，指向目录路径） */
    key: string;
    /** 资源类型 */
    type: AssetType<T>;
    /** 资源加载进度 */
    onProgress?: ProgressCallback;
    /** 资源加载完成 */
    onComplete?: CompleteCallback;
}
