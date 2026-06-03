# ccgf-kit

ccgf 运行时框架的 Cocos Creator Extension v2 封装。

## 概述

ccgf-kit 是一个 Cocos Creator Extension v2 包，通过 `contributions.asset-db.mount` 将运行时框架挂载为 `db://ccgf-kit/core/...`，使其对 ccgf 主项目可见。

## 安装（在 ccgf 主项目中）

ccgf 主项目通过 `update-ccgf-kit.sh` / `update-ccgf-kit.bat` 同步本仓库到 `extensions/ccgf-kit/`：

```bash
# macOS / Linux
bash update-ccgf-kit.sh

# Windows
update-ccgf-kit.bat
```

同步后，Cocos Creator 的 AssetDB 中会出现 `ccgf-kit` 挂载点，业务代码通过 `db://ccgf-kit/core/...` 引用运行时框架模块。

## 引用方式

```ts
import { GameBootstrap } from 'db://ccgf-kit/core/GameBootstrap';
import { TimerManager } from 'db://ccgf-kit/core/timer';
import { UIMgr } from 'db://ccgf-kit/core/gui';
```

## 结构

```
ccgf-kit/
├── package.json          # Extension v2 清单，声明 asset-db.mount
├── tsconfig.json         # 编辑器扩展编译配置（排除 ./assets）
├── assets/core/          # 运行时框架唯一来源（挂载为 db://ccgf-kit/core/）
└── temp/declarations/    # Cocos Creator 类型声明
```

## 版本

当前版本：`0.1.0`

## 许可

MIT
