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

    /**
     * 查看栈顶元素，不移除
     */
    public peek(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this._stack[this._stack.length - 1];
    }

    /**
     * 按值移除（任意位置）
     * @param item
     * @returns 找到并移除返回 true，否则 false
     */
    public remove(item: T): boolean {
        const index = this._stack.indexOf(item);
        if (index === -1) return false;
        this._stack.splice(index, 1);
        return true;
    }

    /**
     * 检查项目是否在栈中
     */
    public contains(item: T): boolean {
        return this._stack.indexOf(item) !== -1;
    }

    /**
     * 从底到顶遍历栈
     * @param cb 回调（item, index）
     */
    public forEach(cb: (item: T, index: number) => void): void {
        for (let i = 0; i < this._stack.length; i++) {
            cb(this._stack[i], i);
        }
    }
}