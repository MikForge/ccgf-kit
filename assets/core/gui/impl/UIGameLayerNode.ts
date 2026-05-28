import { Node } from "cc";
import { UIHelper } from "db://assets/core/helper";

export class UIGameLayerNode extends Node {


    constructor(name: string) {
        super(name);
        UIHelper.setFullScreen(this);
    }

}