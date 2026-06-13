import { Node } from "cc";
import { UIHelper } from "db://ccgf-kit/helper";

export class UIGameLayerNode extends Node {


    constructor(name: string) {
        super(name);
        UIHelper.setFullScreen(this);
    }

}