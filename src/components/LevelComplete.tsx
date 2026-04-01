import { useGameStore } from '../stores/gameStore'

export function LevelComplete() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const elapsedTime = useGameStore((s) => s.elapsedTime)
  const nextLevel = useGameStore((s) => s.nextLevel)
  const setPhase = useGameStore((s) => s.setPhase)

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = Math.floor(elapsedTime % 60)
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // 释放鼠标锁定
  if (document.pointerLockElement) {
    document.exitPointerLock()
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,16,0.9)',
      fontFamily: 'monospace',
      color: '#00f0ff',
      gap: 20,
      zIndex: 30,
    }}>
      <h2 style={{
        fontSize: 36,
        fontWeight: 300,
        letterSpacing: 6,
        textShadow: '0 0 20px rgba(0,240,255,0.5)',
        margin: 0,
      }}>
        关卡 {currentLevel} 完成
      </h2>
      <p style={{ color: 'rgba(0,240,255,0.7)', fontSize: 18, margin: 0 }}>
        用时 {timeStr}
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <button
          onClick={nextLevel}
          style={{
            padding: '12px 36px',
            background: 'rgba(0,240,255,0.1)',
            border: '1px solid rgba(0,240,255,0.5)',
            color: '#00f0ff',
            fontFamily: 'monospace',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 4,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,240,255,0.2)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,240,255,0.1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          下一关
        </button>
        <button
          onClick={() => setPhase('menu')}
          style={{
            padding: '12px 36px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 4,
            transition: 'all 0.3s',
          }}
        >
          返回菜单
        </button>
      </div>
    </div>
  )
}
