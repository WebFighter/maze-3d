# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 命令

- `npm run dev` — 启动开发服务器（支持 HMR 热模块替换）
- `npm run build` — 先进行类型检查（`tsc -b`），再用 Vite 构建
- `npm run lint` — 在整个项目中运行 ESLint
- `npm run preview` — 本地预览生产构建

## 架构

React 19 + TypeScript + Vite 8 项目。使用 React 编译器（通过 `babel-plugin-react-compiler` + `@rolldown/plugin-babel`）。

**构建管线：** `vite.config.ts` 组合了 `@vitejs/plugin-react`（基于 Oxc 的转换）和一个用于 React 编译器预设的 Babel 处理步骤。

**TypeScript：** 组合式项目，包含两个引用 — `tsconfig.app.json`（`src/` 中的应用代码）和 `tsconfig.node.json`（Vite 配置）。`tsc -b` 同时验证两者。

**入口文件：** `src/main.tsx` → `src/App.tsx`。

**样式：** 使用自定义属性的 CSS。`src/index.css` 定义主题（通过 `prefers-color-scheme` 实现亮色/暗色），`src/App.css` 处理组件布局。未使用 CSS Modules 或预处理器。

**代码检查：** 在 `eslint.config.js` 中使用扁平 ESLint 配置。继承了 `js.configs.recommended`、`typescript-eslint`、`react-hooks` 和 `react-refresh` 配置。`dist/` 目录被全局忽略。

**未配置测试框架。**
