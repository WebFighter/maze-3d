# 3D 迷宫游戏设计文档

## 概述

基于 React Three Fiber + Ammo.js 的 3D 迷宫游戏。玩家操控一个自带光源的小球，在算法生成的迷宫中从入口到达出口。赛博朋克/科幻美术风格，支持关卡递进、物理碰撞、第一/第三视角切换和实时小地图。

## 技术选型

- **渲染**: React Three Fiber (R3F) — 声明式 Three.js
- **物理**: Ammo.js (Bullet) — 完整物理引擎，通过 useFrame 手动同步
- **状态管理**: Zustand
- **构建**: Vite 8 + React 19 + TypeScript

## 美术风格

赛博朋克/科幻风格：
- 深色基调 (接近黑色的深蓝/深紫)
- 墙壁带霓虹发光边缘 (青色 `#00f0ff`)
- 地面深色带微弱网格纹理
- 小球品红色光源 (`#ff0055`)，带发光效果
- 环境光微弱，营造氛围感

## 模块架构

```
src/
├── main.tsx                    # 入口
├── App.tsx                     # 根组件：游戏状态管理 + 场景/菜单切换
├── components/
│   ├── Game.tsx                # 游戏主组件（Canvas + HUD）
│   ├── MainMenu.tsx            # 主菜单界面
│   ├── LevelComplete.tsx       # 过关界面
│   └── hud/
│       ├── Minimap.tsx         # 右上角小地图（2D Canvas）
│       ├── GameInfo.tsx        # 顶部关卡/时间信息
│       ├── ControlsHint.tsx    # 底部操控提示
│       └── ViewToggle.tsx      # 视角切换按钮
├── game/
│   ├── Scene.tsx               # R3F Canvas 场景（灯光、环境）
│   ├── Ball.tsx                # 小球（模型 + 光源 + 物理体）
│   ├── Maze.tsx                # 迷宫渲染（墙壁 + 地面 + 入口出口标记）
│   ├── Camera.tsx              # 相机控制器（第一/第三视角切换）
│   └── mechanics/              # 关卡机制（后续扩展）
│       ├── Portal.tsx          # 传送门
│       ├── MovingObstacle.tsx  # 移动障碍
│       └── KeyDoor.tsx         # 钥匙开门
├── systems/
│   ├── mazeGenerator.ts        # 迷宫生成算法（递归回溯）
│   ├── physics.ts              # Ammo.js 初始化 + 物理世界管理
│   ├── inputManager.ts         # 键盘/鼠标输入管理
│   └── levelManager.ts         # 关卡配置与进度管理
├── stores/
│   └── gameStore.ts            # 游戏全局状态（Zustand）
└── types/
    └── index.ts                # 共享类型定义
```

设计原则：
- `game/` 下的 R3F 组件负责渲染和场景内逻辑
- `systems/` 下的纯 TS 模块负责算法、物理、输入等非渲染逻辑
- `stores/` 用 Zustand 管理跨组件游戏状态
- `components/hud/` 是覆盖在 3D 画面上的 2D UI 层

## 迷宫生成算法

使用递归回溯算法 (Recursive Backtracking)：

1. 创建 N×M 网格，所有单元格初始为墙壁
2. 从入口开始，随机选择一个未访问的邻居，打通之间的墙
3. 递归直到所有可达单元格都被访问
4. 保证只有入口和出口两个开口

复杂度控制：基础迷宫生成后，根据 `complexity` 参数（0-1）随机移除额外墙壁，增加可选路径。0 = 只有唯一解，1 = 大量开放空间。

```typescript
interface LevelConfig {
  level: number
  mazeSize: [number, number]
  complexity: number
  mechanics: MechanicType[]
  timeLimit?: number
}
```

## 物理与碰撞系统

### 集成方式

- `systems/physics.ts` 初始化 Ammo.js 物理世界，重力 `(0, -9.8, 0)`
- 每帧在 R3F `useFrame` 中调用 `physicsWorld.stepSimulation(delta)`
- 3D 对象与物理体通过映射表同步：每帧读取物理体位置/旋转，更新对应 Three.js mesh

### 物理体类型

