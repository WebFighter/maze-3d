import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { consumeMouseDelta, requestJump } from '../systems/inputManager'
import {
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
  BALL_RADIUS,
} from './constants'
import * as THREE from 'three'

export function CameraController() {
  const { camera } = useThree()
  const viewMode = useGameStore((s) => s.viewMode)
  const yaw = useRef(0)
  const pitch = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') {
        useGameStore.getState().toggleViewMode()
      }
      if (e.code === 'KeyR') {
        useGameStore.getState().startLevel(useGameStore.getState().currentLevel)
      }
      if (e.code === 'Space') {
        requestJump()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useFrame((_, delta) => {
    const state = useGameStore.getState()
    if (state.phase !== 'playing') return

    const { dx, dy } = consumeMouseDelta()
    yaw.current -= dx * 0.002
    pitch.current = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, pitch.current - dy * 0.002)
    )

    const [targetX, targetY, targetZ] = state.ballWorldPos

    if (viewMode === 'thirdPerson') {
      const distance = CAMERA_OFFSET_Z
      const height = CAMERA_OFFSET_Y

      const camX = targetX + Math.sin(yaw.current) * distance
      const camY = targetY + height + Math.sin(pitch.current) * distance * 0.3
      const camZ = targetZ + Math.cos(yaw.current) * distance

      if (!initialized.current) {
        camera.position.set(camX, camY, camZ)
        initialized.current = true
      } else {
        const t = 1 - Math.exp(-5 * delta)
        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), t)
      }
      camera.lookAt(targetX, targetY, targetZ)
    } else {
      const heightOffset = BALL_RADIUS + 0.3
      camera.position.set(targetX, targetY + heightOffset, targetZ)

      const lookDistance = 5
      const lookX = targetX - Math.sin(yaw.current) * lookDistance
      const lookY = targetY + heightOffset + Math.sin(pitch.current) * lookDistance
      const lookZ = targetZ - Math.cos(yaw.current) * lookDistance
      camera.lookAt(lookX, lookY, lookZ)

      if (!initialized.current) {
        initialized.current = true
      }
    }
  })

  return null
}
