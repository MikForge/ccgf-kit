# ccgf-kit

Cocos Creator 游戏框架扩展 — 为 ccgf 生态项目提供核心运行时能力。

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/MikForge/ccgf-kit)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 简介

ccgf-kit 是 Cocos Creator 3.8+ 游戏框架扩展，为 ccgf 生态项目提供核心运行时能力。业务代码通过 `db://ccgf-kit/core/...` 引用，利用 Cocos Creator AssetDB mount 实现零拷贝同步。

**覆盖**: GUI 视图管理 · 事件系统 · 定时器 · 资源管理 · 本地存储 · 工具库 · 装饰器 · 全局 API · PureMVC 适配

## 快速开始

### 创建启动场景

通过编辑器菜单一键生成符合 ccgf 框架规范的启动场景骨架，包含 `root` / `game` / `gui` / `UICamera` 四层节点树及内置组件（Canvas、UITransform、Widget、Camera）。

#### 操作步骤

1. 点击菜单栏 **扩展 → ccgf-kit → 创建启动场景**
2. 场景文件自动生成到 `assets/main.scene`（若已存在则自动编号为 `main-1.scene`、`main-2.scene` ...）
3. 控制台输出创建结果和后续手动操作指引
4. 按提示将 `Main.ts` 拖到 `root` 节点上，并绑定 `gameRoot` / `uiRoot` 属性

#### 生成节点树

```text
root
├── game          （游戏层容器，无内置组件）
└── gui           （UI 层容器，含 Canvas / UITransform / Widget）
    └── UICamera  （UI 摄像机，正交投影）
```

> **提示**：生成的场景 **不挂载 Main 组件**。生成后需手动将 `Main.ts` 挂载到 `root` 节点，并将 `game`、`gui` 子节点分别拖入 Main 组件的 `gameRoot`、`uiRoot` 属性。

框架提供 `BaseView` 作为视图基类，继承后重写 `ui_on_init` / `ui_on_show` / `ui_on_hide` 等生命周期钩子，通过 `M.ui.open('ViewName', data)` 打开。详见下方 GUI 视图管理节。

## GUI 视图管理

### 类层次

`UIComptBase`（节点/组件绑定 + 事件管理）是所有视图组件的基座：

```text
UIComptBase
├── BaseView      （根视图，管理级联子视图）
└── BaseViewItem  （视图内部子组件）
```

### 5 钩子生命周期

```text
ui_on_init(data) → ui_on_show() → ui_on_hide() → ui_on_refresh(data) → ui_on_destroy()
```

- 所有钩子为同步 `void` 返回，生命周期由 `UILayerNodeBase` 驱动
- 级联：`BaseView` 的钩子会自动传导到已注册的子视图（`BaseViewItem`）

### UIComptBase

所有视图组件的基座。提供 `onLoad` 时自动绑定的 `v_nodes` / `v_compts` 映射（依赖 `CCGFComponent._nodeMap`），以及组件销毁时自动解绑的事件管理系统。

### BaseView

根视图基类，继承 `UIComptBase` 并实现 `IUILifecycle`。子类直接重写生命周期钩子（无需调用 `super`）。通过 `registerSubView` 将子节点注册为 `BaseViewItem`，框架自动级联驱动。

### BaseViewItem

视图内部子组件，继承 `UIComptBase` 全部能力（节点绑定、事件管理、完整生命周期）。语义上标注为 `BaseView` 的直属子项，级联深度一层。

## 事件系统

`event/EventMgr` — 模块间解耦通信。通过 `M.event` 访问。

| API | 说明 |
| ----- | ------ |
| `M.event.on(event, callback, target)` | 注册监听 |
| `M.event.off(event, callback, target)` | 注销监听 |
| `M.event.emit(event, ...args)` | 派发事件 |

## 定时器

`timer/` — 提供两类定时能力：延时/周期性任务（`M.timeOut`）和对象倒计时（`M.timer`）。

### M.timeOut（TimerTaskMgr）

| API | 说明 |
| ----- | ------ |
| `M.timeOut.setTimeout(callback, delay)` | 延时执行 |
| `M.timeOut.setInterval(callback, interval)` | 周期执行 |
| `M.timeOut.clearTimeout(id)` | 取消延时任务 |
| `M.timeOut.clearInterval(id)` | 取消周期任务 |
| `M.timeOut.clearAllTimeouts()` | 清除全部延时任务 |
| `M.timeOut.clearAllIntervals()` | 清除全部周期任务 |

### M.timer（CountdownMgr）

| API | 说明 |
| ----- | ------ |
| `M.timer.register(obj, field, target, onSecond?, onComplete?)` | 在对象字段上注册倒计时 |
| `M.timer.unRegister(id)` | 注销倒计时 |
| `M.timer.addCallback(id, onSecond?, onComplete?)` | 追加回调 |

## 资源管理

`res/ResManager` — Prefab、Asset 的加载/缓存/释放。

| API | 说明 |
| ----- | ------ |
| `M.res.loadPrefab(path, bundle)` | 加载 Prefab |
| `M.res.loadAsset(path, type, bundle)` | 加载 Asset |
| `M.res.release({ pathkey, bundle, type })` | 释放引用 |

## 本地存储

`localStorage/LocalStorageMgr` — 键值对持久化。通过 `M.ls` 访问。

| API | 说明 |
| ----- | ------ |
| `M.ls.set(key, value)` | 写入 |
| `M.ls.get(key)` | 读取 |
| `M.ls.remove(key)` | 删除 |

## 辅助模块

### 工具库 `utils/`

数据结构与通用函数：

- `FSM` — 有限状态机
- `Stack<T>` — 泛型栈
- `AsyncQueue` — 异步队列
- 字符串工具函数

### 装饰器 `decorators/`

注解式声明：

- `UIRegistry` — 视图配置注册，提供 `getConfigByViewId` 查询

### 全局 API `GlobalApi`

跨模块便捷入口，聚合常用全局能力。

### 其他模块

| 模块 | 路径 | 说明 |
| ------ | ------ | ------ |
| 网络层 | `net/` | 网络通信基础 |
| HTTP 客户端 | `net-http/` | HTTP 请求封装 |
| SDK 集成 | `sdk/` | 第三方 SDK 适配 |
| PureMVC | `puremvc/` | MVC 架构适配 |
| 辅助工具 | `helper/` | 通用辅助函数 |
| 热更新 | `cchotupdate/` | Cocos Creator 热更新 |
| 瓦片地图 | `tiledmap/` | Tiled 地图支持 |
| 音频 | `audio/` | 音频播放管理 |
| 库文件 | `libs/` | 第三方库 |
| 通用组件 | `common/` | 跨模块通用定义 |

## 环境要求

- Cocos Creator 3.8+
- Node.js 18+

## 许可

MIT
