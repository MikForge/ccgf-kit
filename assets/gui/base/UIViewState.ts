import type { UIViewConfig, UIOpenParams } from 'db://ccgf-kit/gui/IUiStructs';

/**
 * UI 界面组件状态（纯数据结构）
 */
export class UIViewState {
    /** 界面唯一编号 */
    viewId: string = null!;
    /** 界面配置 */
    config: UIViewConfig = null!;
    /** 窗口事件 */
    params: UIOpenParams = null!;
    /** 是否在使用状态 */
    valid: boolean = true;


    /**
     * 初始化 UI 视图状态
     * @param uiid 界面唯一编号
     * @param config 界面配置
     * @param params 窗口事件参数
     */
    public init(
        viewId: string,
        config: UIViewConfig,
        params?: UIOpenParams
    ): this {
        this.viewId = viewId;
        this.config = config;
        this.params = params || null!;
        this.valid = true;
        return this;
    }

    /**
     * 重置状态
     */
    public reset(): void {
        this.viewId = null!;
        this.config = null!;
        this.params = null!;
        this.valid = false;
    }
}