import { useMemo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '../../stores/gameStore'
import { CELL_SIZE } from '../constants'
import type { PortalPair } from '../../types'

function generatePortals(
  mazeRows: number,
  mazeCols: number,
  count: number
): PortalPair[] {
  const pairs: PortalPair[] = []
  for (let i = 0; i < count; i++) {
    const ar = 2 + Math.floor(Math.random() * (mazeRows - 4))
    const ac = 2 + Math.floor(Math.random() * (mazeCols - 4))
    let br = 2 + Math.floor(Math.random() * (mazeRows - 4))
    let bc = 2 + Math.floor(Math.random() * (mazeCols - 4))
    // 确保两个传送门有一定距离
    while (Math.abs(br - ar) + Math.abs(bc - ac) < 6) {
      br = 2 + Math.floor(Math.random() * (mazeRows - 4))
      bc = 2 + Math.floor(Math.random() * (mazeCols - 4))
    }
    pairs.push(
      { a: [ar, ac], b: [br, bc] },
    )
  }
  return pairs
}

function PortalMarker({ row, col, color }: { row: number; col: number; color: string }) {
  const x = col * CELL_SIZE
  const z = row * CELL_SIZE
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* 发光底座 */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.6, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

export function Portals() {
  const mazeData = useGameStore((s) => s.mazeData)
  const levelConfig = useGameStore((s) => s.levelConfig)

  const portals = useMemo(() => {
    if (!mazeData || !levelConfig || !levelConfig.mechanics.includes('portal')) return []
    const count = Math.max(1, Math.floor(levelConfig.mazeSize[0] / 5))
    return generatePortals(mazeData.rows, mazeData.cols, count)
  }, [mazeData, levelConfig])

  if (!mazeData || portals.length === 0) return null

  const portalColors = ['#bf00ff', '#ff6600', '#00ff88']

  return (
    <group>
      {portals.map((pair, i) => {
        const color = portalColors[i % portalColors.length]
        return (
          <group key={`portal-${i}`}>
            {/* 传送门 A → B */}
            <RigidBody
              type="fixed"
              sensor
              position={[pair.a[1] * CELL_SIZE, 1, pair.a[0] * CELL_SIZE]}
              onIntersectionEnter={() => {
                useGameStore.getState().setBallGridPos(pair.b)
              }}
            >
              <CuboidCollider args={[CELL_SIZE / 3, 1, CELL_SIZE / 3]} />
            </RigidBody>
            <PortalMarker row={pair.a[0]} col={pair.a[1]} color={color} />

            {/* 传送门 B → A */}
            <RigidBody
              type="fixed"
              sensor
              position={[pair.b[1] * CELL_SIZE, 1, pair.b[0] * CELL_SIZE]}
              onIntersectionEnter={() => {
                useGameStore.getState().setBallGridPos(pair.a)
              }}
            >
              <CuboidCollider args={[CELL_SIZE / 3, 1, CELL_SIZE / 3]} />
            </RigidBody>
            <PortalMarker row={pair.b[0]} col={pair.b[1]} color={color} />
          </group>
        )
      })}
    </group>
  )
}
