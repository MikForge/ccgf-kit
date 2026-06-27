

export enum LayerType {
    /** 2d 游戏层 */
    UIGame = 0,

    /** 场景型UI */
    UIScene = 2,

    /** 弹窗型UI */
    PopUp = 3,

    /** 提示 层 飘字  */
    Notify = 4,
    /** 引导 层 */
    Guide = 5,
    /** 顶层  （断线重连 强制热更新） */
    Top = 6,
}

export enum UIType {

    UIGame = 'UIGame',

    Scene = 'Scene',

    PopUp = 'PopUp',
}

export enum BIND_COMPT_TYPE {
    /** 节点基础 UI 变换组件，对应 UITransform。 */
    TRANSFORM,
    /** 图片组件，对应 Sprite。 */
    IMAGE,
    /** 圆角图片组件，预留给自定义 RoundBox。 */
    ROUND_IMAGE,
    /** 普通文本组件，对应 Label。 */
    TEXT,
    /** 按钮组件，对应 Button。 */
    BUTTON,
    /** 单个开关组件，对应 Toggle。 */
    TOGGLE,
    /** 开关组组件，对应 ToggleContainer。 */
    TOGGLECONTAINER,
    /** 输入框组件，对应 EditBox。 */
    INPUT,
    /** 滚动视图组件，对应 ScrollView。 */
    SCROLL,
    /** 扩展滚动视图组件，预留给自定义 ScrollViewEx。 */
    SCROLL_EX,
    /** 滑动条组件，对应 Slider。 */
    SLIDER,
    /** 2D 粒子组件，对应 ParticleSystem2D。 */
    UIPARTICLE,
    /** 进度条组件，对应 ProgressBar。 */
    PROGRESSBAR,
    /** 富文本组件，对应 RichText。 */
    RICHTEXT,
    /** 视图状态组组件，预留给自定义 ViewStateGroup。 */
    VIEW_STATE_GROUP,
    /** 嵌套 UIContainer 组件，用于子 UI 容器绑定。 */
    UI_CONTAINER,
}
