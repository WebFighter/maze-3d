import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { initInputManager, cleanupInputManager } from '../systems/inputManager'
import { GameCanvas } from '../game/Scene'
import { GameInfo } from './hud/GameInfo'
import { Minimap } from './hud/Minimap'
import { ControlsHint } from './hud/ControlsHint'
import { ViewToggle } from './hud/ViewToggle'

export function Game() {
  const phase = useGameStore((s) => s.phase)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initInputManager()
    return () => cleanupInputManager()
  }, [])

  const handleClick = () => {
    if (containerRef.current && phase === 'playing') {
      const canvas = containerRef.current.querySelector('canvas')
      if (canvas) {
        canvas.requestPointerLock()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <GameCanvas />
      {phase === 'playing' && (
        <>
          <GameInfo />
          <Minimap />
          <ControlsHint />
          <ViewToggle />
          <ClickToPlay />
        </>
      )}
    </div>
  )
}

function ClickToPlay() {
  const [isLocked, setIsLocked] = useState(document.pointerLockElement !== null)

  useEffect(() => {
    const onLockChange = () => {
      setIsLocked(document.pointerLockElement !== null)
    }
    document.addEventListener('pointerlockchange', onLockChange)
    return () => document.removeEventListener('pointerlockchange', onLockChange)
  }, [])

  if (isLocked) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#00f0ff',
      fontFamily: 'monospace',
      fontSize: 16,
      pointerEvents: 'none',
      zIndex: 20,
      textAlign: 'center',
      textShadow: '0 0 10px rgba(0,240,255,0.5)',
    }}>
      点击画面开始控制
    </div>
  )
}
