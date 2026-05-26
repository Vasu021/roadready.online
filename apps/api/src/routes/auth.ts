import { Router } from 'express'

const router = Router()

// Authentication is handled by Supabase Auth on the frontend.
// These routes are kept as stubs in case a server-side auth flow is needed later.
router.post('/register', (_req, res) => {
  res.status(410).json({ error: 'Use Supabase Auth on the client.' })
})

router.post('/login', (_req, res) => {
  res.status(410).json({ error: 'Use Supabase Auth on the client.' })
})

export default router
