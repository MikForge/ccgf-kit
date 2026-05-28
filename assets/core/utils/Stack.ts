/**
 * 同步栈
 * @author Michael
 * @example
 * const stack = new Stack<number>();
 * stack.push(1);
 * stack.push(2);
 * H.log.info(stack.pop()); // 输出: 2
 * H.log.info(stack.size()); // 输出: 1
 * H.log.info(stack.isEmpty()); // 输出: false
 * stack.clear();
 * H.log.info(stack.isEmpty()); // 输出: true
 */
export class Stack<T> {

    /** 栈 */
    private _stack: T[] = [];

    /**
     * 入栈
     * @param item 
     */
    public push(item: T): void {
        this._stack.push(item);
    }

    /**
     * 出栈
     * @returns 
     */
    public pop(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this._stack.pop()!;
    }

    /**
     * 是否为空
     * @returns 
     */
    public isEmpty(): boolean {
        return this._stack.length === 0;
    }

    /**
     * 获取栈大小
     * @returns 
     */
    public size(): number {
        return this._stack.length;
    }

    /**
     * 清空栈
     */
    public clear(): void {
        this._stack = [];
    }
}