import { useGameStore } from '../../stores/gameStore'

export function GameInfo() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const elapsedTime = useGameStore((s) => s.elapsedTime)

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = Math.floor(elapsedTime % 60)
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 48,
      background: 'linear-gradient(180deg, rgba(5,5,16,0.85) 0%, rgba(5,5,16,0) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      color: '#00f0ff',
      fontSize: 14,
      gap: 24,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <span>关卡 {currentLevel}</span>
      <span>{timeStr}</span>
    </div>
  )
}
