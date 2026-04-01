import { useGameStore } from '../../stores/gameStore'

export function ViewToggle() {
  const viewMode = useGameStore((s) => s.viewMode)
  const toggleViewMode = useGameStore((s) => s.toggleViewMode)

  return (
    <div
      onClick={toggleViewMode}
      style={{
        position: 'absolute',
        bottom: 48,
        right: 16,
        padding: '6px 14px',
        background: 'rgba(13,13,43,0.85)',
        border: '1px solid rgba(0,240,255,0.4)',
        color: '#00f0ff',
        fontFamily: 'monospace',
        fontSize: 12,
        cursor: 'pointer',
        borderRadius: 4,
        zIndex: 10,
        userSelect: 'none',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 10px rgba(0,240,255,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {viewMode === 'thirdPerson' ? '第三视角' : '第一视角'}
    </div>
  )
}
