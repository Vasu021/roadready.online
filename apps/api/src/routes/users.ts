import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/users/me — profile info derived from the verified JWT + attempt count
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const totalAttempts = await prisma.scenarioAttempt.count({
      where: { userId: req.userId },
    })
    res.json({ id: req.userId, email: req.userEmail, totalAttempts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
