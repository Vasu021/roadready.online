import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { parseCountryCode, parseId, parseBoundedInt } from "../lib/validation";
import { FINAL_TEST, computeGrade } from "../config/finalTest";

const router = Router();

/**
 * POST /api/test-sessions
 * Starts a final theory test. Accepts `countryCode` (preferred) or `countryId`,
 * plus an optional `maxScore` — the number of questions actually served.
 */
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const body = req.body as {
    countryCode?: unknown;
    countryId?: unknown;
    maxScore?: unknown;
  };

  const countryCode = parseCountryCode(body.countryCode);
  const countryId = parseId(body.countryId);
  const maxScore =
    body.maxScore === undefined
      ? FINAL_TEST.questionCount
      : parseBoundedInt(body.maxScore, 1, 200);

  if ((!countryCode && !countryId) || maxScore === null) {
    res.status(400).json({ error: "countryCode (or countryId) is required" });
    return;
  }

  try {
    const country = await prisma.country.findFirst({
      where: countryCode ? { code: countryCode } : { id: countryId! },
      select: { id: true },
    });

    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }

    const session = await prisma.testSession.create({
      data: { userId: req.userId!, countryId: country.id, maxScore },
      select: { id: true, startedAt: true, maxScore: true, countryId: true },
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("Failed to create test session:", err);
    res.status(500).json({ error: "Failed to create test session" });
  }
});

/**
 * POST /api/test-sessions/:id/answers
 * Records one answer. Grading happens here, server-side: the client never sees
 * which option is correct until the session is completed.
 */
router.post("/:id/answers", requireAuth, async (req: AuthRequest, res) => {
  const sessionId = parseId(req.params.id);
  const body = req.body as { questionId?: unknown; selectedOptionId?: unknown };
  const questionId = parseId(body.questionId);
  const selectedOptionId = parseId(body.selectedOptionId);

  if (!sessionId || !questionId || !selectedOptionId) {
    res
      .status(400)
      .json({ error: "questionId and selectedOptionId are required" });
    return;
  }

  try {
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, completedAt: true },
    });

    if (!session) {
      res.status(404).json({ error: "Test session not found" });
      return;
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (session.completedAt) {
      res.status(409).json({ error: "Test session already completed" });
      return;
    }

    const option = await prisma.option.findUnique({
      where: { id: selectedOptionId },
      select: { id: true, questionId: true, isCorrect: true },
    });

    if (!option || option.questionId !== questionId) {
      res.status(400).json({ error: "Invalid option for question" });
      return;
    }

    // One answer per question per session: a change of mind overwrites.
    const answer = await prisma.testSessionAnswer.upsert({
      where: {
        testSessionId_questionId: { testSessionId: sessionId, questionId },
      },
      create: {
        testSessionId: sessionId,
        questionId,
        selectedOptionId,
        isCorrect: option.isCorrect,
      },
      update: { selectedOptionId, isCorrect: option.isCorrect },
      select: { id: true },
    });

    // No `isCorrect` in the response: the final test gives no live feedback.
    res.status(201).json({ id: answer.id, recorded: true });
  } catch (err) {
    console.error("Failed to record answer:", err);
    res.status(500).json({ error: "Failed to record answer" });
  }
});

/** PATCH /api/test-sessions/:id/complete — grades and closes the session. */
router.patch("/:id/complete", requireAuth, async (req: AuthRequest, res) => {
  const sessionId = parseId(req.params.id);
  if (!sessionId) {
    res.status(400).json({ error: "Invalid session id" });
    return;
  }

  try {
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        completedAt: true,
        maxScore: true,
        answers: { select: { isCorrect: true } },
      },
    });

    if (!session) {
      res.status(404).json({ error: "Test session not found" });
      return;
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (session.completedAt) {
      res.status(409).json({ error: "Test session already completed" });
      return;
    }

    const totalScore = session.answers.filter((a) => a.isCorrect).length;
    const ratio = session.maxScore > 0 ? totalScore / session.maxScore : 0;

    const completed = await prisma.testSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        totalScore,
        passed: ratio >= FINAL_TEST.passRatio,
        grade: computeGrade(ratio),
      },
      select: {
        id: true,
        totalScore: true,
        maxScore: true,
        passed: true,
        grade: true,
        completedAt: true,
      },
    });

    res.json(completed);
  } catch (err) {
    console.error("Failed to complete test session:", err);
    res.status(500).json({ error: "Failed to complete test session" });
  }
});

/**
 * GET /api/test-sessions/:id
 * Full session. The per-question breakdown — including which option was
 * correct — is only included once the session has been completed.
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const sessionId = parseId(req.params.id);
  if (!sessionId) {
    res.status(400).json({ error: "Invalid session id" });
    return;
  }

  try {
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        country: { select: { code: true, name: true, flagEmoji: true } },
        answers: {
          orderBy: { answeredAt: "asc" },
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                explanation: true,
                options: {
                  select: { id: true, optionText: true, isCorrect: true },
                  orderBy: { order: "asc" },
                },
              },
            },
            selectedOption: { select: { id: true, optionText: true } },
          },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: "Test session not found" });
      return;
    }
    if (session.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const isComplete = Boolean(session.completedAt);

    res.json({
      id: session.id,
      country: session.country,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      totalScore: session.totalScore,
      maxScore: session.maxScore,
      passed: session.passed,
      grade: session.grade,
      answeredCount: session.answers.length,
      // Before completion this stays empty so a running test cannot be probed
      // for the correct answers.
      breakdown: isComplete
        ? session.answers.map((a) => ({
            questionId: a.question.id,
            questionText: a.question.questionText,
            explanation: a.question.explanation,
            isCorrect: a.isCorrect,
            selectedOptionId: a.selectedOption.id,
            selectedOptionText: a.selectedOption.optionText,
            correctOptionText:
              a.question.options.find((o) => o.isCorrect)?.optionText ?? "",
            options: a.question.options.map((o) => ({
              id: o.id,
              optionText: o.optionText,
              isCorrect: o.isCorrect,
            })),
          }))
        : [],
    });
  } catch (err) {
    console.error("Failed to fetch test session:", err);
    res.status(500).json({ error: "Failed to fetch test session" });
  }
});

export default router;
