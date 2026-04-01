import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '../stores/gameStore'
import {
  isMovingForward,
  isMovingBackward,
  isMovingLeft,
  isMovingRight,
  consumeJump,
} from '../systems/inputManager'
import { BALL_RADIUS, FORCE_MULTIPLIER, CELL_SIZE, HORIZONTAL_DAMPING, JUMP_VELOCITY } from './constants'
import * as THREE from 'three'

export function Ball() {
  const ballRef = useRef<RapierRigidBody>(null)
  const skin = useGameStore((s) => s.skin)
  const viewMode = useGameStore((s) => s.viewMode)
  const mazeData = useGameStore((s) => s.mazeData)
  const setBallGridPos = useGameStore((s) => s.setBallGridPos)
  const setBallWorldPos = useGameStore((s) => s.setBallWorldPos)
  const revealNearbyCells = useGameStore((s) => s.revealNearbyCells)

  useFrame(({ camera }, delta) => {
    if (!ballRef.current || !mazeData) return

    const pos = ballRef.current.translation()
    const vel = ballRef.current.linvel()

    // 更新小球网格位置（用于小地图）
    const gridCol = Math.round(pos.x / CELL_SIZE)
    const gridRow = Math.round(pos.z / CELL_SIZE)
    setBallGridPos([gridRow, gridCol])
    setBallWorldPos([pos.x, pos.y, pos.z])
    revealNearbyCells(gridRow, gridCol, 3)

    // 水平阻尼：只对 XZ 施加，Y 轴交给纯物理重力
    const dampFactor = Math.exp(-HORIZONTAL_DAMPING * delta)
    ballRef.current.setLinvel(
      { x: vel.x * dampFactor, y: vel.y, z: vel.z * dampFactor },
      true
    )

    // 根据输入施加水平力
    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyQuaternion(camera.quaternion)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3(1, 0, 0)
    right.applyQuaternion(camera.quaternion)
    right.y = 0
    right.normalize()

    const force = new THREE.Vector3(0, 0, 0)
    if (isMovingForward()) force.add(forward)
    if (isMovingBackward()) force.sub(forward)
    if (isMovingRight()) force.add(right)
    if (isMovingLeft()) force.sub(right)

    if (force.lengthSq() > 0) {
      force.normalize().multiplyScalar(FORCE_MULTIPLIER)
      ballRef.current.applyImpulse(
        { x: force.x, y: 0, z: force.z },
        true
      )
    }

    // 跳跃：着地时才能跳，初始速度由 v=sqrt(2gh) 计算，物理重力自然减速
    const isGrounded = vel.y > -0.1 && vel.y < 0.5 && pos.y <= BALL_RADIUS + 0.2
    if (consumeJump() && isGrounded) {
      const curVel = ballRef.current.linvel()
      ballRef.current.setLinvel(
        { x: curVel.x, y: JUMP_VELOCITY, z: curVel.z },
        true
      )
    }

    // 防止小球飞出去
    if (pos.y < -5) {
      ballRef.current.setTranslation(
        { x: mazeData.entrance[1] * CELL_SIZE, y: BALL_RADIUS + 0.1, z: mazeData.entrance[0] * CELL_SIZE },
        true
      )
    }
  })

  // 起始位置：入口内侧第一个路径格
  const startPos = mazeData
    ? [1 * CELL_SIZE, BALL_RADIUS + 0.1, 1 * CELL_SIZE]
    : [0, BALL_RADIUS + 0.1, 0]

  return (
    <RigidBody
      ref={ballRef}
      position={startPos as [number, number, number]}
      colliders={false}
      linearDamping={0}
      angularDamping={4}
      ccd
      name="ball"
      enabledRotations={[true, true, true]}
    >
      <BallCollider args={[BALL_RADIUS]} restitution={0.3} friction={0.8} />
      <mesh castShadow visible={viewMode === 'thirdPerson'}>
        <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color={skin.ball.material.color}
          emissive={skin.ball.material.emissive}
          emissiveIntensity={skin.ball.material.emissiveIntensity}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <pointLight
        color={skin.ball.lightColor}
        intensity={skin.ball.lightIntensity}
        distance={12}
        castShadow
      />
    </RigidBody>
  )
}
