import { HttpMethod } from "./http-enum";

export type HttpCallback = (ret: HttpReturn) => void;

export interface HttpRequestCfg {
    /** 请求地址 */
    url: string;

    /** 请求方法 */
    method: HttpMethod;

    /** 请求完成回调 */
    onComplete: (ret: HttpReturn) => void;

    /** 唯一请求ID */
    requestId: string;

    /** 请求头 */
    headers?: Record<string, string>;

    /** 请求参数 */
    params?: Record<string, any>;

    /** 请求体 */
    body?: any;

    /** 超时时间（毫秒） */
    timeout?: number;

    /** 是否开启失败重试 */
    retry?: boolean;

}


/**
 * 重试配置
 */
export interface RetryConfig {
    /** 最大重试次数 */
    maxRetries: number;
    /** 重试延迟(ms) */
    retryDelay: number;
    /** 需要重试的HTTP状态码 */
    retryOnStatus?: number[];
    /** 需要重试的错误类型 */
    retryOnError?: string[];
}




/**
 * 拦截器
 * 
 * 责任链模式 - 请求处理链路
 * AOP - 横切关注点分离
 * 中间件模式 - 可组合的处理单元
 * 管道模式 - 流水线式处理
 * 开闭原则 - 易扩展不修改
 * 可以在请求发送前和响应返回后进行处理
 */

/**
 * 请求拦截接口
 */
export interface HttpRequestInterceptor {
    /**
     * 请求发送前拦截
     * @param cfg 
     */
    onRequest(cfg: HttpRequestCfg): HttpRequestCfg;
}

/**
 * 响应拦截接口
 */
export interface HttpResponseInterceptor {
    /**
     * 响应返回后拦截
     * @param ret 
     */
    onResponse(ret: HttpReturn): HttpReturn;

    /** 响应错误拦截
     * @param err 
     */
    onError(err: HttpReturn): HttpReturn;
}



/**
 * HTTP请求返回值
 */
export class HttpReturn {
    /** 是否请求成功 */
    isSucc: boolean;
    /** 请求返回数据 */
    data?: any;
    /** 请求错误数据 */
    err?: any;
}
