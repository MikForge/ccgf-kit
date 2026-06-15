import { Node } from 'cc';

/**
 * 事件监听信息
 */
export interface IMediatorInterface {
    target: Node;
    eventType: string;
    callback: Function;
    thisArg?: any;
}
