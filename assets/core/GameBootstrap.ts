import { _decorator, Component, Node, director, game, Game } from 'cc';
import { version } from 'db://ccgf-kit/core/GlobalApi';
const { property } = _decorator;

export abstract class GameBootstrap extends Component {

    /** 框架常驻节点 */
    private persist: Node = null!;

    /** 初始化状态 */
    private _isInitialized: boolean = false;

    /**
     * 获取框架常驻节点
     * 子类可以通过此方法获取节点，用于挂载管理器
     */
    protected getPersistNode(): Node {
        return this.persist;
    }

    /**
     * 获取初始化状态
     */
    public get isInitialized(): boolean {
        return this._isInitialized;
    }

    onLoad(): void {
        H.log.info(`Framework ${version}`);
        this.enabled = false;

        this.initFramework();
        this.startup();
    }

    onDestroy(): void {
        if (this.persist && this.persist.isValid) {
            director.removePersistRootNode(this.persist);
            this.persist.destroy();
        }
        this.unregisterEvents();
        this.onDestroyed();
    }

    // ==================== 框架层（私有，固定流程） ====================

    private registerEvents(): void {
        game.on(Game.EVENT_SHOW, this.handleShow, this);
        game.on(Game.EVENT_HIDE, this.handleHide, this);
    }

    private unregisterEvents(): void {
        game.off(Game.EVENT_SHOW, this.handleShow, this);
        game.off(Game.EVENT_HIDE, this.handleHide, this);
    }

    private handleShow(): void {
        director.resume();
        game.resume();
        this.onShow();
    }

    private handleHide(): void {
        director.pause();
        game.pause();
        this.onHide();
    }

    private initFramework(): void {
        this.persist = new Node("Framework_Persist_Node");
        director.addPersistRootNode(this.persist);
        // 3.8版本不需要挂载到朱姐点
        // this.persist.setParent(this.node);
        this.onFrameworkReady();
    }

    private async startup(): Promise<void> {
        try {
            this.initUISystem();
            await this.onBeforeStartupAsync();
            this.onBeforeStartup();
            this._isInitialized = true;
            this.registerEvents();
            this.enabled = true;
            this.onStartupComplete();
            H.log.info("游戏启动完成");
        } catch (error) {
            this._isInitialized = false;
            this.onStartupFailed(error);
            H.log.error("游戏启动失败:", error);
        }
    }

    protected update(dt: number): void {
        M.net.update(dt);
    }



    // ==================== 可选方法（空实现，子类可重写） ====================

    /** 初始化 UI 系统 */
    protected initUISystem(): void {

    }
    /**
     * 框架准备就绪时调用（persist 节点已创建）
     * 子类可在此初始化管理器、注册命令等
     */
    protected onFrameworkReady(): void { }

    /**
     * 启动前异步钩子（在 onBeforeStartup 之前执行）
     * 子类可在此进行异步预加载（config JSON、音频等）
     */
    protected async onBeforeStartupAsync(): Promise<void> { }

    /**
     * 启动前调用
     * 子类可在此进行最后的初始化工作
     */
    protected onBeforeStartup(): void { }

    /**
     * 启动完成时调用
      * 子类可在此进行启动完成后的处理，如打开主界面等  
     */
    protected onStartupComplete(): void { }

    /**
     * 启动失败时调用
     * 子类可在此处理错误、显示提示等
     */
    protected onStartupFailed(error: any): void { }

    /**
     * 游戏显示（从后台返回）
     * 子类可选实现
     */
    protected onShow(): void { }

    /**
     * 游戏隐藏（切到后台）
     * 子类可选实现
     */
    protected onHide(): void { }

    /**
     * 销毁时调用
     * 子类可选实现
     */
    protected onDestroyed(): void { }


    


}

