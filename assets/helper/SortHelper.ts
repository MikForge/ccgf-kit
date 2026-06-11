

type MapLike<T> = Record<string, T>;

export class SortHelper {
    /**
     * 多维排序
     * @param tbl 要排序的table
     * @param keys 要比较的表项中的多个key，
     * @param sortTypes 跟key对应的排序方式(升序: 0 还是降序: 1)
     * @传参格式：arg = [key1,key2,...],[0,1,...]
        不填写排序方式默认为升序
     */
    public static MixedSorter<T extends MapLike<any>>(tbl: Array<T>, keys: Array<keyof T>, sortTypes: Array<number>) {
        return tbl.sort(SortHelper.MixedSortFn.bind(tbl, keys, sortTypes));
    }

    /**
     * 多维排序工具函数
     * @param keys 要比较的表项中的多个key
     * @param sortTypes 跟key对应的排序方式(升序: 0, 还是降序: 1)
     * @param a 数组子项
     * @param b 数组子项
     */
    public static MixedSortFn<T extends MapLike<any>>(keys: Array<keyof T>, sortTypes: Array<number> = [], a: T, b: T) {
        for (let i = 0, length = keys.length; i < length; i++) {
            const argName = keys[i];
            const [pA, pB]: [number, number] = [a[argName], b[argName]];

            if (pA == pB) continue;

            return sortTypes[i] === 1 ? pB - pA : pA - pB;
        }

        return 0;
    }

    /**
     * 一维排序
     * @param arr 要排序的数组
     * @param key 排序的key
     * @param asc 是否降序，默认false
     */
    public static sorter<T extends MapLike<any>>(arr: Array<T>, key: keyof T, asc?: boolean) {
        return arr.sort(SortHelper.sortFn.bind(arr, key, asc));
    }

    /**
     * 简单排序工具函数
     * @param key 排序的key
     * @param asc 是否升序
     * @param a 数组子项
     * @param b 数组子项
     */
    public static sortFn<T extends MapLike<any>>(key: keyof T, asc: boolean, a: T, b: T) {
        return asc === true ? (<number>b[key]) - (<number>a[key]) : (<number>a[key]) - (<number>b[key]);
    }


    /**
     *  一维数组 根据key值：value排序
     * @param 
     */
    public static sortKeyValue<T extends MapLike<any>>(arr: Array<T>, key: keyof T, sortKeyValue: Array<number> = [], a: T, b: T) {
        return (<number>sortKeyValue.indexOf(a[key]) - <number>sortKeyValue.indexOf(b[key]))
    }

    public static sorterKeyValue<T extends MapLike<any>>(arr: Array<T>, key: keyof T, sortKeyValue: Array<number> = []) {
        sortKeyValue = sortKeyValue.reverse();
        return arr.sort((a, b) => {
            return <number>sortKeyValue.indexOf(a[key]) - <number>sortKeyValue.indexOf(b[key])
        });

    }


}