/**
 * 队列溢出策略
 */
export enum overflowStrategy {
    /** 丢弃新元素 */
    DROP_NEW,
    /** 丢弃旧元素 */
    DROP_OLD,
    /** 阻塞等待 (慎用 可能会导致死锁) */
    BLOCK,
    /** 抛出异常 */
    THROW_ERROR
}
