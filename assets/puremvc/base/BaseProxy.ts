import { js } from "cc";
import { IProxy, Proxy } from "db://ccgf-kit/libs/puremvc";

export class BaseProxy extends Proxy implements IProxy {
    
    proxyName: string;

    public constructor(name?: string, data?: any) {
        super(name, data);
        this.proxyName = js.getClassName(this);

    }


}