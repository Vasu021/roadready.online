import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import type { CountryRow, CountryScenariosResponse, ScenarioRow } from '../utils/api'
import { useUserStore } from '../store/userStore'
import type { ProgressStatus } from '../store/userStore'

// ── State A: Landing Page (logged out) ────────────────────────────────────────

function LandingPage() {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal)

  return (
    <div className="flex min-h-full flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800/60 px-8 py-5">
        <span className="text-xl font-bold tracking-tight">RoadReady</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAuthModal(true, 'login')}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowAuthModal(true, 'register')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started — It's Free
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center px-8 py-24 text-center">
          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight">
            Learn Traffic Rules. Pass Your Test.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-400">
            Practice country-specific driving rules through interactive 3D simulations.
            No downloads. No instructor needed.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowAuthModal(true, 'register')}
              className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-500"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => setShowAuthModal(true, 'login')}
              className="rounded-xl border border-gray-700 px-6 py-3 text-base text-gray-300 transition hover:bg-gray-800"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-900/40 px-8 py-16">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: '🌍', title: 'Multiple Countries', desc: 'Germany, France, and more coming soon. Learn the rules for your country.' },
              { icon: '🚗', title: '3D Simulations', desc: 'Drive through realistic city environments directly in your browser. No install required.' },
              { icon: '📊', title: 'Track Progress', desc: 'See your scores and completion across every scenario and test.' },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-8 text-center"
              >
                <div className="mb-3 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-8 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-2xl font-bold">How it works</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { step: '1', title: 'Choose your country', desc: 'Pick from Germany, France, and more.' },
                { step: '2', title: 'Practice scenarios', desc: 'Drive through each scenario and answer MCQ questions.' },
                { step: '3', title: 'Take the test', desc: 'Complete the full theory test and get your grade.' },
              ].map((h) => (
                <div key={h.step} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                    {h.step}
                  </div>
                  <h3 className="mb-1 font-semibold">{h.title}</h3>
                  <p className="text-sm text-gray-400">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800/60 px-8 py-6 text-center text-sm text-gray-500">
        roadready.online — Built in Aachen 🇩🇪
      </footer>
    </div>
  )
}

// ── State B: Country Selection (logged in, no country chosen) ─────────────────

