import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import SimulationScene from '../simulation/scene'
import ScenarioHUD from '../components/ScenarioHUD'
import ResultsScreen from '../components/ResultsScreen'
import { getScenario } from '../simulation/scenarios'

export default function Simulation() {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const carState = useGameStore((s) => s.carState)
  const isPaused = useGameStore((s) => s.isPaused)
  const setPaused = useGameStore((s) => s.setPaused)
  const startScenario = useGameStore((s) => s.startScenario)

  // Load scenario config into the store once on mount
  useEffect(() => {
    if (!scenarioId) return
    const def = getScenario(scenarioId)
    if (def) startScenario(def.config)
  }, [scenarioId, startScenario])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-900">
      <SimulationScene scenarioId={scenarioId} debug={import.meta.env.DEV} />

      {/* Objectives + timer */}
      <ScenarioHUD />

      {/* Pass / fail modal */}
      <ResultsScreen />

      {/* Top-left controls */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Link
          to="/"
          className="rounded bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-black/70"
        >
          ← Exit
        </Link>
        <button
          onClick={() => setPaused(!isPaused)}
          className="rounded bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-black/70"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Speed — bottom centre */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="rounded-xl bg-black/50 px-6 py-3 text-center backdrop-blur">
          <span className="font-mono text-3xl font-bold text-white">
            {carState?.velocity ?? 0}
          </span>
          <span className="ml-1 text-sm text-gray-400">km/h</span>
        </div>
      </div>

      {/* Controls hint — bottom right */}
      <div className="absolute bottom-6 right-4 rounded-xl bg-black/50 px-4 py-3 text-xs text-gray-400 backdrop-blur">
        <p>W / ↑ &nbsp; Accelerate</p>
        <p>S / ↓ &nbsp; Brake</p>
        <p>A D / ← → &nbsp; Steer</p>
        <p>Space &nbsp; Handbrake</p>
        <p>R &nbsp; Reset</p>
      </div>
    </div>
  )
}
