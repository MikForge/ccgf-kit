# ccgf-kit

Cocos Creator 3.8+ 游戏框架扩展。

## GUI 视图管理

`M.ui` 提供ui分层管理能力，支持界面打开、关闭、切换，子视图自动级联。

## 事件系统

`M.event` 提供模块间解耦通信：`on`/`off`/`emit`。

## 定时器

`M.timeOut` 处理延时和周期性任务，`M.timer` 提供对象级倒计时（注册、注销、回调）。

## 资源管理

`M.res` 负责 Prefab 和 Asset 的加载、缓存与释放。

## 本地存储

`M.ls` 提供键值对持久化读写。

## 音频

`M.audio` 支持 BGM / SFX / Voice 三通道独立播放控制。

## 网络与 HTTP

`M.net` 基于 WebSocket 的网络通信层，`net-http/` 提供 HTTP 请求封装。

## 其他模块

- **SDK** — `M.sdk` 第三方集成
- **热更新** — `M.hotupdate` Cocos Creator 热更新
- **PureMVC** — `puremvc/` MVC 架构适配
- **装饰器** — `@registerView` 视图配置注册
- **工具库** — `FSM` / `Stack` / `AsyncQueue` / 字符串工具
- **启动场景生成** — 编辑器菜单一键生成 root/game/gui/UICamera 节点树
- **全局 API** — `M`（管理器）/ `H`（辅助类），无需 import 直接调用

## 环境

Cocos Creator 3.8+ · Node.js 18+
