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
// Creates a ScenarioAttempt and upserts UserProgress (best scores, counts) in a transaction.
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

  const userId = req.userId!
  const newScore = score ?? 0
  const newTime = timeSeconds ?? 0
  const now = new Date()

  try {
    const attempt = await prisma.$transaction(async (tx) => {
      const attempt = await tx.scenarioAttempt.create({
        data: { userId, scenarioId, passed, score: newScore, timeSeconds: newTime },
      })

      const existing = await tx.userProgress.findUnique({
        where: { userId_scenarioId: { userId, scenarioId } },
      })

      if (!existing) {
        await tx.userProgress.create({
          data: {
            userId,
            scenarioId,
            bestScore: newScore,
            bestTimeSeconds: passed ? newTime : null,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
            lastAttemptAt: now,
          },
        })
      } else {
        const betterTime =
          passed &&
          (existing.bestTimeSeconds === null || newTime < existing.bestTimeSeconds)

        await tx.userProgress.update({
          where: { userId_scenarioId: { userId, scenarioId } },
          data: {
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            ...(newScore > existing.bestScore && { bestScore: newScore }),
            ...(betterTime && { bestTimeSeconds: newTime }),
            lastAttemptAt: now,
          },
        })
      }

      return attempt
    })

    res.status(201).json(attempt)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

export default router
