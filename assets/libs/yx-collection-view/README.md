# YXCollectionView

Cocos Creator 3.x 虚拟列表组件，支持回收复用和预加载两种模式，提供 TableView / Grid / PageView 三种布局。

**源仓库**：[creator-collection-view](https://github.com/568071718/creator-collection-view)

## 文件结构

```
extensions/ccgf-kit/assets/libs/yx-collection-view/
├── yx-collection-view.ts   # 核心组件：YXCollectionView、YXLayout 基类、布局属性、节点池
├── yx-table-layout.ts      # TableView 布局（垂直列表、区头/区尾、吸附固定）
├── grid-layout.ts          # Grid 布局（垂直网格、多对齐方式）
└── page-layout.ts          # PageView 布局（水平分页、循环滚动）
```

## 快速开始

### 1. 场景搭建

1. 创建节点，挂载 `YXCollectionView` 组件
2. 在该节点下创建一个子节点用于注册 cell 预制体

### 2. TableView（垂直列表）

```typescript
import { YXCollectionView } from '../lib/yx-collection-view';
import { YXTableLayout } from '../lib/yx-table-layout';

const listComp = this.node.getChildByName('list').getComponent(YXCollectionView);

// 设置数据量
listComp.numberOfItems = () => 10000;

// 配置每个位置的 cell
listComp.cellForItemAt = (indexPath, collectionView) => {
    const cell = collectionView.dequeueReusableCell('cell');
    cell.getChildByName('label').getComponent(Label).string = `${indexPath}`;
    return cell;
};

// 设置布局
const layout = new YXTableLayout();
layout.spacing = 10;
layout.rowHeight = 120;
listComp.layout = layout;

listComp.reloadData();
```

### 3. GridLayout（网格布局）

```typescript
import { GridLayout } from '../lib/grid-layout';

const layout = new GridLayout();
layout.horizontalSpacing = 20;
layout.verticalSpacing = 20;
layout.itemSize = new math.Size(150, 180);
layout.contentAlignment = 1; // 0靠左 1居中 2靠右
listComp.layout = layout;
```

### 4. PageLayout（水平分页）

```typescript
import { PageLayout } from '../lib/page-layout';

listComp.recycleInterval = 0;
listComp.ignoreScrollEndedDuringAutoScroll = true;

const layout = new PageLayout();
layout.loop = true; // 开启循环滚动
listComp.layout = layout;
```

## 核心概念

### 数据源

通过回调函数声明数据量，支持分区：

```typescript
// 区数量
listComp.numberOfSections = () => data.length;

// 每个区的条目数
listComp.numberOfItems = (section) => data[section].list.length;
```

### Cell 注册与复用

通过编辑器注册（在 `YXCollectionView` 属性面板的 `Register Cells` 配置 prefab + identifier），或代码注册：

```typescript
listComp.registerCell('cell', () => instantiate(cellPrefab));
```

获取 cell 时必须通过 `dequeueReusableCell`，禁止手动 `instantiate`：

```typescript
listComp.cellForItemAt = (indexPath, collectionView) => {
    const cell = collectionView.dequeueReusableCell('cell', indexPath);
    // 此处更新 cell 内容
    return cell;
};
```

### 编辑器中注册 Cell

在 `YXCollectionView` 组件的属性面板：

- **Register Cells**：配置 cell 预制体（`prefab`）、重用标识符（`identifier`）、自定义组件名（`comp`）
- **Register Supplementarys**：配置追加视图（区头/区尾等）预制体

## 布局

### YXTableLayout

垂直列表布局，支持分区、区头/区尾。

| 属性 | 类型 | 说明 |
|------|------|------|
| `rowHeight` | `number \| (indexPath) => number` | 行高，支持函数动态返回 |
| `spacing` | `number` | 节点间距 |
| `top` / `bottom` | `number` | 内容上下边距 |
| `sectionHeaderHeight` | `number \| (section) => number` | 区头高度 |
| `sectionFooterHeight` | `number \| (section) => number` | 区尾高度 |
| `sectionHeadersPinToVisibleBounds` | `boolean` | 区头是否吸附在列表顶部 |
| `sectionFootersPinToVisibleBounds` | `boolean` | 区尾是否吸附在列表底部 |

**Supplementary（区头/区尾）用法**：

```typescript
listComp.supplementaryForItemAt = (indexPath, collectionView, kinds) => {
    if (kinds === YXTableLayout.SupplementaryKinds.HEADER) {
        const header = collectionView.dequeueReusableSupplementary('header');
        // 更新 header 内容
        return header;
    }
    return null;
};

// 点击区头可展开/收起
listComp.onTouchSupplementaryAt = (indexPath, collectionView, kinds) => {
    if (kinds === YXTableLayout.SupplementaryKinds.HEADER) {
        // 切换展开状态后 reloadData
        collectionView.reloadData();
    }
};
```

**不定高行**：

```typescript
layout.rowHeight = (indexPath) => {
    return (indexPath.row % 2 === 0) ? 120 : 200;
};
```

### GridLayout

垂直网格布局。

| 属性 | 类型 | 说明 |
|------|------|------|
| `itemSize` | `math.Size` | 节点大小 |
| `horizontalSpacing` | `number` | 水平间距 |
| `verticalSpacing` | `number` | 垂直间距 |
| `contentAlignment` | `number` | 整体对齐：0靠左 1居中 2靠右 |
| `lastRowAlignment` | `number` | 最后一行对齐方式 |

### PageLayout

水平分页布局。

| 属性 | 类型 | 说明 |
|------|------|------|
| `pagingAnimationDuration` | `number` | 分页吸附动画时间（默认 0.5s） |
| `loop` | `boolean` | 是否循环滚动 |
| `scrollRangeMultiplier` | `number` | 循环滚动范围倍数（默认 5） |

## 加载模式

```typescript
// 回收模式（默认）：按需加载，节点复用
listComp.mode = YXCollectionView.Mode.RECYCLE;

// 预加载模式：一次性创建所有节点，显示区域外透明化
listComp.mode = YXCollectionView.Mode.PRELOAD;
```

## 关键属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scrollEnabled` | `boolean` | `true` | 允许手势滚动 |
| `wheelScrollEnabled` | `boolean` | `false` | 允许鼠标滚轮 |
| `scrollDirection` | `ScrollDirection` | `VERTICAL` | 滚动方向 |
| `frameInterval` | `number` | `1` | 每 N 帧刷新可见节点 |
| `recycleInterval` | `number` | `1` | 每 N 帧回收不可见节点 |
| `autoReloadOnSizeChange` | `boolean` | `false` | 节点大小变化时自动 reload |
| `ignoreScrollEndedDuringAutoScroll` | `boolean` | `false` | 快速滑动时不发 scroll-ended 事件 |

## 回调

| 回调 | 说明 |
|------|------|
| `cellForItemAt` | 配置 cell 节点（**必须实现**） |
| `supplementaryForItemAt` | 配置区头/区尾节点 |
| `onCellDisplay` | cell 进入可见区域 |
| `onCellEndDisplay` | cell 离开可见区域 |
| `onTouchCellAt` | 点击 cell |
| `onTouchSupplementaryAt` | 点击 supplementary |

## API

| 方法 | 说明 |
|------|------|
| `reloadData()` | 刷新列表数据 |
| `scrollTo(indexPath, time?, attenuated?)` | 滚动到指定索引位置 |
| `dequeueReusableCell(identifier, indexPath?)` | 获取复用 cell |
| `dequeueReusableSupplementary(identifier, indexPath?)` | 获取复用 supplementary |
| `getVisibleCellNode(indexPath)` | 获取指定索引的可见 cell |
| `getVisibleRect()` | 获取当前可见范围 |
| `getElementAttributes(node)` | 获取节点绑定的布局属性 |
| `markForUpdateVisibleData(force?)` | 标记需要刷新可见节点 |

## 使用场景示例

### 嵌套列表

PageView 内嵌 TableView，每个页面包含一个独立列表：

```typescript
// 外层 PageLayout
const pageLayout = new PageLayout();
pageLayout.loop = true;
outerList.layout = pageLayout;

outerList.cellForItemAt = (indexPath, collectionView) => {
    const page = collectionView.dequeueReusableCell('page');
    const innerList = page.getComponent(YXCollectionView);
    // 每个内层列表独立配置
    const layout = new YXTableLayout();
    layout.rowHeight = 100;
    innerList.layout = layout;
    innerList.numberOfItems = () => 50;
    innerList.cellForItemAt = (idx, cv) => {
        const cell = cv.dequeueReusableCell('innerCell');
        return cell;
    };
    innerList.reloadData();
    return page;
};
```

### 展开/收起子列表

点击区头展开收起子列表内容：

```typescript
const openIds = new Map<number, boolean>();

listComp.numberOfSections = () => data.length;
listComp.numberOfItems = (section) => {
    return openIds.get(section) ? data[section].list.length : 0;
};

listComp.onTouchSupplementaryAt = (indexPath, collectionView, kinds) => {
    if (kinds === YXTableLayout.SupplementaryKinds.HEADER) {
        openIds.set(indexPath.section, !openIds.get(indexPath.section));
        collectionView.reloadData();
    }
};
```
