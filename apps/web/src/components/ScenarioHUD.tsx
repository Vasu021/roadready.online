import { useGameStore } from '../store/gameStore'

export default function ScenarioHUD() {
  const scenario = useGameStore((s) => s.activeScenario)
  const objectives = useGameStore((s) => s.objectives)
  const elapsed = useGameStore((s) => s.elapsedSeconds)
  const phase = useGameStore((s) => s.scenarioPhase)

  if (!scenario || phase === 'idle') return null

  const remaining = Math.max(0, scenario.timeLimit - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = Math.floor(remaining % 60)
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
  const timerWarn = remaining < 20

  return (
    <div className="absolute left-4 top-16 w-60 rounded-xl bg-black/55 p-4 backdrop-blur">
      {/* Scenario name */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {scenario.name}
      </p>

      {/* Objectives */}
      <ul className="space-y-2">
        {objectives.map((obj, i) => {
          const prevDone = i === 0 || objectives[i - 1].completed
          const active = prevDone && !obj.completed
          return (
            <li key={obj.id} className="flex items-start gap-2.5">
              {/* Status icon */}
              <span
                className={[
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]',
                  obj.completed
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'border border-blue-400 text-blue-400'
                      : 'border border-gray-600 text-gray-600',
                ].join(' ')}
              >
                {obj.completed ? '✓' : i + 1}
              </span>
              <span
                className={[
                  'text-sm leading-snug',
                  obj.completed
                    ? 'text-emerald-400 line-through decoration-emerald-600'
                    : active
                      ? 'text-white'
                      : 'text-gray-600',
                ].join(' ')}
              >
                {obj.description}
              </span>
            </li>
          )
        })}
      </ul>

      {/* Timer */}
      <div
        className={[
          'mt-4 border-t pt-3 text-right font-mono text-sm font-semibold tabular-nums',
          timerWarn ? 'border-red-800 text-red-400' : 'border-gray-700 text-gray-400',
        ].join(' ')}
      >
        {timeStr}
      </div>
    </div>
  )
}
