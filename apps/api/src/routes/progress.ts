import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/progress/:userId — fetch all completed scenarios for a user
router.get('/:userId', async (req, res) => {
  try {
    const rows = await prisma.userProgress.findMany({
      where: { userId: req.params.userId },
      orderBy: { completedAt: 'desc' },
    })
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch progress' })
  }
})

// POST /api/progress — record a completed scenario attempt
router.post('/', async (req, res) => {
  const { userId, scenarioId, passed, score, timeSeconds } = req.body as {
    userId: string
    scenarioId: string
    passed: boolean
    score?: number
    timeSeconds?: number
  }

  if (!userId || !scenarioId || passed === undefined) {
    res.status(400).json({ error: 'userId, scenarioId, and passed are required' })
    return
  }

  try {
    const row = await prisma.userProgress.create({
      data: { userId, scenarioId, passed, score: score ?? 0, timeSeconds: timeSeconds ?? 0 },
    })
    res.status(201).json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

export default router
