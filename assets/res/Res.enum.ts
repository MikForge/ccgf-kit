/** 加载资源类型 */
export enum LoadResType {
    /** 普通资源 */
    Load,
    /** 目录资源 */
    LoadDir
}

/** 资源分类 — 类型构造器名 → resource-map.json 顶层 category key */
export enum ResourceCategory {
    Prefab = "prefab",
    SpriteFrame = "texture",
    AudioClip = "audio",
    SkeletonData = "spine",
}
