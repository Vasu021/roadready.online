import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import type { ScenarioPhase } from '../store/gameStore'

const FEEDBACK: Record<'passed' | 'failed', { heading: string; body: string }> = {
  passed: {
    heading: 'Well done!',
    body: 'You completed all objectives. Your control of the vehicle was correct.',
  },
  failed: {
    heading: 'Time\'s up',
    body: 'You ran out of time before completing all objectives. Try again — there\'s no rush.',
  },
}

export default function ResultsScreen() {
  const phase = useGameStore((s) => s.scenarioPhase) as ScenarioPhase
  const objectives = useGameStore((s) => s.objectives)
  const elapsed = useGameStore((s) => s.elapsedSeconds)
  const scenario = useGameStore((s) => s.activeScenario)
  const resetScenario = useGameStore((s) => s.resetScenario)
  const navigate = useNavigate()

  if (phase !== 'passed' && phase !== 'failed') return null

  const isPassed = phase === 'passed'
  const { heading, body } = FEEDBACK[phase]
  const mins = Math.floor(elapsed / 60)
  const secs = Math.floor(elapsed % 60)
  const completedCount = objectives.filter((o) => o.completed).length

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
        {/* Result badge */}
        <div className="mb-6 flex items-center gap-3">
          <span
            className={[
              'flex h-10 w-10 items-center justify-center rounded-full text-xl',
              isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400',
            ].join(' ')}
          >
            {isPassed ? '✓' : '✕'}
          </span>
          <div>
            <p className="text-lg font-bold text-white">{heading}</p>
            <p className="text-sm text-gray-400">{scenario?.name}</p>
          </div>
        </div>

        {/* Feedback text */}
        <p className="mb-6 text-sm leading-relaxed text-gray-300">{body}</p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-4">
          <div>
            <p className="text-xs text-gray-500">Objectives</p>
            <p className="font-mono text-lg font-semibold text-white">
              {completedCount} / {objectives.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-mono text-lg font-semibold text-white">
              {mins}:{secs.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Objective breakdown */}
        <ul className="mb-6 space-y-1.5">
          {objectives.map((obj) => (
            <li key={obj.id} className="flex items-center gap-2 text-sm">
              <span className={obj.completed ? 'text-emerald-400' : 'text-gray-600'}>
                {obj.completed ? '✓' : '○'}
              </span>
              <span className={obj.completed ? 'text-gray-300' : 'text-gray-600'}>
                {obj.description}
              </span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetScenario}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 rounded-lg border border-gray-700 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}
