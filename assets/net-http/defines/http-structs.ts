import { HttpMethod } from 'db://ccgf-kit/net-http/defines/http.enum';

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
