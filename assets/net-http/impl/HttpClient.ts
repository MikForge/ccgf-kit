import { Singleton } from 'db://ccgf-kit/common/Singleton';
import { HttpEvent, HttpMethod, HttpReadyState, HttpServer, HttpStatus } from 'db://ccgf-kit/net-http/defines/http.enum';
import type { HttpRequestCfg, HttpCallback, RetryConfig, HttpRequestInterceptor, HttpResponseInterceptor } from 'db://ccgf-kit/net-http/defines/IHttpStructs';
import { HttpReturn } from 'db://ccgf-kit/net-http/defines/http-structs';

import { LogHelper } from 'db://ccgf-kit/helper/LogHelper';

/**
 * HTTP客户端
 * TODO:
    P0（必须）: 拦截器、重试、取消、日志
    P1（重要）: 缓存、去重、Token管理、文件上传
    P2（优化）: 并发控制、断网重连、Mock、签名加密
    P0 (必须): 增加 无serverType的请求接口，适用于临时请求或者第三方请求
 */
export class HttpClient extends Singleton<HttpClient> {

    /** 请求超时时间ms */
    private timeout: number = 5000;

    /** 多服务器地址映射 */
    private serverUrlMap: Map<string, string> = new Map();

    /** 自定义请求头信息 */
    private customHeaders: Map<string, string> = new Map();

    /** 活动请求列表 */
    private activeRequests: Map<string, XMLHttpRequest> = new Map();

    /** 请求拦截器列表 */
    private requestInterceptors: Array<HttpRequestInterceptor> = [];

    /** 响应拦截器列表 */
    private responseInterceptors: Array<HttpResponseInterceptor> = [];

    /** 
     * 重试配置
     */
    private retryConfig: RetryConfig = {
        maxRetries: 3,
        retryDelay: 1000,
        retryOnStatus: [500, 502, 503, 504],
        retryOnError: [HttpEvent.NO_NETWORK, HttpEvent.TIMEOUT]
    };

    /**
     * 注册请求拦截器
     * @param interceptor 
     * @returns 
     */
    public registerRequestInterceptor(interceptor: HttpRequestInterceptor): number {
        return this.requestInterceptors.push(interceptor) - 1;
    }

    /**
     * 注销请求拦截器
     * @param index
     */
    public unregisterRequestInterceptor(index: number): void {
        if (index >= 0 && index < this.requestInterceptors.length) {
            this.requestInterceptors.splice(index, 1);
        }
    }

    /** 
     * 注册响应拦截器
     * @param interceptor 
     * @returns 
     */
    public registerResponseInterceptor(interceptor: HttpResponseInterceptor): number {
        return this.responseInterceptors.push(interceptor) - 1;
    }

    /**
     * 注销响应拦截器
     * @param index 
     */
    public unregisterResponseInterceptor(index: number): void {
        if (index >= 0 && index < this.responseInterceptors.length) {
            this.responseInterceptors.splice(index, 1);
        }
    }

    /**
     * 执行请求拦截器
     * @param cfg 
     * @returns 修改后的请求配置，如果拦截器返回无效配置则返回null
     */
    private executeRequestInterceptors(cfg: HttpRequestCfg): HttpRequestCfg | null {
        let modifiedCfg = cfg;
        for (const interceptor of this.requestInterceptors) {
            if (interceptor.onRequest) {
                modifiedCfg = interceptor.onRequest(modifiedCfg);
                if (!modifiedCfg) {
                    LogHelper.error("请求拦截器返回了无效的请求配置，已中止请求");
                    return null;
                }
            }
        }
        return modifiedCfg;
    }


    /**
     * 执行响应拦截器
     * @param ret 
     * @returns 
     */
    private executeResponseInterceptors(ret: HttpReturn): HttpReturn {
        let modifiedRet = ret;
        for (const interceptor of this.responseInterceptors) {

            switch (ret.isSucc) {
                case true:
                    if (interceptor.onResponse) {
                        modifiedRet = interceptor.onResponse(modifiedRet);
                    }
                    break;
                case false:
                    if (interceptor.onError) {
                        modifiedRet = interceptor.onError(modifiedRet);
                    }
                    break;
            }
        }

        return modifiedRet;
    }

    /** 
     * 设置请求超时时间
     * @param timeout 超时时间（毫秒）
     */
    public setTimeout(timeout: number): void {
        this.timeout = timeout;
    }

