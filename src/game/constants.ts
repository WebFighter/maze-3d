export const CELL_SIZE = 2
export const WALL_HEIGHT = 3
export const BALL_RADIUS = 0.3
export const FORCE_MULTIPLIER = 0.15
export const CAMERA_OFFSET_Y = 6
export const CAMERA_OFFSET_Z = 10
export const MINIMAP_SIZE = 140
export const MINIMAP_SIZE_FPS = 180
export const FOG_NEAR = 5
export const FOG_FAR = 35
export const EXPLORE_RADIUS = 3

export const DEFAULT_SKIN = {
  ball: {
    geometry: 'sphere' as const,
    material: {
      color: '#ff0055',
      emissive: '#ff0055',
      emissiveIntensity: 2,
    },
    lightColor: '#ff0055',
    lightIntensity: 5,
  },
  maze: {
    wallColor: '#1a1a3e',
    wallEmissive: '#0a0a2a',
    floorColor: '#0a0a1a',
    glowColor: '#00f0ff',
  },
}
