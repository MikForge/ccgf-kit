# 网络框架架构文档

## 📐 整体架构

```
┌─────────────────────────────────────┐
│   NetMgr (管理层)                    │  ← 单例，统一入口
│   - HTTP 管理                       │
│   - 实时通信管理                     │
└──────────────┬──────────────────────┘
               ↓
        ┌──────┴──────┐
        ↓              ↓
   ┌─────────┐   ┌──────────┐
   │  HTTP   │   │ Realtime │
   └─────────┘   └─────┬────┘
                       ↓
        ┌──────────────┴──────────────┐
        ↓                              ↓
   ┌──────────┐               ┌──────────────┐
   │NetSession│               │  Components  │
   │  (核心)   │ ←─────────→  │   (组件)      │
   └────┬─────┘               └──────────────┘
        ↓
   ┌────┴─────────────┐
   ↓         ↓         ↓
┌──────┐ ┌──────┐ ┌──────┐
│ FSM  │ │Socket│ │Proto │
└──────┘ └──────┘ └──────┘
```

## 🔍 模块说明

### 1. HTTP 模块
**职责：** 处理 HTTP/HTTPS 请求
- `HttpClient`: HTTP 客户端封装
- `HttpHelper`: 工具方法
- `http-interceptors`: 请求/响应拦截器
- `http-enum`: 状态码、方法等枚举
- `http-structs.d.ts`: 类型定义

**使用示例：**
```typescript
import { HttpClient } from './http/HttpClient';

HttpClient.post('/api/login', { username, password })
    .then(res => H.log.info(res))
    .catch(err => H.log.error(err));
```

---

### 2. Realtime 模块（实时通信）

#### 2.1 核心类
- **NetSession**: 网络会话核心类，管理整个生命周期
- **NetSessionBuilder**: 构建器模式，创建 NetSession

#### 2.2 传输层 (socket/)
```
ISocket (接口)
    ↑
BaseSocket (基类)
    ↑
├── WebSocketImpl
└── SocketIOImpl
```

#### 2.3 协议层 (protocol/)
```
IPacketHandler (接口)
    ↑
├── JsonPacketHandler (JSON 序列化)
└── ProtobufPacketHandler (Protobuf 序列化)
```

#### 2.4 状态机 (fsm/)
```
NetSessionFSM
├── ClosedState      # 关闭状态
├── ConnectingState  # 连接中
├── CheckingState    # 检查中（如验证）
└── WorkingState     # 工作中
```

#### 2.5 组件 (components/)
- **ConnectionLifecycle**: 连接生命周期管理
- **MessagePipeline**: 消息管道处理
- **InFlightTracker**: 请求中消息追踪（请求-响应匹配）
- **SendManager**: 发送队列管理

#### 2.6 策略 (strategy/)

**心跳策略：**
```typescript
IHeartbeatStrategy
    ↑
FixedHeartbeat  // 固定间隔心跳
```

**重连策略：**
```typescript
IReconnectStrategy
    ↑
ExponentialBackoff  // 指数退避重连
```

---

## 🎯 使用示例

### 创建实时连接
```typescript
import { NetSessionBuilder } from './realtime/NetSessionBuilder';
import { WebSocketImpl } from './realtime/socket/WebSocketImpl';
import { JsonPacketHandler } from './realtime/protocol/JsonPacketHandler';

const session = new NetSessionBuilder()
    .setSocket(new WebSocketImpl())
    .setProtocol(new JsonPacketHandler())
    .setUrl('ws://localhost:8080')
    .build();

session.connect();
```

### 发送消息
```typescript
session.send({ cmd: 'chat', msg: 'Hello' });
```

### 监听消息
```typescript
session.on('message', (data) => {
    H.log.info('收到消息:', data);
});
```

---

## 🔧 扩展指南

### 添加新的 Socket 实现
1. 创建 `assets/core/net/realtime/socket/XXXImpl.ts`
2. 继承 `BaseSocket`
3. 实现抽象方法

### 添加新的协议
1. 创建 `assets/core/net/realtime/protocol/XXXPacketHandler.ts`
2. 实现 `IPacketHandler` 接口

### 添加新的重连策略
1. 创建 `assets/core/net/realtime/strategy/reconnect/XXX.ts`
2. 实现 `IReconnectStrategy` 接口

---

## 📊 设计模式应用

| 模式 | 应用位置 | 说明 |
|------|---------|------|
| **单例模式** | NetMgr | 全局唯一实例 |
| **构建器模式** | NetSessionBuilder | 灵活构建会话 |
| **策略模式** | strategy | 可替换的心跳、重连策略 |
| **状态模式** | fsm | 连接状态管理 |
| **适配器模式** | socket/ | 适配不同传输协议 |
| **观察者模式** | NetSession | 事件监听 |

---

## ⚡ 性能优化

1. **消息队列**: SendManager 管理发送队列
2. **请求追踪**: InFlightTracker 避免重复请求
3. **断线重连**: 自动重连 + 消息重发
4. **心跳保活**: 可配置心跳策略

---

## 🐛 调试建议

```typescript
// 开启调试日志
session.enableDebug(true);

// 监听所有事件
session.on('*', (event, data) => {
    H.log.info(`[${event}]`, data);
});
```