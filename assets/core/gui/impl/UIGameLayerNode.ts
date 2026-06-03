import { Node } from "cc";
import { UIHelper } from "db://ccgf-kit/core/helper";

export class UIGameLayerNode extends Node {


    constructor(name: string) {
        super(name);
        UIHelper.setFullScreen(this);
    }

}