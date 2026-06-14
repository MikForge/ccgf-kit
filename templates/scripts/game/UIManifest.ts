import { LayerType, UIViewConfig } from "db://ccgf-kit/gui";


/** 界面唯一标识（服务器/代码通过枚举触发打开界面） */
export enum ViewId {
    Loading = "loading",
    MainUI = "main_ui",
    Alert = "alert",
    Confirm = "confirm",
}

/** @deprecated 界面配置清单（key = ViewId） */
export const UI_MANIFEST: { [key: string]: UIViewConfig } = {};
