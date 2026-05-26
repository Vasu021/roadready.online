import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AuthModal from './components/AuthModal'
import { supabase } from './lib/supabase'
import { useUserStore } from './store/userStore'

const Simulation = lazy(() => import('./pages/Simulation'))

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
    </div>
  )
}

export default function App() {
  const setUser = useUserStore((s) => s.setUser)
  const showAuthModal = useUserStore((s) => s.showAuthModal)

  // Listen for Supabase auth state changes for the lifetime of the app
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
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
