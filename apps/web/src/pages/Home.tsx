import { Link } from 'react-router-dom'
import type { Difficulty } from '@roadready/shared'
import { getAllScenarios } from '../simulation/scenarios'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: 'bg-emerald-900/50 text-emerald-400',
  easy: 'bg-blue-900/50 text-blue-400',
  medium: 'bg-amber-900/50 text-amber-400',
  hard: 'bg-red-900/50 text-red-400',
}

// Scenarios not yet implemented shown as locked placeholders
const UPCOMING = [
  {
    id: 'intersection-rechts-vor-links',
    name: 'Rechts vor Links',
    description: 'Practice right-of-way at unmarked intersections.',
    difficulty: 'easy' as Difficulty,
  },
  {
    id: 'roundabout',
    name: 'Roundabout',
    description: 'Learn correct entry, navigation, and exit technique.',
    difficulty: 'medium' as Difficulty,
  },
]

export default function Home() {
  const available = getAllScenarios()

  return (
    <div className="flex min-h-full flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800/60 px-8 py-5">
        <span className="text-xl font-bold tracking-tight">RoadReady</span>
        <Link to="/dashboard" className="text-sm text-gray-400 transition hover:text-white">
          My Progress →
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-8 py-16">
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Learn to drive in 3D</h1>
          <p className="mt-4 text-lg text-gray-400">
            Practice German traffic rules in a realistic Aachen environment
          </p>
        </div>

        <section className="w-full max-w-3xl">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Scenarios
          </h2>
          <ul className="space-y-3">
            {/* Available scenarios from registry */}
            {available.map(({ config }) => (
              <li key={config.id}>
                <Link
                  to={`/simulation/${config.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-5 transition hover:border-gray-600 hover:bg-gray-900"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{config.name}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[config.difficulty]}`}
                      >
                        {config.difficulty}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{config.description}</p>
                  </div>
                  <span className="ml-4 text-gray-600">→</span>
                </Link>
              </li>
            ))}

            {/* Upcoming / locked */}
            {UPCOMING.map((s) => (
              <li key={s.id}>
                <div className="flex cursor-not-allowed items-center justify-between rounded-xl border border-gray-800/40 bg-gray-900/30 px-6 py-5 opacity-50">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{s.name}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[s.difficulty]}`}
                      >
                        {s.difficulty}
                      </span>
                      <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                        Coming soon
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                  </div>
                  <span className="ml-4 text-gray-700">🔒</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
