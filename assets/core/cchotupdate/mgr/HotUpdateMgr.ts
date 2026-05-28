
import { Asset, game, native, sys } from "cc";

import { CoreEvents } from 'db://assets/core/event';
import { HttpServer } from "db://assets/core/net/http";
import { HotUpdateState } from "../defines/hotupdate.enum";


export class HotUpdateMgr {

    private static _instance: HotUpdateMgr = null!;

    public isInit: boolean = false;

    /** 当前热更新状态 */
    private state: HotUpdateState = HotUpdateState.IDLE;

    /** 原生平台 热更新管理器 */
    private _nativeAssetManager: native.AssetsManager = null!;

    /** cdn地址 运营后台提供 */
    private _remoteUrl: string = null!;

    /** 远程版本号 运营后台提供 */
    private _remoteVersion: string = null!;

    /** 包内 版本号 */
    private _localVersion: string = null!;

    /** 包内 manifest 地址 */
    private _localManifestUrl: string = null!;

    /** 存储路径，通常是 writablePath */
    private _storagePath: string = null!;

    private progressCallback: ((progress: number, message: string) => void) | null = null;

    private emitCallback: ((eventCode: number, message: string) => void) | null = null;

    public static getInstance(): HotUpdateMgr {
        if (!HotUpdateMgr._instance) {
            HotUpdateMgr._instance = new HotUpdateMgr();
        }

        return HotUpdateMgr._instance;
    }



    public async init(): Promise<boolean> {

        if (!sys.isNative) {
            H.log.warn("HotUpdateMgr: 当前平台不支持热更新");
            return false;
        }

        if (this.isInit) {
            H.log.warn("HotUpdateMgr: 已经初始化过了");
            return false;
        }

        const isInitRemote = await this.initRemoteInfo();

        if (!isInitRemote) {
            H.log.error("HotUpdateMgr: 初始化远程信息失败");
            return false;
        }

        let writablePath = native?.fileUtils?.getWritablePath() || "";
        if (!writablePath.endsWith("/")) {
            writablePath += "/";
        }

        this._storagePath = H.ut.joinPath(native.fileUtils.getWritablePath(), "remote-assets")

        if (!this._storagePath.endsWith("/")) {
            this._storagePath += "/";
        }

        const _asset = await M.res.load({
            paths: "project",
            type: Asset,
        }) as Asset;

        if (_asset) {
            this._localManifestUrl = _asset.nativeUrl;
            H.log.info("本地 manifest 路径: " + this._localManifestUrl);
        } else {
            H.log.error("HotUpdateMgr: 加载本地 manifest 失败");
            return false;
        }


        this.initAM();

        // 初始化成功
        this.isInit = true;
        H.log.info("HotUpdateMgr 初始化完成！");

        return true;
    }

    public setProgressCallback(callback: (progress: number, message: string) => void) {
        this.progressCallback = callback;
    }

    public setEmitCallback(callback: (eventCode: number, message: string) => void) {
        this.emitCallback = callback;
    }


