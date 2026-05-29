import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// GET /api/scenarios
router.get('/', async (_req, res) => {
  try {
    const scenarios = await prisma.scenario.findMany({
      where: { isActive: true },
      orderBy: [{ countryId: 'asc' }, { order: 'asc' }],
      include: { _count: { select: { questions: true } } },
    })

    res.json(
      scenarios.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        order: s.order,
        isActive: s.isActive,
        isPremium: s.isPremium,
        type: s.type,
        countryId: s.countryId,
        categoryId: s.categoryId,
        videoUrl: s.videoUrl,
        questionCount: s._count.questions,
      })),
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch scenarios' })
  }
})

// GET /api/scenarios/progress/:userId/:countryCode — protected
// Returns UserScenarioProgress[] for all active scenarios in that country for that user.
// Creates NOT_STARTED rows if none exist yet.
router.get('/progress/:userId/:countryCode', requireAuth, async (req: AuthRequest, res) => {
  const { userId, countryCode } = req.params

  if (req.userId !== userId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    })

    if (!country) {
      res.status(404).json({ error: 'Country not found' })
      return
    }

    const activeScenarios = await prisma.scenario.findMany({
      where: { countryId: country.id, isActive: true },
      select: { id: true },
    })

    if (activeScenarios.length === 0) {
      res.json([])
      return
    }

    // Ensure a progress row exists for every active scenario
    await prisma.$transaction(
      activeScenarios.map((s) =>
        prisma.userScenarioProgress.upsert({
          where: { userId_scenarioId: { userId, scenarioId: s.id } },
          update: {},
          create: { userId, scenarioId: s.id },
        }),
      ),
    )

    const progress = await prisma.userScenarioProgress.findMany({
      where: {
        userId,
        scenario: { countryId: country.id, isActive: true },
      },
      select: { scenarioId: true, status: true },
    })

    res.json(progress)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch scenario progress' })
  }
})

// GET /api/scenarios/:slug/questions — must come before /:slug to avoid shadowing
router.get('/:slug/questions', async (req, res) => {
  try {
    const scenario = await prisma.scenario.findUnique({
      where: { slug: req.params.slug },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              select: { id: true, optionText: true, order: true },
            },
          },
        },
      },
    })

    if (!scenario) {
      res.status(404).json({ error: 'Scenario not found' })
      return
    }

    res.json(
      scenario.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: q.order,
        options: shuffle(q.options),
      })),
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

// GET /api/scenarios/:slug
router.get('/:slug', async (req, res) => {
  try {
    const scenario = await prisma.scenario.findUnique({
      where: { slug: req.params.slug },
      include: { _count: { select: { questions: true } } },
    })

    if (!scenario) {
      res.status(404).json({ error: 'Scenario not found' })
      return
    }

    res.json({
      id: scenario.id,
      slug: scenario.slug,
      name: scenario.name,
      description: scenario.description,
      order: scenario.order,
      isActive: scenario.isActive,
      isPremium: scenario.isPremium,
      type: scenario.type,
      countryId: scenario.countryId,
      categoryId: scenario.categoryId,
      videoUrl: scenario.videoUrl,
      questionCount: scenario._count.questions,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch scenario' })
  }
})

export default router
