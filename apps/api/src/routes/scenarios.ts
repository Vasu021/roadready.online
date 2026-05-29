import { Router } from 'express'
import prisma from '../lib/prisma'

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
