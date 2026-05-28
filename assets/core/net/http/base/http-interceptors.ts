import { HttpRequestCfg, HttpRequestInterceptor, HttpResponseInterceptor, HttpReturn } from "../defines/http-structs";


/**
 * 日志拦截器
 */
export class HttpLogInterceptor implements HttpRequestInterceptor, HttpResponseInterceptor {

    onRequest(cfg: HttpRequestCfg): HttpRequestCfg {
        H.log.debug(`[HttpLogInterceptor] Request: ${cfg.method} ${cfg.url}`);
        H.log.debug("Request Config:" + JSON.stringify(cfg));
        return cfg;
    }

    onError(err: HttpReturn): HttpReturn {
        H.log.error(`[HttpLogInterceptor] Error from: ${err}`);
        return err;
    }

    onResponse(ret: HttpReturn): HttpReturn {
        H.log.debug(`[HttpLogInterceptor] Response from: ${ret}`);
        return ret;
    }
}

/**
 * token拦截器
 */
export class HttpTokenInterceptor implements HttpRequestInterceptor {

    private token: string = "";


    public setToken(token: string) {
        this.token = token;
    }

    onRequest(cfg: HttpRequestCfg): HttpRequestCfg {
        if (!cfg.headers) {
            cfg.headers = {};
        }
        cfg.headers["Authorization"] = `Bearer ${this.token}`;
        return cfg;
    }
}


/**
 * 错误处理拦截器
 */
export class ErrorHandlerInterceptor implements HttpResponseInterceptor {

    onResponse(ret: HttpReturn): HttpReturn {
        return ret;
    }

    onError(error: HttpReturn): HttpReturn {
        // 统一错误提示
        if (error.data?.status === 401) {
            H.log.warn('Token过期，请重新登录');
            // 跳转登录页面
        } else if (error.data?.status === 500) {
            H.log.error('服务器错误');
        }
        return error;
    }
}