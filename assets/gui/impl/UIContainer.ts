import {
    _decorator,
    Button,
    Component,
    EditBox,
    Label,
    Node,
    ParticleSystem2D,
    ProgressBar,
    RichText,
    ScrollView,
    Slider,
    Sprite,
    Toggle,
    ToggleContainer,
    UITransform,
} from "cc";
import type { BindComptCfg } from "db://ccgf-kit/types/ui-structs";
import { BIND_COMPT_TYPE } from "db://ccgf-kit/types/ui-layer.enum";
import type { UIContainerComptItem } from 'db://ccgf-kit/gui';

const { ccclass, property } = _decorator;

@ccclass('UIContainerItem')
export class UIContainerItem {
    @property
    public key = '';

    @property({ type: Node })
    public node: Node | null = null;
}

@ccclass('UIContainer')
export class UIContainer extends Component {

    @property({ type: [UIContainerItem] })
    public items: UIContainerItem[] = [];

    public nodeDict: Record<string, Node> = Object.create(null);

    public comptDict: Record<string, Component> = Object.create(null);

    public comptList: UIContainerComptItem[] = [];

    public parse_compt(): void {
        this.nodeDict = Object.create(null);
        this.comptDict = Object.create(null);
        this.comptList = [];

        for (const item of this.items) {
            if (!item.key || !item.node) {
                continue;
            }

            this.nodeDict[item.key] = item.node;

            for (const typeKey of Object.keys(BIND_COMPT_TBL)) {
                const bindType = Number(typeKey) as BIND_COMPT_TYPE;
                const bindInfo = BIND_COMPT_TBL[bindType];

                if (!bindInfo) {
                    continue;
                }

                const compt = item.node.getComponent(bindInfo.type);

                if (!compt) {
                    continue;
                }

                const comptKey = `${item.key}_${bindInfo.str}`;
                this.comptDict[comptKey] = compt;
                this.comptList.push({
                    key: item.key,
                    comptKey,
                    type: bindType,
                    suffix: bindInfo.str,
                    node: item.node,
                    compt,
                });
            }
        }
    }
}

const BIND_COMPT_TBL: BindComptCfg = {
    [BIND_COMPT_TYPE.TRANSFORM]: { type: UITransform, str: "rect" },
    [BIND_COMPT_TYPE.IMAGE]: { type: Sprite, str: "img" },
    [BIND_COMPT_TYPE.TEXT]: { type: Label, str: "txt" },
    [BIND_COMPT_TYPE.BUTTON]: { type: Button, str: "btn" },
    [BIND_COMPT_TYPE.TOGGLE]: { type: Toggle, str: "tog" },
    [BIND_COMPT_TYPE.TOGGLECONTAINER]: { type: ToggleContainer, str: "toglist" },
    [BIND_COMPT_TYPE.INPUT]: { type: EditBox, str: "edit" },
    [BIND_COMPT_TYPE.SCROLL]: { type: ScrollView, str: "scroll" },
    [BIND_COMPT_TYPE.SLIDER]: { type: Slider, str: "sld" },
    [BIND_COMPT_TYPE.UIPARTICLE]: { type: ParticleSystem2D, str: "ptc" },
    [BIND_COMPT_TYPE.PROGRESSBAR]: { type: ProgressBar, str: "prg" },
    [BIND_COMPT_TYPE.RICHTEXT]: { type: RichText, str: "rich" },
    [BIND_COMPT_TYPE.UI_CONTAINER]: { type: UIContainer, str: "uicon" },
};