    /**
     * 设置服务器地址
     * @param serverType 服务器类型
     * @param url 服务器地址
     */
    public setServerUrl(serverType: string, url: string): void {
        this.serverUrlMap.set(serverType, url);
    }

    /**
     * 获取服务器地址
     * @param serverType 服务器类型
     * @returns 服务器地址
     */
    public getServerUrl(serverType: string): string | undefined {
        return this.serverUrlMap.get(serverType);
    }

    /**
     * 添加自定义请求头
     * @param key 请求头键
     * @param value 请求头值
     */
    public addCustomHeader(key: string, value: string): void {
        this.customHeaders.set(key, value);
    }

    /**
     * HTTP GET 请求 回调版
     * @param serverType 
     * @param endpoint 
     * @param params 
     * @param onComplete 
     * @returns 
     * @example
     NetMgr.getInstance().http.get(HttpServer.ApiServer, "/getData", (response) => {
         if (response.isSucc) {
             LogHelper.info("数据:", response.data);
         } else {
              LogHelper.error("错误:", response.err);
         }
     }, { id: "12345" });
     */
    public get(serverType: string, endpoint: string, onComplete: HttpCallback, params?: Record<string, string>): void {
        const baseUrl = this.getServerUrl(serverType);
        if (!baseUrl) {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = `未找到服务器类型: ${serverType}`;
            onComplete && onComplete(ret);
            return;
        } else {
            let url = `${baseUrl}${endpoint}`;
            if (params) {
                const query = new URLSearchParams(params).toString();
                url += `?${query}`;
            }

            const headers: Record<string, string> = {};
            this.customHeaders.forEach((value, key) => {
                headers[key] = value;
            });
            const requestId = this.generateRequestId();

            this.xhrRequest({
                method: HttpMethod.GET,
                url,
                headers,
                onComplete: onComplete,
                requestId: requestId
            });
        }
    }

    /**
     * HTTP GET 请求 await 版
     * @param serverType 服务器类型
     * @param endpoint 接口路径
     * @param params 查询参数
     * @returns 响应数据的 Promise
     * @example
     var response = await NetMgr.getInstance().http.getAsync(HttpServer.ApiServer, "/getData", { id: "12345" });
     */
    public async getAsync(serverType: string, endpoint: string, params?: Record<string, string>): Promise<any> {
        return new Promise((resolve, reject) => {
            const baseUrl = this.getServerUrl(serverType);
            if (!baseUrl) {
                reject(`未找到服务器类型: ${serverType}`);
                return;
            }

            let url = `${baseUrl}${endpoint}`;
            if (params) {
                const query = new URLSearchParams(params).toString();
                url += `?${query}`;
            }

            const headers: Record<string, string> = {};
            this.customHeaders.forEach((value, key) => {
                headers[key] = value;
            });
            const requestId = this.generateRequestId();

            this.xhrRequest({
                method: HttpMethod.GET,
                url,
                headers,
                onComplete: (ret: HttpReturn) => {
                    resolve(ret);
                },
                requestId: requestId
            });
        });
    }

