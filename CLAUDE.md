# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server with HMR
- `npm run build` — Type-check (`tsc -b`) then build with Vite
- `npm run lint` — Run ESLint across the project
- `npm run preview` — Preview production build locally

## Architecture

React 19 + TypeScript + Vite 8 project. Uses the React Compiler (via `babel-plugin-react-compiler` + `@rolldown/plugin-babel`).

**Build pipeline:** `vite.config.ts` composes `@vitejs/plugin-react` (Oxc-based transforms) with a Babel pass for the React Compiler preset.

**TypeScript:** Composite project with two references — `tsconfig.app.json` (app code in `src/`) and `tsconfig.node.json` (Vite config). `tsc -b` validates both.

**Entry point:** `src/main.tsx` → `src/App.tsx`.

**Styling:** CSS with custom properties. `src/index.css` defines theming (light/dark via `prefers-color-scheme`), `src/App.css` handles component layout. No CSS modules or preprocessors.

**Linting:** Flat ESLint config in `eslint.config.js`. Extends `js.configs.recommended`, `typescript-eslint`, `react-hooks`, and `react-refresh` configs. The `dist/` directory is globally ignored.

**No test framework is configured.**
