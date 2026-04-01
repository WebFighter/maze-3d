import { useGameStore } from '../stores/gameStore'

export function MainMenu() {
  const startLevel = useGameStore((s) => s.startLevel)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #050510 70%)',
      fontFamily: 'monospace',
      color: '#00f0ff',
      gap: 32,
    }}>
      <h1 style={{
        fontSize: 48,
        fontWeight: 300,
        letterSpacing: 8,
        textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)',
        margin: 0,
      }}>
        MAZE 3D
      </h1>
      <p style={{ color: 'rgba(0,240,255,0.5)', fontSize: 14, margin: 0 }}>
        赛博朋克迷宫探险
      </p>
      <button
        onClick={() => startLevel(1)}
        style={{
          padding: '14px 48px',
          background: 'rgba(0,240,255,0.1)',
          border: '1px solid rgba(0,240,255,0.5)',
          color: '#00f0ff',
          fontFamily: 'monospace',
          fontSize: 16,
          cursor: 'pointer',
          borderRadius: 4,
          transition: 'all 0.3s',
          textTransform: 'uppercase',
          letterSpacing: 4,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,240,255,0.2)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0,240,255,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,240,255,0.1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        开始游戏
      </button>
      <div style={{ color: 'rgba(0,240,255,0.3)', fontSize: 12, marginTop: 24 }}>
        WASD 移动 | 鼠标转向 | V 切换视角
      </div>
    </div>
  )
}
