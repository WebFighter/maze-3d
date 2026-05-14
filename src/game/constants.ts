export const CELL_SIZE = 2
export const WALL_HEIGHT = 3
export const BALL_RADIUS = 0.3
export const ACCEL_RATE = 10
export const DECEL_RATE = 8
export const JUMP_HEIGHT = WALL_HEIGHT * 0.85
export const JUMP_VELOCITY = Math.sqrt(2 * 9.8 * JUMP_HEIGHT)
export const CAMERA_OFFSET_Y = 4
export const CAMERA_OFFSET_Z = 6
export const MINIMAP_SIZE = 140
export const MINIMAP_SIZE_FPS = 180
export const FOG_NEAR = 5
export const FOG_FAR = 35
export const MAX_SPEED = 6
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