    /**
     * POST 请求 回调版
     * @param serverType 服务器类型 
     * @param endpoint  接口路径
     * @param body 请求体
     * @param onComplete 回调函数
     * @returns 
     * @example
     NetMgr.getInstance().http.post(HttpServer.ApiServer, "/postData", { name: "test", value: 42 }, (response) => {
         if (response.isSucc) {
             LogHelper.info("响应数据:", response.data);
         } else {
             LogHelper.error("错误:", response.err);
         }
     }
     */
    public post(serverType: string, endpoint: string, body: any, onComplete: HttpCallback): void {
        const baseUrl = this.getServerUrl(serverType);
        if (!baseUrl) {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = `未找到服务器类型: ${serverType}`;
            onComplete && onComplete(ret);
            return;
        }

        const url = `${baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        this.customHeaders.forEach((value, key) => {
            headers[key] = value;
        });

        const requestId = this.generateRequestId();
        this.xhrRequest({
            method: HttpMethod.POST,
            url,
            headers,
            body: JSON.stringify(body),
            onComplete: onComplete,
            requestId: requestId
        });
    }

    /**
     * HTTP POST 请求
     * @param serverType 服务器类型
     * @param endpoint 接口路径
     * @param body 请求体
     * @returns 响应数据的 Promise
     * @example
     var response = await M.http.postAsync("apiServer", "/postData", { name: "test", value: 42 });
     */
    public async postAsync(serverType: string, endpoint: string, body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const baseUrl = this.getServerUrl(serverType);
            if (!baseUrl) {
                reject(`未找到服务器类型: ${serverType}`);
                return;
            }

            const url = `${baseUrl}${endpoint}`;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            this.customHeaders.forEach((value, key) => {
                headers[key] = value;
            });

            const requestId = this.generateRequestId();

            this.xhrRequest({
                method: HttpMethod.POST,
                url,
                headers,
                body: JSON.stringify(body),
                onComplete: (ret: HttpReturn) => {
                    resolve(ret);
                },
                requestId: requestId
            });
        });
    }


    /**
     * 发送HTTP请求
     * @param cfg 请求配置
     */
    private xhrRequest(baseRequestCfg: HttpRequestCfg, retryCount: number = 0): void {

        //处理发送拦截器
        const modifiedCfg = this.executeRequestInterceptors(baseRequestCfg);

        if (!modifiedCfg) {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = "请求被拦截器中止";
            baseRequestCfg.onComplete(ret);
            return;
        }

        const xhr = new XMLHttpRequest();


        let completed = false;


        if (modifiedCfg.requestId) {
            this.activeRequests.set(modifiedCfg.requestId, xhr);
        }


        const handleComplete = (ret: HttpReturn) => {
            if (completed) return;
            completed = true;


            if (modifiedCfg.requestId) {
                this.activeRequests.delete(modifiedCfg.requestId);
            }

            const needRetry = this.checkShouldRetry(ret, retryCount)

            if (needRetry) {
                setTimeout(() => {
                    // 用原始 配置重试 拦截器 需要每次都执行
                    this.xhrRequest(baseRequestCfg, retryCount + 1);
                }, this.retryConfig.retryDelay);
            } else {
                //处理响应拦截器
                const finalRet = this.executeResponseInterceptors(ret);
                modifiedCfg.onComplete(finalRet);
            }

        };

        xhr.open(modifiedCfg.method, modifiedCfg.url, true);
        xhr.timeout = modifiedCfg.timeout || this.timeout;

        if (modifiedCfg.headers) {
            for (const key in modifiedCfg.headers) {
                xhr.setRequestHeader(key, modifiedCfg.headers[key]);
            }
        }

        xhr.ontimeout = () => {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = HttpEvent.TIMEOUT;
            handleComplete(ret);

        };

        xhr.onerror = () => {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = `HTTP ${xhr.status}: ${xhr.statusText}` + HttpEvent.UNKNOWN_ERROR;
            handleComplete(ret);
        };


        xhr.onabort = () => {
            const ret = new HttpReturn();
            ret.isSucc = false;
            ret.err = '请求已取消';
            handleComplete(ret);
        }

        xhr.onload = () => {
            const ret = new HttpReturn();

            if (xhr.status >= 200 && xhr.status < 300) {
                ret.isSucc = true;
                try {
                    ret.data = JSON.parse(xhr.responseText);
                } catch (e) {
                    ret.data = xhr.responseText;
                }
            } else {
                ret.isSucc = false;
                ret.err = `HTTP ${xhr.status}: ${xhr.statusText}`;
                ret.data = { status: xhr.status, statusText: xhr.statusText };
            }

            handleComplete(ret);
        };

        xhr.send(modifiedCfg.body || null);
    }

    /**
     * 生产请求ID
     */
    private generateRequestId(): string {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 取消所有请求
     */
    public cancelAllRequests(): void {

        this.activeRequests.forEach((xhr, requestId) => {
            xhr.abort();
        });

        this.activeRequests.clear();
    }

    /**
     * 取消单个请求
     * @param requestId 请求ID
     */
    public cancelRequest(requestId: string): void {
        const xhr = this.activeRequests.get(requestId);
        if (xhr) {
            xhr.abort();
            this.activeRequests.delete(requestId);
        }
    }

    private checkShouldRetry(ret: HttpReturn, retryCount: number): boolean {
        if (retryCount >= this.retryConfig.maxRetries) {
            return false;
        }

        if (ret.isSucc) {
            return false;
        }

        //检查错误类型
        if (ret.err && this.retryConfig.retryOnError && this.retryConfig.retryOnError.indexOf(ret.err) !== -1) {
            return true;
        }

        // 检查HTTP状态码
        if (ret.data?.status && this.retryConfig.retryOnStatus && this.retryConfig.retryOnStatus.indexOf(ret.data.status) !== -1) {
            return true;
        }

        return false;

    }
}   
