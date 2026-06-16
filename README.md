# ccgf-kit

Cocos Creator 游戏框架扩展 — 为 ccgf 生态项目提供核心运行时能力。

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/MikForge/ccgf-kit)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 简介

ccgf-kit 是 ccgf 运行时框架的 **Cocos Creator Extension v2** 封装，提供：

- 工具库（utils）— FSMs、异步队列、栈、字符串工具
- 本地存储（localStorage）
- 定时器管理（timer）
- 事件系统（event）
- 全局 API（GlobalApi）

业务代码通过 `db://ccgf-kit/core/...` 引用，利用 Cocos Creator 的 AssetDB mount 机制实现零拷贝同步。

## 使用示例

```ts
import { GameBootstrap } from 'db://ccgf-kit/core/GameBootstrap';
import { TimerManager }  from 'db://ccgf-kit/core/timer';
import { EventMgr }      from 'db://ccgf-kit/core/event';
```

## 创建启动场景

通过编辑器菜单一键生成符合 ccgf 框架规范的启动场景骨架，包含 `root` / `game` / `gui` / `UICamera` 四层节点树及内置组件（Canvas、UITransform、Widget、Camera）。

### 操作步骤

1. 点击菜单栏 **扩展 → ccgf-kit → 创建启动场景**
2. 场景文件自动生成到 `assets/main.scene`（若已存在则自动编号为 `main-1.scene`、`main-2.scene` ...）
3. 控制台输出创建结果和后续手动操作指引
4. 按提示将 `Main.ts` 拖到 `root` 节点上，并绑定 `gameRoot` / `uiRoot` 属性

### 生成节点树

```text
root
├── game          （游戏层容器，无内置组件）
└── gui           （UI 层容器，含 Canvas / UITransform / Widget）
    └── UICamera  （UI 摄像机，正交投影）
```

> **提示**：生成的场景 **不挂载 Main 组件**。生成后需手动将 `Main.ts` 挂载到 `root` 节点，并将 `game`、`gui` 子节点分别拖入 Main 组件的 `gameRoot`、`uiRoot` 属性。

## 环境要求

- Cocos Creator 3.8+
- Node.js 18+

## 目录结构

```text
extensions/ccgf-kit/
├── assets/core/          # 运行时框架（挂载为 db://ccgf-kit/core/）
├── package.json          # Extension v2 清单
└── tsconfig.json         # TypeScript 配置
```

## 许可

MIT
