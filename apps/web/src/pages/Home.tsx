import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Difficulty, ScenarioConfig } from '@roadready/shared'
import { getAllScenarios, getScenario } from '../simulation/scenarios'
import { api } from '../utils/api'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: 'bg-emerald-900/50 text-emerald-400',
  easy: 'bg-blue-900/50 text-blue-400',
  medium: 'bg-amber-900/50 text-amber-400',
  hard: 'bg-red-900/50 text-red-400',
}

export default function Home() {
  const user = useUserStore((s) => s.user)
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal)

  const [scenarios, setScenarios] = useState<ScenarioConfig[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch scenario list from the API; fall back to local registry if unavailable
  useEffect(() => {
    api.scenarios
      .list()
      .then(setScenarios)
      .catch(() => setScenarios(getAllScenarios().map((d) => d.config)))
      .finally(() => setLoading(false))
  }, [])

  // Scenarios with a local simulation definition are playable; others are locked
  const available = scenarios.filter((s) => !!getScenario(s.id))
  const locked = scenarios.filter((s) => !getScenario(s.id))

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800/60 px-8 py-5">
        <span className="text-xl font-bold tracking-tight">RoadReady</span>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-400 transition hover:text-white">
            My Progress →
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Sign In
            </button>
          )}
        </div>
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

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : (
            <ul className="space-y-3">
              {/* Playable scenarios */}
              {available.map((config) => (
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

              {/* Locked / coming soon */}
              {locked.map((config) => (
                <li key={config.id}>
                  <div className="flex cursor-not-allowed items-center justify-between rounded-xl border border-gray-800/40 bg-gray-900/30 px-6 py-5 opacity-50">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{config.name}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[config.difficulty]}`}
                        >
                          {config.difficulty}
                        </span>
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                          Coming soon
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{config.description}</p>
                    </div>
                    <span className="ml-4 text-gray-700">🔒</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
