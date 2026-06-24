import { HttpMethod } from 'db://ccgf-kit/net-http/defines/http.enum';
import { HttpReturn } from 'db://ccgf-kit/net-http/defines/http-structs';

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
