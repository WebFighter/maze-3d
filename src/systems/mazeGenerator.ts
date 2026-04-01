import type { MazeData, CellType } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateMaze(
  pathRows: number,
  pathCols: number,
  complexity: number
): MazeData {
  const rows = pathRows * 2 + 1
  const cols = pathCols * 2 + 1

  const grid: CellType[][] = Array.from({ length: rows }, () =>
    Array(cols).fill('wall' as CellType)
  )

  // 入口（左侧墙壁开口）
  grid[1][0] = 'entrance'

  // 用递归回溯算法打通迷宫
  const visited = Array.from({ length: pathRows }, () =>
    Array(pathCols).fill(false)
  )
  const directions = [
    [0, 2],
    [0, -2],
    [2, 0],
    [-2, 0],
  ]

  function carve(r: number, c: number) {
    const pr = (r - 1) / 2
    const pc = (c - 1) / 2
    visited[pr][pc] = true
    grid[r][c] = 'path'

    for (const [dr, dc] of shuffle(directions)) {
      const nr = r + dr
      const nc = c + dc
      const npr = (nr - 1) / 2
      const npc = (nc - 1) / 2

      if (
        nr > 0 &&
        nr < rows - 1 &&
        nc > 0 &&
        nc < cols - 1 &&
        !visited[npr][npc]
      ) {
        grid[r + dr / 2][c + dc / 2] = 'path'
        carve(nr, nc)
      }
    }
  }

  carve(1, 1)

  // 出口（右侧墙壁开口）
  grid[rows - 2][cols - 1] = 'exit'

  // 根据复杂度参数移除额外墙壁，增加可选路径
  const extraPaths = Math.floor(complexity * pathRows * pathCols * 0.3)
  let added = 0
  let attempts = 0
  while (added < extraPaths && attempts < extraPaths * 10) {
    attempts++
    const r = 1 + Math.floor(Math.random() * (rows - 2))
    const c = 1 + Math.floor(Math.random() * (cols - 2))
    if (grid[r][c] === 'wall') {
      const neighbors: CellType[] = []
      if (r > 0) neighbors.push(grid[r - 1][c])
      if (r < rows - 1) neighbors.push(grid[r + 1][c])
      if (c > 0) neighbors.push(grid[r][c - 1])
      if (c < cols - 1) neighbors.push(grid[r][c + 1])
      const pathCount = neighbors.filter((n) => n !== 'wall').length
      if (pathCount >= 2) {
        grid[r][c] = 'path'
        added++
      }
    }
  }

  return {
    grid,
    rows,
    cols,
    entrance: [1, 0],
    exit: [rows - 2, cols - 1],
  }
}
