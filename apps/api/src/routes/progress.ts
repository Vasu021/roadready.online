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
// Creates a ScenarioAttempt and upserts UserProgress + UserScenarioProgress in a transaction.
// Accepts scenarioId as a scenario slug or DB id.
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { scenarioId, passed, score, timeSeconds, mode } = req.body as {
    scenarioId: string
    passed: boolean
    score?: number
    timeSeconds?: number
    mode?: 'PRACTICE' | 'TEST'
  }

  if (!scenarioId || passed === undefined) {
    res.status(400).json({ error: 'scenarioId and passed are required' })
    return
  }

  const userId = req.userId!
  const newScore = score ?? 0
  const newTime = timeSeconds ?? 0
  const attemptMode = mode ?? 'PRACTICE'
  const now = new Date()

  try {
    const attempt = await prisma.$transaction(async (tx) => {
      // Resolve scenarioId: accept either a DB id or a slug
      const scenario = await tx.scenario.findFirst({
        where: { OR: [{ id: scenarioId }, { slug: scenarioId }] },
      })
      const resolvedId = scenario?.id ?? scenarioId

      const attempt = await tx.scenarioAttempt.create({
        data: {
          userId,
          scenarioId: resolvedId,
          mode: attemptMode,
          passed,
          score: newScore,
          timeSeconds: newTime,
        },
      })

      // Legacy UserProgress upsert
      const existing = await tx.userProgress.findUnique({
        where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
      })

      if (!existing) {
        await tx.userProgress.create({
          data: {
            userId,
            scenarioId: resolvedId,
            bestScore: newScore,
            bestTimeSeconds: passed ? newTime : null,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
            lastAttemptAt: now,
          },
        })
      } else {
        const betterTime =
          passed && (existing.bestTimeSeconds === null || newTime < existing.bestTimeSeconds)

        await tx.userProgress.update({
          where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
          data: {
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            ...(newScore > existing.bestScore && { bestScore: newScore }),
            ...(betterTime && { bestTimeSeconds: newTime }),
            lastAttemptAt: now,
          },
        })
      }

      // UserScenarioProgress upsert (only when scenario exists in DB)
      if (scenario) {
        const existingProgress = await tx.userScenarioProgress.findUnique({
          where: { userId_scenarioId: { userId, scenarioId: scenario.id } },
        })

        const newStatus = passed ? 'COMPLETED' : 'IN_PROGRESS'
        const keepCompleted =
          existingProgress?.status === 'COMPLETED' && newStatus === 'IN_PROGRESS'

        await tx.userScenarioProgress.upsert({
          where: { userId_scenarioId: { userId, scenarioId: scenario.id } },
          create: {
            userId,
            scenarioId: scenario.id,
            status: newStatus,
            lastAttemptAt: now,
            bestScore: newScore,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
          },
          update: {
            status: keepCompleted ? 'COMPLETED' : newStatus,
            lastAttemptAt: now,
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            ...((existingProgress == null || newScore > existingProgress.bestScore) && {
              bestScore: newScore,
            }),
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
