<div align="center">
  <h1>ccgf-kit</h1>
  <p>Cocos Creator 3.8+ 游戏框架扩展</p>
  <p>
    <img src="https://img.shields.io/badge/cocos-3.8%2B-blue" alt="Cocos Creator 3.8+" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT" />
  </p>
</div>

---

## ✨ 特性

- 🖼️ **GUI 视图管理** — `M.ui` 分层管理，支持打开 / 关闭 / 切换，子视图自动级联
- 🔊 **音频** — `M.audio` 支持 BGM / SFX / Voice 三通道独立播放控制
- 🌐 **网络与 HTTP** — `M.net` 基于 WebSocket 的通信层；`net-http/` 提供 HTTP 请求封装
- 📦 **资源管理** — `M.res` 负责 Prefab 和 Asset 的加载、缓存与释放
- 📡 **事件系统** — `M.event` 模块间解耦通信：`on` / `off` / `emit`
- ⏱️ **定时器** — `M.timeOut` 延时 / 周期任务；`M.timer` 对象级倒计时
- 💾 **本地存储** — `M.ls` 键值对持久化读写

---

## 🚀 快速开始

```bash
git submodule add https://github.com/MikForge/ccgf-kit.git extensions/ccgf-kit
```

继承 `GameBootstrap`，实现启动入口：

```typescript
import { GameBootstrap } from 'db://ccgf-kit/core/GameBootstrap';

@ccclass('Main')
export class Main extends GameBootstrap {
    protected onStartupComplete(): void {
        M.audio.playBGM("bgm_main");
        H.core.pmvcOpenView("MainUI");
    }
}
```

挂到场景根节点 → 运行。搞定。

---

## 🧭 模块

| 入口 | 模块 | 说明 |
|------|------|------|
| `M.ui` | GUI 视图管理 | 打开 / 关闭 / 切换界面，子视图自动级联 |
| `M.audio` | 音频 | BGM / SFX / Voice 三通道独立播放控制 |
| `M.net` | 网络 | WebSocket 通信，支持 Protobuf、重连、心跳 |
| `M.res` | 资源管理 | Prefab / Asset 加载、缓存与释放 |
| `M.event` | 事件系统 | `on` / `off` / `emit` 模块间解耦通信 |
| `M.timer` | 倒计时 | 对象级注册 / 注销 / 回调 |
| `M.timeOut` | 定时任务 | 延时和周期性任务 |
| `M.ls` | 本地存储 | 键值对持久化读写 |
| `M.hotupdate` | 热更新 | Cocos Creator 热更新管理 |

---

## 🔧 更多能力

| 能力 | 说明 |
|------|------|
| 按钮系统 | `bindButton(node, callback, { sound, cooldown })` — 音效 + 防连击一行搞定 |
| Tween 管理 | `this.createTween(target).to(0.3, { scale }).start()` — 组件销毁自动 stop |
| 事件绑定 | `this.bindEvent(node, type, callback)` — 自动清理，无需手动 off |
| PureMVC | `@registerView` / `@registerProxy` / `@registerCmd` 装饰器注册 |
| 启动场景 | 编辑器菜单一键生成 root / game / gui / UICamera 节点树 |
| 工具库 | FSM / AsyncQueue / Stack / BoundedQueue / StringUtil |

---

## 🔗 全局入口

```typescript
// 无需 import，直接调用
M.ui.open("ShopUI");           // 管理器：ui / audio / net / res / event / timer ...
H.log.info("hello");           // 辅助类：log / core / sort / audioHelper / ut
```

---

## 环境

Cocos Creator 3.8+ · TypeScript · Node.js 18+
