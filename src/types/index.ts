export type CellType = 'wall' | 'path' | 'entrance' | 'exit'

export interface MazeData {
  grid: CellType[][]
  rows: number
  cols: number
  entrance: [number, number]
  exit: [number, number]
}

export type MechanicType = 'portal' | 'movingObstacle' | 'keyDoor'

export interface LevelConfig {
  level: number
  mazeSize: [number, number]
  complexity: number
  mechanics: MechanicType[]
  timeLimit?: number
}

export type ViewMode = 'thirdPerson' | 'firstPerson'
export type GamePhase = 'menu' | 'playing' | 'paused' | 'levelComplete'

export interface SkinConfig {
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

export interface PortalPair {
  a: [number, number]
  b: [number, number]
}
