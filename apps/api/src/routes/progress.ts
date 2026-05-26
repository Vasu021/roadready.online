import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/progress/:userId
router.get('/:userId', requireAuth, async (req: AuthRequest, res) => {
  if (req.userId !== req.params.userId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  try {
    const rows = await prisma.scenarioAttempt.findMany({
      where: { userId: req.params.userId },
      orderBy: { completedAt: 'desc' },
    })
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch progress' })
  }
})

// POST /api/progress
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { scenarioId, passed, score, timeSeconds } = req.body as {
    scenarioId: string
    passed: boolean
    score?: number
    timeSeconds?: number
  }

  if (!scenarioId || passed === undefined) {
    res.status(400).json({ error: 'scenarioId and passed are required' })
    return
  }

  try {
    const row = await prisma.scenarioAttempt.create({
      data: {
        userId: req.userId!,
        scenarioId,
        passed,
        score: score ?? 0,
        timeSeconds: timeSeconds ?? 0,
      },
    })
    res.status(201).json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

export default router
