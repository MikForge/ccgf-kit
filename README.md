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

## 快速开始

在 **你的 Cocos Creator 项目根目录** 执行以下命令：

```bash
# 1. 下载同步脚本和锁文件
curl -O https://raw.githubusercontent.com/MikForge/ccgf/main/update-ccgf-kit.sh
curl -O https://raw.githubusercontent.com/MikForge/ccgf/main/ccgf-kit.lock

# 2. 执行同步（克隆/更新 ccgf-kit 到 extensions/）
bash update-ccgf-kit.sh
```

同步完成后，Cocos Creator 的 AssetDB 中会出现 `ccgf-kit` 挂载点。

## 切换版本

```bash
bash update-ccgf-kit.sh --set-ref <git-tag-or-commit>
```

## 使用示例

```ts
import { GameBootstrap } from 'db://ccgf-kit/core/GameBootstrap';
import { TimerManager }  from 'db://ccgf-kit/core/timer';
import { EventMgr }      from 'db://ccgf-kit/core/event';
```

## 环境要求

- Cocos Creator 3.8+
- Node.js 18+
- Git

## 目录结构

```text
extensions/ccgf-kit/
├── assets/core/          # 运行时框架（挂载为 db://ccgf-kit/core/）
├── package.json          # Extension v2 清单
└── tsconfig.json         # TypeScript 配置
```

## 许可

MIT
