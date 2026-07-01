import { NetSessionEvent } from 'db://ccgf-kit/net/defines/net.enum';

export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);


/** 网络连接参数 */
export interface NetConnectOptions {
    /** 地址 */
    host?: string,
    /** 端口 */
    port?: number,
    /** 完整wsurl 与地址+端口二选一 */
    url?: string,
    /**
     * 自动重连次数
     * 0表示不自动重连
     * -1 表示无限重连
     * >0 表示具体重连次数
     */
    autoReconnect?: number,

    /**
     * 数据类型
     * "arraybuffer" | "blob" 
     */
    binaryType?: BinaryType;
}



/**
 * 网络提示接口
 * 用于处理网络连接、重连、请求等提示
 * 结合UI层实现具体的提示效果
 */
export interface INetworkTips {
    /** 连接提示 */
    connectTips(isShow: boolean): void;
    /** 重连提示 */
    reconnectTips(isShow: boolean): void;
    /** 请求提示 */
    requestTips(isShow: boolean): void;
    /** 处理响应错误码 */
    responseErrorCode(code: number): void;
}


/** 请求对象 */
export interface RequestObject<T = any> {
    /** 请求的数据*/
    buffer: NetData,
    /** 响应命令 */
    rspCmd: string,
    /** 回调 */
    callback?: (response: T) => void;
}



/**
 * 网络状态配置
 */
export interface NetSateCfg {
    /** 进入状态时的回调 */
    onEnter?: () => void;
    /** 退出状态时的回调 */
    onExit?: () => void;
    /** 事件回调 */
    on: Partial<Record<NetSessionEvent, (...args: any[]) => void>>;
}
