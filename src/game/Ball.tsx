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
import { BALL_RADIUS, MAX_SPEED, CELL_SIZE, ACCEL_RATE, DECEL_RATE, JUMP_VELOCITY } from './constants'
import * as THREE from 'three'

// 复用临时向量，避免每帧 GC 压力
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _inputDir = new THREE.Vector3()

export function Ball() {
  const ballRef = useRef<RapierRigidBody>(null)
  const skin = useGameStore((s) => s.skin)
  const viewMode = useGameStore((s) => s.viewMode)
  const mazeData = useGameStore((s) => s.mazeData)
  const setBallGridPos = useGameStore((s) => s.setBallGridPos)
  const setBallWorldPos = useGameStore((s) => s.setBallWorldPos)
  const revealNearbyCells = useGameStore((s) => s.revealNearbyCells)

  // 自己追踪水平速度，不回读物理引擎，避免反馈环路抖动
  const horizVel = useRef({ x: 0, z: 0 })

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

    // 根据相机方向计算移动方向（复用临时向量）
    _forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
    _forward.y = 0
    _forward.normalize()

    _right.set(1, 0, 0).applyQuaternion(camera.quaternion)
    _right.y = 0
    _right.normalize()

    // 计算输入方向的目标速度
    _inputDir.set(0, 0, 0)
    if (isMovingForward()) _inputDir.add(_forward)
    if (isMovingBackward()) _inputDir.sub(_forward)
    if (isMovingRight()) _inputDir.add(_right)
    if (isMovingLeft()) _inputDir.sub(_right)

    const hasInput = _inputDir.lengthSq() > 0
    const hv = horizVel.current

    if (hasInput) {
      _inputDir.normalize().multiplyScalar(MAX_SPEED)
      const t = 1 - Math.exp(-ACCEL_RATE * delta)
      hv.x += (_inputDir.x - hv.x) * t
      hv.z += (_inputDir.z - hv.z) * t
    } else {
      const t = Math.exp(-DECEL_RATE * delta)
      hv.x *= t
      hv.z *= t
    }

    // 写入物理引擎：水平速度自己控制，Y 轴交给物理重力
    ballRef.current.setLinvel(
      { x: hv.x, y: vel.y, z: hv.z },
      true
    )

    // 跳跃：着地时才能跳
    const isGrounded = vel.y > -0.1 && vel.y < 0.5 && pos.y <= BALL_RADIUS + 0.2
    if (consumeJump() && isGrounded) {
      const curVel = ballRef.current.linvel()
      ballRef.current.setLinvel(
        { x: curVel.x, y: JUMP_VELOCITY, z: curVel.z },
        true
      )
    }

    // 防止小球飞出地图
    if (pos.y < -5) {
      ballRef.current.setTranslation(
        { x: mazeData.entrance[1] * CELL_SIZE, y: BALL_RADIUS + 0.1, z: mazeData.entrance[0] * CELL_SIZE },
        true
      )
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      hv.x = 0
      hv.z = 0
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
      {/* 始终可见的轮廓光（不受墙壁深度遮挡） */}
      <mesh renderOrder={999} visible={viewMode === 'thirdPerson'}>
        <sphereGeometry args={[BALL_RADIUS * 1.3, 16, 16]} />
        <meshBasicMaterial
          color={skin.ball.material.emissive}
          transparent
          opacity={0.35}
          depthTest={false}
        />
      </mesh>
      <pointLight
        color={skin.ball.lightColor}
        intensity={skin.ball.lightIntensity}
        distance={12}
      />
    </RigidBody>
  )
}
