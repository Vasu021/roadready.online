import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AuthModal from './components/AuthModal'
import { getStoredToken } from './utils/api'
import { useUserStore } from './store/userStore'

const Simulation = lazy(() => import('./pages/Simulation'))

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
    </div>
  )
}

function parseJwt(token: string): { sub: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

export default function App() {
  const setUser = useUserStore((s) => s.setUser)
  const showAuthModal = useUserStore((s) => s.showAuthModal)

  // Restore session from localStorage token on app load
  useEffect(() => {
    const token = getStoredToken()
    if (!token) return
    const payload = parseJwt(token)
    if (payload?.sub && payload?.email) {
      setUser({ id: payload.sub, email: payload.email })
    }
  }, [setUser])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulation/:scenarioId" element={<Simulation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
      {showAuthModal && <AuthModal />}
    </BrowserRouter>
  )
}
