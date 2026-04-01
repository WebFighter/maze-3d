import { useGameStore } from './stores/gameStore'
import { MainMenu } from './components/MainMenu'
import { Game } from './components/Game'
import { LevelComplete } from './components/LevelComplete'

function App() {
  const phase = useGameStore((s) => s.phase)

  if (phase === 'menu') {
    return <MainMenu />
  }

  return (
    <div style={{ position: 'relative' }}>
      <Game />
      {phase === 'levelComplete' && <LevelComplete />}
    </div>
  )
}

export default App
