import type { LevelConfig, MechanicType } from '../types'

const LEVELS: LevelConfig[] = [
  { level: 1, mazeSize: [7, 7], complexity: 0.1, mechanics: [] },
  { level: 2, mazeSize: [9, 9], complexity: 0.2, mechanics: [] },
  {
    level: 3,
    mazeSize: [10, 10],
    complexity: 0.3,
    mechanics: ['portal'],
  },
  {
    level: 4,
    mazeSize: [12, 12],
    complexity: 0.3,
    mechanics: ['portal'],
  },
  {
    level: 5,
    mazeSize: [12, 12],
    complexity: 0.4,
    mechanics: ['movingObstacle'],
  },
  {
    level: 6,
    mazeSize: [14, 14],
    complexity: 0.4,
    mechanics: ['portal', 'movingObstacle'],
  },
  {
    level: 7,
    mazeSize: [14, 14],
    complexity: 0.5,
    mechanics: ['keyDoor'],
  },
  {
    level: 8,
    mazeSize: [16, 16],
    complexity: 0.5,
    mechanics: ['portal', 'movingObstacle', 'keyDoor'],
  },
]

const TOTAL_LEVELS = LEVELS.length

export function getLevelConfig(level: number): LevelConfig {
  if (level <= TOTAL_LEVELS) {
    return LEVELS[level - 1]
  }
  // 超过预设关卡后，自动生成递增配置
  const size = Math.min(16 + (level - TOTAL_LEVELS) * 2, 30)
  const complexity = Math.min(0.5 + (level - TOTAL_LEVELS) * 0.05, 0.9)
  const allMechanics: MechanicType[] = [
    'portal',
    'movingObstacle',
    'keyDoor',
  ]
  return {
    level,
    mazeSize: [size, size],
    complexity,
    mechanics: allMechanics,
  }
}

export function getTotalLevels(): number {
  return TOTAL_LEVELS
}