| 对象 | 碰撞形状 | 质量 | 说明 |
|------|----------|------|------|
| 小球 | Sphere (半径 0.3) | 1.0 | 动态刚体，受力运动 |
| 墙壁 | Box | 0 | 静态刚体，不可推动 |
| 地面 | Plane/Box | 0 | 静态刚体 |
| 传送门 | Ghost Object | 0 | 触发器，无碰撞 |
| 障碍物 | Box | 0 | 运动学刚体，沿路径移动 |
| 钥匙/门 | Ghost Object / Box | 0 | 触发器 + 静态 |

### 小球运动

通过 `applyCentralForce` 施加力而非直接设速度，保证物理真实感。玩家松开按键后小球因摩擦力逐渐减速。

### 碰撞回调

注册 `ContactPairTest` 检测小球与出口/传送门/钥匙的接触事件，触发游戏逻辑。

## 相机与控制系统

### 输入管理

`inputManager.ts` 维护按键状态表 `Map<string, boolean>`，mousemove 累积偏移量。暴露 `isPressed(key)` 和 `consumeMouseDelta()` 方法。

### 第三视角（默认）

- 相机偏移量 `(0, 8, 12)`，始终看向小球
- 鼠标水平移动控制相机绕小球旋转 (yaw)
- 相机与墙壁之间射线检测，被遮挡时自动拉近
- 有角度限制避免穿墙

### 第一视角

- 相机位于球心 `(0, 0.5, 0)`，小球模型隐藏
- 鼠标控制 pitch (±60°) 和 yaw
- 小地图自动放大补偿视野信息

### WASD 运动（相对相机方向）

- W = 沿相机前方投影到地面的方向施力
- S = 反方向
- A/D = 沿相机右方向的左/右
- 方向键功能与 WASD 相同

### 按键绑定

- `V` — 切换第一/第三视角
- `R` — 重置小球到当前关卡起点
- `ESC` — 暂停/返回菜单

## UI 布局

沉浸式渐变边框风格：

- **顶栏**: 半透明渐变融入画面，显示关卡编号、计时
- **右上角**: 小地图（120×120px，半透明深色底 + 霓虹描边）
- **底栏**: 半透明渐变，显示操控提示
- **右下角**: 视角切换按钮
- 第一视角时小地图自动放大到 160×160px

### 小地图

使用独立 2D Canvas 绘制：
- 迷宫墙壁轮廓（霓虹线条）
- 小球位置（发光圆点）
- 入口/出口标记
- 迷雾效果：只显示小球已探索区域
- 每帧从小球三维坐标映射到迷宫网格坐标

## 关卡系统

### 关卡递进表

| 关卡 | 迷宫尺寸 | 复杂度 | 新机制 | 说明 |
|------|----------|--------|--------|------|
| 1 | 7×7 | 0.1 | 无 | 入门，纯找路 |
| 2 | 9×9 | 0.2 | 无 | 稍大，路径更多 |
| 3 | 10×10 | 0.3 | 传送门 | 成对出现，进入一个从另一个出来 |
| 4 | 12×12 | 0.3 | 传送门 | 更大地图 + 更多传送门 |
| 5 | 12×12 | 0.4 | 移动障碍 | 沿固定路径来回的墙壁 |
| 6 | 14×14 | 0.4 | 传送门 + 障碍 | 组合机制 |
| 7 | 14×14 | 0.5 | 钥匙 + 门 | 收集钥匙打开对应门 |
| 8+ | 15+ | 0.5+ | 全部组合 | 逐渐增大和复杂化 |

### 第一版范围

纯迷宫 + 传送门。移动障碍和钥匙开门预留接口，后续迭代实现。

## 皮肤系统预留

```typescript
interface SkinConfig {
  ball: {
    geometry: 'sphere'
    material: {
      color: string
      emissive: string
      emissiveIntensity: number
    }
    lightColor: string
    lightIntensity: number
  }
  maze: {
    wallColor: string
    wallEmissive: string
    floorColor: string
    glowColor: string
  }
}
```

默认赛博朋克皮肤：深色墙壁 + 青色发光边缘 + 品红色小球光源。皮肤通过 `gameStore` 切换，各渲染组件从 store 读取颜色配置。第一版只实现默认皮肤，UI 入口预留。