    /**
     * 重载函数，更新本地 manifest 中的远程服务器地址为最新的地址
     * @returns 
     */
    private refreshLocalManifest() {

        if (!this._nativeAssetManager) {
            H.log.error("HotUpdateMgr: AssetsManager 实例不存在，无法刷新 manifest");
            return;
        }

        // 验证远程 URL 格式
        if (!this._remoteUrl || (!this._remoteUrl.startsWith('http://') && !this._remoteUrl.startsWith('https://'))) {
            H.log.error("HotUpdateMgr: 远程 URL 格式错误: " + this._remoteUrl);
            H.log.error("URL 必须以 http:// 或 https:// 开头");
            return;
        }

        let _packageUrl = H.ut.joinPath(this._remoteUrl, this._remoteVersion);
        let _remoteManifestUrl = H.ut.joinPath(this._remoteUrl, this._remoteVersion, "project.manifest");
        let _remoteVersionUrl = H.ut.joinPath(this._remoteUrl, this._remoteVersion, "version.manifest");

        H.log.info("====== 准备更新 manifest URL ======");
        H.log.info("远程根地址: " + this._remoteUrl);
        H.log.info("远程版本号: " + this._remoteVersion);
        H.log.info("Package URL: " + _packageUrl);
        H.log.info("Manifest URL: " + _remoteManifestUrl);
        H.log.info("Version URL: " + _remoteVersionUrl);
        H.log.info("本地存储路径: " + this._storagePath);
        H.log.info("===============================");


        let writablePath = this._storagePath;
        // 本地内容
        let content = "";
        let cacheManifestPath = writablePath + "project.manifest";
        if (native.fileUtils.isFileExist(cacheManifestPath)) {
            content = native.fileUtils.getStringFromFile(cacheManifestPath);
            H.log.info("使用缓存的 manifest: " + cacheManifestPath);
        } else {
            let manifestUrl = this._localManifestUrl;
            content = native.fileUtils.getStringFromFile(manifestUrl);
            H.log.info("使用包内 manifest: " + manifestUrl);
        }

        if (!content) {
            H.log.error("HotUpdateMgr: 读取本地 manifest 内容失败");
            return;
        }

        const manifestObj = JSON.parse(content);

        H.log.info("原始 manifest packageUrl: " + (manifestObj.packageUrl || "未设置"));
        H.log.info("原始 manifest version: " + (manifestObj.version || "未设置"));

        // 修改 URL
        manifestObj.packageUrl = _packageUrl;
        manifestObj.remoteManifestUrl = _remoteManifestUrl;
        manifestObj.remoteVersionUrl = _remoteVersionUrl;

        // 注册本地manifest根目录
        let manifestRoot = "";
        let manifestUrl = this._localManifestUrl;
        let found = manifestUrl.lastIndexOf("/");
        if (found === -1) {
            found = manifestUrl.lastIndexOf("\\");
        }
        if (found !== -1) {
            manifestRoot = manifestUrl.substring(0, found + 1);
        }

        H.log.info("Manifest 根目录: " + manifestRoot);

        this._nativeAssetManager.getLocalManifest().parseJSONString(JSON.stringify(manifestObj), manifestRoot);

        H.log.info("====== 更新后的 manifest 信息 ======");
        H.log.info("PackageUrl: " + this._nativeAssetManager.getLocalManifest().getPackageUrl());
        H.log.info("Version: " + this._nativeAssetManager.getLocalManifest().getVersion());
        H.log.info("VersionFileUrl: " + this._nativeAssetManager.getLocalManifest().getVersionFileUrl());
        H.log.info("ManifestFileUrl: " + this._nativeAssetManager.getLocalManifest().getManifestFileUrl());
        H.log.info("===============================");

        H.log.info("本地 manifest 已更新为远程服务器地址");

    }

    /**
     * 从远程服务器获取最新的版本信息和下载地址
     */
    public async initRemoteInfo(): Promise<boolean> {

        H.log.info("开始获取远程服务器版本信息...");

        const response = await M.net.http.getAsync(
            HttpServer.Platform,
            "/versions/latest"
        );

        if (!response.isSucc) {
            H.log.error('HotUpdateMgr: 获取远程服务器地址失败', response.err);
            return false;
        }

        const data = response.data;

        H.log.info("收到远程版本信息: " + JSON.stringify(data));

        if (!data || !data.download_url) {
            H.log.error('HotUpdateMgr: 远程服务器地址数据异常', data);
            return false;
        }

        this._remoteUrl = data.download_url;
        this._remoteVersion = data.id;

        H.log.info("====== 远程服务器信息 ======");
        H.log.info("下载地址: " + this._remoteUrl);
        H.log.info("版本 ID: " + this._remoteVersion);
        H.log.info("=======================");

        // URL 格式验证
        if (!this._remoteUrl.startsWith('http://') && !this._remoteUrl.startsWith('https://')) {
            H.log.error("警告: 远程 URL 不是有效的 HTTP/HTTPS 地址!");
            H.log.error("当前 URL: " + this._remoteUrl);
            return false;
        }

        this.emitCallback?.(0, "远程服务器地址获取成功" + ": " + this._remoteUrl + ", 版本 ID: " + this._remoteVersion);

        return true;
    }


