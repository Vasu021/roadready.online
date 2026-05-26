import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'

type Mode = 'login' | 'signup'

export default function AuthModal() {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal)
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setConfirmSent(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) setError(err.message)
        else setShowAuthModal(false)
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password })
        if (err) {
          setError(err.message)
        } else if (data.session) {
          // Email confirmation disabled — session created immediately
          setShowAuthModal(false)
        } else {
          setConfirmSent(true)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setShowAuthModal(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {mode === 'login'
                ? 'Track your progress across sessions.'
                : 'Save your results and track improvement.'}
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-600 transition hover:text-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {confirmSent ? (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-4">
            <p className="text-sm text-emerald-400">
              Check your inbox — we sent a confirmation link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Mode toggle */}
        {!confirmSent && (
          <p className="mt-5 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-blue-400 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-blue-400 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
