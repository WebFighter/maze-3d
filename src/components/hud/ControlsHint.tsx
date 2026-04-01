export function ControlsHint() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
      background: 'linear-gradient(0deg, rgba(5,5,16,0.85) 0%, rgba(5,5,16,0) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      color: 'rgba(0,240,255,0.35)',
      fontSize: 11,
      gap: 20,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <span>WASD / 方向键 移动</span>
      <span>鼠标 转向</span>
      <span>V 切换视角</span>
      <span>R 重置</span>
    </div>
  )
}
