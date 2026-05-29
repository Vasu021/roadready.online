import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

function computeGrade(pct: number): string {
  if (pct >= 0.9) return 'A'
  if (pct >= 0.75) return 'B'
  if (pct >= 0.6) return 'C'
  return 'F'
}

// POST /api/test-sessions
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { countryId } = req.body as { countryId?: string }
  if (!countryId) {
    res.status(400).json({ error: 'countryId is required' })
    return
  }

  try {
    const maxScore = await prisma.question.count({
      where: { scenario: { countryId, isActive: true } },
    })

    const session = await prisma.testSession.create({
      data: { userId: req.userId!, countryId, maxScore },
    })

    res.status(201).json(session)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create test session' })
  }
})

// POST /api/test-sessions/:id/answers
router.post('/:id/answers', requireAuth, async (req: AuthRequest, res) => {
  const { questionId, selectedOptionId } = req.body as {
    questionId?: string
    selectedOptionId?: string
  }

  if (!questionId || !selectedOptionId) {
    res.status(400).json({ error: 'questionId and selectedOptionId are required' })
    return
  }

  try {
    const session = await prisma.testSession.findUnique({ where: { id: req.params.id } })
    if (!session) {
      res.status(404).json({ error: 'Test session not found' })
      return
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    if (session.completedAt) {
      res.status(409).json({ error: 'Test session already completed' })
      return
    }

    const option = await prisma.option.findUnique({
      where: { id: selectedOptionId },
      include: { question: { select: { explanation: true } } },
    })

    if (!option || option.questionId !== questionId) {
      res.status(400).json({ error: 'Invalid option for question' })
      return
    }

    const answer = await prisma.testSessionAnswer.create({
      data: {
        testSessionId: req.params.id,
        questionId,
        selectedOptionId,
        isCorrect: option.isCorrect,
      },
    })

    res.status(201).json({
      id: answer.id,
      isCorrect: option.isCorrect,
      explanation: option.question.explanation,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to record answer' })
  }
})

// PATCH /api/test-sessions/:id/complete
router.patch('/:id/complete', requireAuth, async (req: AuthRequest, res) => {
  try {
    const session = await prisma.testSession.findUnique({
      where: { id: req.params.id },
      include: { answers: { select: { isCorrect: true } } },
    })

    if (!session) {
      res.status(404).json({ error: 'Test session not found' })
      return
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    if (session.completedAt) {
      res.status(409).json({ error: 'Test session already completed' })
      return
    }

    const totalScore = session.answers.filter((a) => a.isCorrect).length
    const pct = session.maxScore > 0 ? totalScore / session.maxScore : 0
    const passed = pct >= 0.75
    const grade = computeGrade(pct)

    const completed = await prisma.testSession.update({
      where: { id: req.params.id },
      data: { completedAt: new Date(), totalScore, passed, grade },
    })

    res.json(completed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to complete test session' })
  }
})

// GET /api/test-sessions/:id
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const session = await prisma.testSession.findUnique({
      where: { id: req.params.id },
      include: {
        country: { select: { code: true, name: true, flagEmoji: true } },
        answers: {
          orderBy: { answeredAt: 'asc' },
          include: {
            question: { select: { questionText: true, explanation: true, order: true } },
            selectedOption: { select: { optionText: true, isCorrect: true } },
          },
        },
      },
    })

    if (!session) {
      res.status(404).json({ error: 'Test session not found' })
      return
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    res.json(session)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch test session' })
  }
})

export default router
