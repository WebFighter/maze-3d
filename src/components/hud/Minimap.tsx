import { useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MINIMAP_SIZE, MINIMAP_SIZE_FPS } from '../../game/constants'

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewMode = useGameStore((s) => s.viewMode)
  const mazeData = useGameStore((s) => s.mazeData)
  const ballGridPos = useGameStore((s) => s.ballGridPos)
  const visitedCells = useGameStore((s) => s.visitedCells)

  const size = viewMode === 'firstPerson' ? MINIMAP_SIZE_FPS : MINIMAP_SIZE

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !mazeData) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellPx = Math.floor(size / Math.max(mazeData.rows, mazeData.cols))
    const offsetW = (size - mazeData.cols * cellPx) / 2
    const offsetH = (size - mazeData.rows * cellPx) / 2

    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, size, size)

    for (let r = 0; r < mazeData.rows; r++) {
      for (let c = 0; c < mazeData.cols; c++) {
        if (!visitedCells.has(`${r},${c}`)) continue

        const x = offsetW + c * cellPx
        const y = offsetH + r * cellPx
        const cell = mazeData.grid[r][c]

        if (cell === 'wall') {
          ctx.fillStyle = '#1a1a3e'
          ctx.fillRect(x, y, cellPx, cellPx)
          ctx.strokeStyle = 'rgba(0,240,255,0.2)'
          ctx.lineWidth = 0.5
          ctx.strokeRect(x, y, cellPx, cellPx)
        } else if (cell === 'path') {
          ctx.fillStyle = '#0d0d2b'
          ctx.fillRect(x, y, cellPx, cellPx)
        } else if (cell === 'entrance') {
          ctx.fillStyle = 'rgba(0,255,136,0.4)'
          ctx.fillRect(x, y, cellPx, cellPx)
        } else if (cell === 'exit') {
          ctx.fillStyle = 'rgba(0,240,255,0.6)'
          ctx.fillRect(x, y, cellPx, cellPx)
        }
      }
    }

    // 绘制小球位置
    const bx = offsetW + ballGridPos[1] * cellPx + cellPx / 2
    const by = offsetH + ballGridPos[0] * cellPx + cellPx / 2
    ctx.fillStyle = '#ff0055'
    ctx.shadowColor = '#ff0055'
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.arc(bx, by, Math.max(cellPx / 2, 2), 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }, [mazeData, ballGridPos, visitedCells, size])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        border: '1px solid rgba(0,240,255,0.5)',
        boxShadow: '0 0 10px rgba(0,240,255,0.2)',
        borderRadius: 4,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}
