import type { BIND_COMPT_TYPE } from "db://ccgf-kit/gui/UILayer.enum";
import type { Node, Component } from "cc";

export interface UIContainerComptItem {
    key: string;
    comptKey: string;
    type: BIND_COMPT_TYPE;
    suffix: string;
    node: Node;
    compt: Component;
}
