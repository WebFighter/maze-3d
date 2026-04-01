type KeyState = Map<string, boolean>

const keys: KeyState = new Map()
let mouseDeltaX = 0
let mouseDeltaY = 0
let initialized = false

function onKeyDown(e: KeyboardEvent) {
  keys.set(e.code, true)
}

function onKeyUp(e: KeyboardEvent) {
  keys.set(e.code, false)
}

function onMouseMove(e: MouseEvent) {
  if (document.pointerLockElement) {
    mouseDeltaX += e.movementX
    mouseDeltaY += e.movementY
  }
}

export function initInputManager() {
  if (initialized) return
  initialized = true
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('mousemove', onMouseMove)
}

export function cleanupInputManager() {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('mousemove', onMouseMove)
  keys.clear()
  initialized = false
}

export function isPressed(code: string): boolean {
  return keys.get(code) === true
}

export function isMovingForward(): boolean {
  return isPressed('KeyW') || isPressed('ArrowUp')
}

export function isMovingBackward(): boolean {
  return isPressed('KeyS') || isPressed('ArrowDown')
}

export function isMovingLeft(): boolean {
  return isPressed('KeyA') || isPressed('ArrowLeft')
}

export function isMovingRight(): boolean {
  return isPressed('KeyD') || isPressed('ArrowRight')
}

export function consumeMouseDelta(): { dx: number; dy: number } {
  const dx = mouseDeltaX
  const dy = mouseDeltaY
  mouseDeltaX = 0
  mouseDeltaY = 0
  return { dx, dy }
}
