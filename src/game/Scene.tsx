import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { Maze } from './Maze'
import { Ball } from './Ball'
import { CameraController } from './Camera'
import { FOG_NEAR, FOG_FAR } from './constants'

export function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} color="#4444ff" />
      <directionalLight
        position={[30, 40, 20]}
        intensity={0.6}
        color="#ffe8c0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <fog attach="fog" args={['#050510', FOG_NEAR, FOG_FAR]} />
      <Physics gravity={[0, -9.8, 0]} interpolate>
        <Maze />
        <Ball />
        <CameraController />
      </Physics>
      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export function GameCanvas() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 200 }}
      style={{ background: '#050510' }}
      gl={{ antialias: true }}
    >
      <Scene />
    </Canvas>
  )
}
