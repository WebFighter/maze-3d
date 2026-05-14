import { create } from 'zustand'
import { generateMaze } from '../systems/mazeGenerator'
import { getLevelConfig } from '../systems/levelManager'
import type {
  MazeData,
  LevelConfig,
  ViewMode,
  GamePhase,
  SkinConfig,
} from '../types'
import { DEFAULT_SKIN } from '../game/constants'

interface GameState {
  phase: GamePhase
  currentLevel: number
  levelConfig: LevelConfig | null
  mazeData: MazeData | null
  viewMode: ViewMode
  skin: SkinConfig
  elapsedTime: number
  ballGridPos: [number, number]
  ballWorldPos: [number, number, number]
  visitedCells: Set<string>

  startLevel: (level: number) => void
  completeLevel: () => void
  nextLevel: () => void
  setPhase: (phase: GamePhase) => void
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
  tickTime: (delta: number) => void
  setBallGridPos: (pos: [number, number]) => void
  setBallWorldPos: (pos: [number, number, number]) => void
  revealNearbyCells: (row: number, col: number, radius: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  currentLevel: 1,
  levelConfig: null,
  mazeData: null,
  viewMode: 'thirdPerson',
  skin: DEFAULT_SKIN,
  elapsedTime: 0,
  ballGridPos: [1, 1],
  ballWorldPos: [2, 0.4, 2],
  visitedCells: new Set<string>(),

  startLevel: (level: number) => {
    const config = getLevelConfig(level)
    const maze = generateMaze(
      config.mazeSize[0],
      config.mazeSize[1],
      config.complexity
    )
    set({
      currentLevel: level,
      levelConfig: config,
      mazeData: maze,
      phase: 'playing',
      elapsedTime: 0,
      visitedCells: new Set<string>(),
      ballGridPos: [1, 1],
    })
  },

  completeLevel: () => {
    set({ phase: 'levelComplete' })
  },

  nextLevel: () => {
    const next = get().currentLevel + 1
    get().startLevel(next)
  },

  setPhase: (phase) => set({ phase }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleViewMode: () => {
    const current = get().viewMode
    set({ viewMode: current === 'thirdPerson' ? 'firstPerson' : 'thirdPerson' })
  },

  tickTime: (delta) =>
    set((s) => ({ elapsedTime: s.elapsedTime + delta })),

  setBallGridPos: (pos) => {
    const cur = get().ballGridPos
    if (cur[0] === pos[0] && cur[1] === pos[1]) return
    set({ ballGridPos: pos })
  },

  setBallWorldPos: (pos) => set({ ballWorldPos: pos }),

  revealNearbyCells: (row, col, radius) => {
    const maze = get().mazeData
    if (!maze) return
    const visited = get().visitedCells
    const toAdd: string[] = []
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < maze.rows && c >= 0 && c < maze.cols) {
          const key = `${r},${c}`
          if (!visited.has(key)) {
            toAdd.push(key)
          }
        }
      }
    }
    if (toAdd.length > 0) {
      const newCells = new Set(visited)
      for (const key of toAdd) newCells.add(key)
      set({ visitedCells: newCells })
    }
  },
}))