    public getCurVersion(): string {

        if (!this.isInit) {
            H.log.warn("HotUpdateMgr: 热更新管理器未初始化，正在初始化...");
            return "code fail";
        }

        if (!this._nativeAssetManager) {
            H.log.error("HotUpdateMgr: AssetsManager 实例不存在，无法获取版本信息");
            return "code fail";
        }

        const localManifest = this._nativeAssetManager.getLocalManifest();

        if (!localManifest) {
            H.log.error('HotUpdateMgr: 获取本地 manifest 失败');
            return "code fail";
        }

        return localManifest.getVersion();

    }


    public async checkUpdate() {

        // 非原生平台：直接跳过热更新
        if (!sys.isNative) {
            H.log.info("HotUpdateMgr: 非原生平台，跳过热更新");
            M.event.emit(CoreEvents.HOT_UPDATE_READY, { version: '' });
            return;
        }

        // 初始化兜底
        if (!this.isInit) {
            H.log.info("HotUpdateMgr: 尚未初始化，自动初始化...");
            const ok = await this.init();
            if (!ok) {
                H.log.error("HotUpdateMgr: 自动初始化失败");
                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: '热更新初始化失败' });
                return;
            }
        }

        // 并发保护：检查当前状态
        if (this.state === HotUpdateState.CHECKING) {
            H.log.warn("HotUpdateMgr: 正在检查更新中，请勿重复操作");
            return;
        }

        if (this.state === HotUpdateState.UPDATING) {
            H.log.warn("HotUpdateMgr: 正在更新中，无法检查更新");
            return;
        }

        // 设置为检查状态
        this.state = HotUpdateState.CHECKING;
        H.log.info("HotUpdateMgr: 检查更新... [状态: " + this.state + "]");

        try {
            await this.initRemoteInfo();

            this.refreshLocalManifest();

            this._nativeAssetManager.checkUpdate();

        } catch (error) {
            H.log.error("HotUpdateMgr: 检查更新失败", error);
            // 失败时重置为空闲状态
            this.state = HotUpdateState.IDLE;
        }
    }

    private nativeEventCallback(event: native.EventAssetsManager) {
        const eventCode = event.getEventCode();
        const am = event.getAssetsManagerEx(); // 从事件对象获取 AssetsManager 实例

        H.log.info("热更新事件代码: " + eventCode);

        let tips: string = "";

        switch (eventCode) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                tips = "未找到本地 manifest 文件，跳过热更新";
                H.log.error("HotUpdateMgr: " + tips);
                this.state = HotUpdateState.IDLE; // 重置为空闲状态
                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });
                break;

            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                tips = "下载远程 manifest 失败";
                H.log.error("HotUpdateMgr: " + tips);
                H.log.error("错误信息: " + event.getMessage());
                H.log.error("CURL错误码: " + event.getCURLECode());
                this.state = HotUpdateState.IDLE; // 重置为空闲状态
                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });
                break;

            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                tips = "解析 manifest 文件失败";
                H.log.error("HotUpdateMgr: " + tips);
                H.log.error("错误信息: " + event.getMessage());
                this.state = HotUpdateState.IDLE; // 重置为空闲状态
                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });
                break;

            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                tips = "当前已是最新版本，无需更新";
                H.log.info("HotUpdateMgr: " + tips);
                H.log.info("当前版本: " + am.getLocalManifest().getVersion());
                this.state = HotUpdateState.IDLE; // 重置为空闲状态
                M.event.emit(CoreEvents.HOT_UPDATE_READY, { version: am.getLocalManifest().getVersion() });
                break;

            case native.EventAssetsManager.NEW_VERSION_FOUND:
                const totalBytes = am.getTotalBytes();
                const totalFiles = am.getTotalFiles();
                const sizeKB = Math.ceil(totalBytes / 1024);
                const sizeMB = (totalBytes / 1024 / 1024).toFixed(2);

                tips = `发现新版本！需要下载 ${totalFiles} 个文件，共 ${sizeMB}MB`;
                H.log.info("HotUpdateMgr: " + tips);
                H.log.info("本地版本: " + am.getLocalManifest().getVersion());
                H.log.info("远程版本: " + am.getRemoteManifest().getVersion());
                H.log.info("总大小: " + sizeKB + " KB");
                H.log.info("文件数量: " + totalFiles);

                // 获取远程 manifest 详细信息
                const remoteManifest = am.getRemoteManifest();
                H.log.info("====== 远程 Manifest 原始信息 ======");
                H.log.info("PackageUrl: " + remoteManifest.getPackageUrl());
                H.log.info("ManifestUrl: " + remoteManifest.getManifestFileUrl());
                H.log.info("VersionUrl: " + remoteManifest.getVersionFileUrl());
                H.log.info("================================");


                // 准备更新（可选，update() 会自动调用）
                // am.prepareUpdate();

                // 检查完成，重置为空闲状态
                this.state = HotUpdateState.IDLE;

                // 可以在这里询问用户是否要更新
                // 或者直接开始更新
                // am.update();
                this.hotUpdate(); // 自动开始下载
                break;

            case native.EventAssetsManager.UPDATE_PROGRESSION:
                // 确保状态为更新中
                if (this.state !== HotUpdateState.UPDATING) {
                    this.state = HotUpdateState.UPDATING;
                }

                const downloadedBytes = event.getDownloadedBytes();
                const totalBytesExpected = event.getTotalBytes();
                const downloadedFiles = event.getDownloadedFiles();
                const totalFilesExpected = event.getTotalFiles();
                const percent = event.getPercent();
                const percentByFile = event.getPercentByFile();
                const assetId = event.getAssetId();
                const isResuming = event.isResuming();

                tips = `更新进度: ${(percent * 100).toFixed(1)}%`;

                // 详细进度信息
                H.log.info("====== 更新进度 ======");
                H.log.info("总体进度: " + (percent * 100).toFixed(2) + "%");
                H.log.info("文件进度: " + (percentByFile * 100).toFixed(2) + "%");
                H.log.info("已下载字节: " + (downloadedBytes / 1024 / 1024).toFixed(2) + " MB / " + (totalBytesExpected / 1024 / 1024).toFixed(2) + " MB");
                H.log.info("已下载文件: " + downloadedFiles + " / " + totalFilesExpected);
                H.log.info("当前文件: " + assetId);
                H.log.info("是否续传: " + (isResuming ? "是" : "否"));
                H.log.info("==================");

                // 可以在这里更新 UI 进度条
                this.progressCallback?.(percent, `正在下载: ${assetId} (${(percent * 100).toFixed(1)}%)`);
                this.emitCallback?.(eventCode, tips);

                break;

            case native.EventAssetsManager.ASSET_UPDATED:
                const updatedAssetId = event.getAssetId();
                tips = "资源已更新: " + updatedAssetId;
                H.log.info("HotUpdateMgr: " + tips);
                this.emitCallback?.(eventCode, tips);

                break;

            case native.EventAssetsManager.UPDATE_FINISHED:
                tips = "热更新完成！";
                H.log.info("HotUpdateMgr: " + tips);
                H.log.info("最终下载: " + event.getDownloadedFiles() + " 个文件");
                H.log.info("总计大小: " + (event.getDownloadedBytes() / 1024 / 1024).toFixed(2) + " MB");
                H.log.info("新版本: " + am.getLocalManifest().getVersion());

                // 更新完成，重置为空闲状态
                this.state = HotUpdateState.IDLE;

                M.event.emit(CoreEvents.HOT_UPDATE_READY, { version: am.getLocalManifest().getVersion() });

                // 更新完成后，可以提示用户重启游戏
                this.promptRestart();
                break;

            case native.EventAssetsManager.UPDATE_FAILED:
                tips = "热更新失败";
                H.log.error("HotUpdateMgr: " + tips);
                H.log.error("错误信息: " + event.getMessage());
                H.log.error("资源ID: " + event.getAssetId());
                H.log.error("CURL错误码: " + event.getCURLECode());
                H.log.error("CURLM错误码: " + event.getCURLMCode());

                // 更新失败，重置为空闲状态
                this.state = HotUpdateState.IDLE;

                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });

                // 可以在这里提供重试选项
                // this.promptRetry();
                break;

            case native.EventAssetsManager.ERROR_DECOMPRESS:
                tips = "解压资源失败";
                H.log.error("HotUpdateMgr: " + tips);
                H.log.error("错误信息: " + event.getMessage());
                H.log.error("资源ID: " + event.getAssetId());
                this.state = HotUpdateState.IDLE; // 重置为空闲状态
                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });
                break;

            case native.EventAssetsManager.ERROR_UPDATING:
                tips = "更新资源时出错";
                H.log.error("HotUpdateMgr: " + tips);
                H.log.error("错误信息: " + event.getMessage());
                H.log.error("资源ID: " + event.getAssetId());
                H.log.error("CURL错误码: " + event.getCURLECode());

                this.state = HotUpdateState.IDLE; // 重置为空闲状态

                M.event.emit(CoreEvents.HOT_UPDATE_FAILED, { error: tips });

                // 可以选择下载失败的资源
                // am.downloadFailedAssets();
                break;

            default:
                tips = "未知事件: " + eventCode;
                H.log.warn("HotUpdateMgr: " + tips);
                this.emitCallback?.(eventCode, tips);

                break;
        }

        H.log.info("热更新状态: " + tips);
    }

    public async hotUpdate() {
        if (!this.isInit) {
            H.log.warn("HotUpdateMgr: 热更新管理器未初始化");
            return;
        }

        // 并发保护：检查当前状态
        if (this.state === HotUpdateState.CHECKING) {
            H.log.warn("HotUpdateMgr: 正在检查更新中，请稍候");
            return;
        }

        if (this.state === HotUpdateState.UPDATING) {
            H.log.warn("HotUpdateMgr: 已经在更新中，请勿重复操作");
            return;
        }


        // 设置为更新状态
        this.state = HotUpdateState.UPDATING;
        H.log.info("开始热更新... [状态: " + this.state + "]");

        await this.initRemoteInfo();

        if (this._remoteVersion == this.getCurVersion()) {
            H.log.info("当前版本已是最新版本，无需更新");
            this.state = HotUpdateState.IDLE; // 重置为空闲状态
            return;
        }

        try {
            this.refreshLocalManifest();
            this._nativeAssetManager.update();
        } catch (error) {
            H.log.error("HotUpdateMgr: 启动更新失败", error);
            // 失败时重置为空闲状态
            this.state = HotUpdateState.IDLE;
        }
    }

    private initAM() {
        this._nativeAssetManager = new native.AssetsManager(this._localManifestUrl, this._storagePath, this.compareVersion.bind(this));
        this._nativeAssetManager.setEventCallback(this.nativeEventCallback.bind(this));
    }

    private promptRestart() {
        H.log.info("提示用户重启游戏以应用更新");
        // Prepend the manifest's search path

        this._nativeAssetManager.setEventCallback(null!); // 清除事件回调，防止重启后重复触发

        var searchPaths = native.fileUtils.getSearchPaths();
        var newPaths = this._nativeAssetManager.getLocalManifest().getSearchPaths();
        H.log.info("搜索路径" + JSON.stringify(newPaths));
        Array.prototype.unshift.apply(searchPaths, newPaths);
        // This value will be retrieved and appended to the default search path during game startup,
        // please refer to samples/js-tests/main.js for detailed usage.
        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        native.fileUtils.setSearchPaths(searchPaths);

        H.log.info("1秒后重启游戏以应用更新...");
        setTimeout(() => {
            game.restart();
        }, 1000)

    }



    /**
     * 版本对比函数
     * @param versionA 
     * @param versionB 
     * @returns 
     */ 
    private compareVersion(version1: string, version2: string): number {
        let v1 = version1.split('.');
        let v2 = version2.split('.');
        const len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }

        for (let i = 0; i < len; ++i) {
            let num1 = parseInt(v1[i]);
            let num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }

    /**
     * 获取当前状态
     */
    public getState(): string {
        return this.state;
    }

    /**
     * 检查是否处于空闲状态
     */
    public isIdle(): boolean {
        return this.state === HotUpdateState.IDLE;
    }

}