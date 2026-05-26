import { Link } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

export default function Dashboard() {
  const user = useUserStore((s) => s.user)

  return (
    <div className="min-h-full bg-gray-950 text-white">
      <header className="flex items-center gap-4 border-b border-gray-800/60 px-8 py-5">
        <Link
          to="/"
          className="text-sm text-gray-400 transition hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold">My Progress</h1>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10">
        {user ? (
          <p className="text-gray-400">
            Logged in as <span className="text-white">{user.email}</span>
          </p>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-8 text-center">
            <p className="text-gray-400">
              Sign in to track your progress across sessions.
            </p>
            <button className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold transition hover:bg-blue-500">
              Sign In
            </button>
          </div>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Scenario Results
          </h2>
          <p className="text-sm text-gray-500">
            No scenarios completed yet.{' '}
            <Link to="/" className="text-blue-400 hover:underline">
              Start driving →
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