function CountrySelect() {
  const user = useUserStore((s) => s.user)
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry)
  const setScenarioProgress = useUserStore((s) => s.setScenarioProgress)
  const logout = useUserStore((s) => s.logout)

  const [countries, setCountries] = useState<CountryRow[]>([])
  // Store the full country object so handleContinue never needs countries.find()
  const [chosenCountry, setChosenCountry] = useState<CountryRow | null>(null)
  const [facts, setFacts] = useState<string | null>(null)
  const [loadingFacts, setLoadingFacts] = useState(false)
  const [continuing, setContinuing] = useState(false)
  const [continueError, setContinueError] = useState<string | null>(null)

  useEffect(() => {
    api.countries
      .list()
      .then((list) => {
        setCountries(list)
        if (list.length > 0) setChosenCountry(list[0])
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!chosenCountry) return
    setLoadingFacts(true)
    setFacts(null)
    api.countries
      .facts(chosenCountry.code)
      .then((r) => setFacts(r.facts))
      .catch(() => setFacts(null))
      .finally(() => setLoadingFacts(false))
  }, [chosenCountry])

  async function handleContinue() {
    if (!chosenCountry || !user) return
    setContinuing(true)
    setContinueError(null)
    try {
      await api.userCountryAccess.record(chosenCountry.code)

      const progressRows = await api.scenarios.progress(user.id, chosenCountry.code)
      const progressMap: Record<string, ProgressStatus> = {}
      for (const row of progressRows) {
        progressMap[row.scenarioId] = row.status
      }
      setScenarioProgress(progressMap)
      // setSelectedCountry MUST be last — it triggers the render switch to State C
      setSelectedCountry({
        id: chosenCountry.id,
        code: chosenCountry.code,
        name: chosenCountry.name,
        flagEmoji: chosenCountry.flagEmoji,
      })
    } catch (err) {
      console.error('Failed to continue:', err)
      setContinueError('Something went wrong. Check the console and try again.')
    } finally {
      setContinuing(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800/60 px-8 py-5">
        <span className="text-xl font-bold tracking-tight">RoadReady</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-8 py-20">
        <div className="w-full max-w-lg">
          <h1 className="mb-8 text-center text-3xl font-bold">Where are you learning to drive?</h1>

          <label className="mb-1 block text-sm font-medium text-gray-400" htmlFor="country-select">
            Select a country
          </label>
          <select
            id="country-select"
            value={chosenCountry?.code ?? ''}
            onChange={(e) => {
              const found = countries.find((c) => c.code === e.target.value)
              if (found) setChosenCountry(found)
            }}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-base text-white focus:border-blue-500 focus:outline-none"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </select>

          {/* Facts panel */}
          <div className="mt-6 min-h-[100px] rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-5">
            {loadingFacts ? (
              <div className="flex h-16 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : facts ? (
              <div
                className="prose prose-sm prose-invert max-w-none text-gray-300 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: facts }}
              />
            ) : (
              <p className="text-sm text-gray-500">No information available for this country.</p>
            )}
          </div>

          {continueError && (
            <p className="mt-3 text-sm text-red-400">{continueError}</p>
          )}

          <button
            onClick={handleContinue}
            disabled={!chosenCountry || continuing}
            className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {continuing ? 'Loading...' : 'Continue →'}
          </button>
        </div>
      </main>
    </div>
  )
}

// ── State C: Scenario List (logged in, country selected) ─────────────────────

function ScenarioList() {
  const user = useUserStore((s) => s.user)
  const selectedCountry = useUserStore((s) => s.selectedCountry)
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry)
  const isPremium = useUserStore((s) => s.isPremium)
  const setIsPremium = useUserStore((s) => s.setIsPremium)
  const scenarioProgress = useUserStore((s) => s.scenarioProgress)
  const logout = useUserStore((s) => s.logout)

  const [data, setData] = useState<CountryScenariosResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedCountry) return
    setLoading(true)
    api.countries
      .scenarios(selectedCountry.code)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCountry])

  function isUnlocked(scenario: ScenarioRow): boolean {
    if (isPremium) return true
    return scenario.order <= 3
  }

  function isCompleted(scenario: ScenarioRow): boolean {
    return scenarioProgress[scenario.id] === 'COMPLETED'
  }

  const isDev = import.meta.env.DEV

  return (
    <div className="flex min-h-full flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800/60 px-8 py-5">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">RoadReady</span>
          <span className="text-lg">
            {selectedCountry?.flagEmoji} {selectedCountry?.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-400 transition hover:text-white">
            My Progress →
          </Link>
          {isDev && (
            <button
              onClick={() => setIsPremium(!isPremium)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isPremium
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {isPremium ? '⭐ Premium ON' : '⭐ Premium OFF'}
            </button>
          )}
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-8 py-12">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {selectedCountry?.flagEmoji} {selectedCountry?.name} — Scenarios
            </h1>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-sm text-blue-400 transition hover:text-blue-300"
            >
              Change Country
            </button>
          </div>

          {!isPremium && (
            <div className="mb-6 rounded-xl border border-amber-800/50 bg-amber-900/20 px-5 py-3 text-sm text-amber-300">
              Free plan — first 3 scenarios unlocked.{' '}
              <span className="font-semibold">Upgrade to Premium</span> to access all scenarios.
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : data ? (
            <div className="space-y-8">
              {data.categories.map((cat) => {
                const practiceScenarios = cat.scenarios.filter((s) => s.type === 'PRACTICE')
                const testScenarios = cat.scenarios.filter((s) => s.type === 'TEST')

                if (cat.scenarios.length === 0) return null

                return (
                  <section key={cat.id}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                      {cat.name}
                    </h2>
                    <ul className="space-y-2">
                      {practiceScenarios.map((s) => (
                        <ScenarioCard
                          key={s.id}
                          scenario={s}
                          unlocked={isUnlocked(s)}
                          completed={isCompleted(s)}
                        />
                      ))}
                      {testScenarios.map((s) => (
                        <TestCard
                          key={s.id}
                          scenario={s}
                          unlocked={isUnlocked(s)}
                          completed={isCompleted(s)}
                        />
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">Failed to load scenarios.</p>
          )}
        </div>
      </main>
    </div>
  )
}

function ScenarioCard({
  scenario,
  unlocked,
  completed,
}: {
  scenario: ScenarioRow
  unlocked: boolean
  completed: boolean
}) {
  if (!unlocked) {
    return (
      <li>
        <div className="flex cursor-not-allowed items-center justify-between rounded-xl border border-gray-800/40 bg-gray-900/30 px-6 py-4 opacity-60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{scenario.name}</span>
              <span className="rounded bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-400">
                🔒 Premium
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{scenario.description}</p>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li>
      <Link
        to={`/simulation/${scenario.slug}`}
        className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-4 transition hover:border-gray-600 hover:bg-gray-900"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{scenario.name}</span>
            {completed && <span className="text-emerald-400">✅</span>}
          </div>
          <p className="mt-0.5 text-sm text-gray-400">{scenario.description}</p>
        </div>
        <span className="ml-4 shrink-0 rounded-lg bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
          Practice
        </span>
      </Link>
    </li>
  )
}

function TestCard({
  scenario,
  unlocked,
  completed,
}: {
  scenario: ScenarioRow
  unlocked: boolean
  completed: boolean
}) {
  if (!unlocked) {
    return (
      <li>
        <div className="flex cursor-not-allowed items-center justify-between rounded-xl border border-amber-800/30 bg-amber-900/10 px-6 py-4 opacity-60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{scenario.name}</span>
              <span className="rounded bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-400">
                🔒 Premium
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{scenario.description}</p>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li>
      <Link
        to={`/simulation/${scenario.slug}`}
        className="flex items-center justify-between rounded-xl border-2 border-amber-600/60 bg-amber-900/20 px-6 py-4 transition hover:border-amber-500 hover:bg-amber-900/30"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-300">{scenario.name}</span>
            {completed && <span className="text-emerald-400">✅</span>}
          </div>
          <p className="mt-0.5 text-sm text-amber-200/60">{scenario.description}</p>
        </div>
        <span className="ml-4 shrink-0 rounded-lg bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-400">
          Take Test →
        </span>
      </Link>
    </li>
  )
}

// ── Root component — picks which state to render ──────────────────────────────

export default function Home() {
  const user = useUserStore((s) => s.user)
  const selectedCountry = useUserStore((s) => s.selectedCountry)

  if (!user) return <LandingPage />
  if (!selectedCountry) return <CountrySelect />
  return <ScenarioList />
}
