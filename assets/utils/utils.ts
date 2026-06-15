import { LogHelper } from 'db://ccgf-kit/helper';

export class utils {
    /**
     * 通用 Promise 包装工具
     * 将回调风格的 API 转换为 Promise 风格
     * @param fn 需要 Promise 化的函数
     * @param args 传递给函数的参数
     */
    static promisify<T = any>(
        fn: (...args: any[]) => void,
        ...args: any[]
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            fn(...args, (err: Error | null, data: T) => {
                if (err) {
                    LogHelper.error('[utils.promisify]', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    /**
     * 返回枚举的键（排除反向映射的数字键）
     */
    static enumKeys<E>(e: E): string[] {
        return Object.keys(e).filter(k => isNaN(Number(k)));
    }
    /**
     * 返回枚举的 [键, 值] 列表
     */
    static enumEntries<E>(e: E): [string, number | string][] {
        return utils.enumKeys(e).map(k => [k, (e as any)[k]]);
    }
    /**
     * 返回枚举的值列表（数字或字符串）
     */
    static enumValues<E>(e: E): (number | string)[] {
        return utils.enumEntries(e).map(([_, v]) => v);
    }
    /**
     * 获取url参数
     * @param url 
     */
    public static getUrlParam(url: string): { url: string, params: { [key: string]: string } } {
        let result = { url: "", params: {} as { [key: string]: string } };
        let urlArr = url.split('?');
        result.url = urlArr[0];
        if (urlArr.length > 1) {
            let paramsArr = urlArr[1].split("&");
            for (let i = 0; i < paramsArr.length; i++) {
                let item = paramsArr[i];
                let [key, value] = item.split("=");
                result.params[key] = value;
            }
        }
        return result;
    }
    /**
     * 给url添加参数
     * @param url 
     * @returns 新的url
     */
    public static addUrlParam(url: string, key: string, value: string): string {
        let urlData = this.getUrlParam(url);
        urlData.params[key] = value;
        let paramArr: string[] = [];
        for (let k in urlData.params) {
            if (urlData.params.hasOwnProperty(k)) {
                paramArr.push(`${encodeURIComponent(k)}=${encodeURIComponent(urlData.params[k])}`);
            }
        }
        return paramArr.length > 0 ? `${urlData.url}?${paramArr.join("&")}` : urlData.url;
    }
    
    /**
     * 拼接路径
     * @param paths 路径片段
     * @returns 拼接后的路径
     * @example joinPath("http://example.com", "api", "users", "123") => "http://example.com/api/users/123"
     */
    public static joinPath(...paths: (string | number)[]): string {
        return paths
            .map((part, index) => {
                let str = String(part);
                // 去除首尾的斜杠
                if (index > 0) str = str.replace(/^\/+/, '');
                if (index < paths.length - 1) str = str.replace(/\/+$/, '');
                return str;
            })
            .filter(part => part.length > 0)
            .join('/');
    }
}
