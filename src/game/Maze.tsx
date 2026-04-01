import { useMemo, useRef, useEffect } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '../stores/gameStore'
import { CELL_SIZE, WALL_HEIGHT } from './constants'
import * as THREE from 'three'

export function Maze() {
  const mazeData = useGameStore((s) => s.mazeData)
  const skin = useGameStore((s) => s.skin)
  const completeLevel = useGameStore((s) => s.completeLevel)

  const walls = useMemo(() => {
    if (!mazeData) return []
    const result: { x: number; z: number; key: string }[] = []
    for (let r = 0; r < mazeData.rows; r++) {
      for (let c = 0; c < mazeData.cols; c++) {
        if (mazeData.grid[r][c] === 'wall') {
          result.push({
            x: c * CELL_SIZE,
            z: r * CELL_SIZE,
            key: `${r}-${c}`,
          })
        }
      }
    }
    return result
  }, [mazeData])

  const exitPos = useMemo(() => {
    if (!mazeData) return null
    const [er, ec] = mazeData.exit
    return { x: ec * CELL_SIZE, z: er * CELL_SIZE }
  }, [mazeData])

  const entrancePos = useMemo(() => {
    if (!mazeData) return null
    const [er, ec] = mazeData.entrance
    return { x: ec * CELL_SIZE, z: er * CELL_SIZE }
  }, [mazeData])

  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current || walls.length === 0) return
    const dummy = new THREE.Object3D()
    walls.forEach((wall, i) => {
      dummy.position.set(wall.x, WALL_HEIGHT / 2, wall.z)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [walls])

  if (!mazeData) return null

  const floorWidth = mazeData.cols * CELL_SIZE
  const floorDepth = mazeData.rows * CELL_SIZE

  return (
    <group>
      {/* 墙壁碰撞体 */}
      <RigidBody type="fixed" colliders={false} name="walls">
        {walls.map((wall) => (
          <CuboidCollider
            key={wall.key}
            args={[CELL_SIZE / 2, WALL_HEIGHT / 2, CELL_SIZE / 2]}
            position={[wall.x, WALL_HEIGHT / 2, wall.z]}
          />
        ))}
      </RigidBody>

      {/* 墙壁渲染（InstancedMesh 高效绘制） */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, walls.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CELL_SIZE, WALL_HEIGHT, CELL_SIZE]} />
        <meshStandardMaterial
          color={skin.maze.wallColor}
          emissive={skin.maze.wallEmissive}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.3}
        />
      </instancedMesh>

      {/* 地面 */}
      <RigidBody type="fixed" name="floor">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[floorWidth / 2 - CELL_SIZE / 2, 0, floorDepth / 2 - CELL_SIZE / 2]}
          receiveShadow
        >
          <planeGeometry args={[floorWidth, floorDepth]} />
          <meshStandardMaterial
            color={skin.maze.floorColor}
            metalness={0.5}
            roughness={0.8}
          />
        </mesh>
      </RigidBody>

      {/* 地面网格线 */}
      <GridLines
        width={floorWidth}
        depth={floorDepth}
        offsetX={-CELL_SIZE / 2}
        offsetZ={-CELL_SIZE / 2}
        color={skin.maze.glowColor}
      />

      {/* 入口标记 */}
      {entrancePos && (
        <mesh position={[entrancePos.x, 0.02, entrancePos.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 出口传感器 */}
      {exitPos && (
        <RigidBody
          type="fixed"
          sensor
          position={[exitPos.x, 0.5, exitPos.z]}
          onIntersectionEnter={() => completeLevel()}
        >
          <CuboidCollider args={[CELL_SIZE / 2, 1, CELL_SIZE / 2]} />
        </RigidBody>
      )}

      {/* 出口标记 */}
      {exitPos && (
        <mesh position={[exitPos.x, 0.02, exitPos.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  )
}

function GridLines({
  width,
  depth,
  offsetX,
  offsetZ,
  color,
}: {
  width: number
  depth: number
  offsetX: number
  offsetZ: number
  color: string
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const step = CELL_SIZE

    for (let x = 0; x <= width; x += step) {
      pts.push(new THREE.Vector3(x + offsetX, 0.01, offsetZ))
      pts.push(new THREE.Vector3(x + offsetX, 0.01, depth + offsetZ))
    }
    for (let z = 0; z <= depth; z += step) {
      pts.push(new THREE.Vector3(offsetX, 0.01, z + offsetZ))
      pts.push(new THREE.Vector3(width + offsetX, 0.01, z + offsetZ))
    }
    return pts
  }, [width, depth, offsetX, offsetZ])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          count={points.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </lineSegments>
  )
}
