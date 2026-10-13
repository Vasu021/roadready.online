import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import {
  parseCountryCode,
  parseSlug,
  parseBoundedInt,
  shuffle,
} from "../lib/validation";

const router = Router();

/**
 * POST /api/topic-tests/attempts
 * Records a finished topic practice run as a ScenarioAttempt (mode PRACTICE).
 * Declared before the parameterised GETs so "attempts" is never read as a code.
 */
router.post("/attempts", requireAuth, async (req: AuthRequest, res) => {
  const body = req.body as {
    topicSlug?: unknown;
    countryCode?: unknown;
    score?: unknown;
    totalQuestions?: unknown;
    passed?: unknown;
    timeSeconds?: unknown;
  };

  const topicSlug = parseSlug(body.topicSlug);
  const countryCode = parseCountryCode(body.countryCode);
  const totalQuestions = parseBoundedInt(body.totalQuestions, 1, 500);
  const score =
    totalQuestions === null
      ? null
      : parseBoundedInt(body.score, 0, totalQuestions);
  const timeSeconds = parseBoundedInt(body.timeSeconds ?? 0, 0, 86_400);

  if (
    !topicSlug ||
    !countryCode ||
    score === null ||
    totalQuestions === null ||
    timeSeconds === null ||
    typeof body.passed !== "boolean"
  ) {
    res.status(400).json({ error: "Invalid attempt payload" });
    return;
  }

  try {
    const topic = await prisma.topicTest.findFirst({
      where: { slug: topicSlug, countryCode, isActive: true },
      select: { id: true },
    });

    if (!topic) {
      res.status(404).json({ error: "Topic test not found" });
      return;
    }

    const attempt = await prisma.scenarioAttempt.create({
      data: {
        userId: req.userId!,
        topicTestId: topic.id,
        mode: "PRACTICE",
        passed: body.passed,
        score,
        totalQuestions,
        timeSeconds,
      },
      select: {
        id: true,
        score: true,
        totalQuestions: true,
        passed: true,
        completedAt: true,
      },
    });

    res.status(201).json(attempt);
  } catch (err) {
    console.error("Failed to record topic attempt:", err);
    res.status(500).json({ error: "Failed to record attempt" });
  }
});

/** GET /api/topic-tests/:countryCode — all active topics, in order. */
router.get("/:countryCode", async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  if (!countryCode) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const topics = await prisma.topicTest.findMany({
      where: { countryCode, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        nameEN: true,
        description: true,
        order: true,
        isSignTopic: true,
        _count: { select: { questions: true } },
      },
    });

    res.json(
      topics.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        nameEN: t.nameEN,
        description: t.description,
        order: t.order,
        isSignTopic: t.isSignTopic,
        questionCount: t._count.questions,
      })),
    );
  } catch (err) {
    console.error("Failed to fetch topic tests:", err);
    res.status(500).json({ error: "Failed to fetch topic tests" });
  }
});

/**
 * GET /api/topic-tests/:countryCode/attempts
 * Per-topic progress for the signed-in user: best score, last score, attempts.
 */
router.get(
  "/:countryCode/attempts",
  requireAuth,
  async (req: AuthRequest, res) => {
    const countryCode = parseCountryCode(req.params.countryCode);
    if (!countryCode) {
      res.status(400).json({ error: "Invalid country code" });
      return;
    }

    try {
      const attempts = await prisma.scenarioAttempt.findMany({
        where: {
          userId: req.userId!,
          topicTest: { countryCode, isActive: true },
        },
        orderBy: { completedAt: "desc" },
        select: {
          score: true,
          totalQuestions: true,
          passed: true,
          completedAt: true,
          topicTest: { select: { slug: true } },
        },
      });

      const bySlug = new Map<
        string,
        {
          topicSlug: string;
          bestScore: number;
          lastScore: number;
          totalQuestions: number;
          attemptCount: number;
          passed: boolean;
          lastAttemptAt: Date;
        }
      >();

      // Rows arrive newest first, so the first row per topic is the latest run.
      for (const a of attempts) {
        const slug = a.topicTest?.slug;
        if (!slug) continue;
        const existing = bySlug.get(slug);
        if (!existing) {
          bySlug.set(slug, {
            topicSlug: slug,
            bestScore: a.score,
            lastScore: a.score,
            totalQuestions: a.totalQuestions ?? 0,
            attemptCount: 1,
            passed: a.passed,
            lastAttemptAt: a.completedAt,
          });
        } else {
          existing.attemptCount += 1;
          existing.bestScore = Math.max(existing.bestScore, a.score);
          existing.passed = existing.passed || a.passed;
        }
      }

      res.json([...bySlug.values()]);
    } catch (err) {
      console.error("Failed to fetch topic attempts:", err);
      res.status(500).json({ error: "Failed to fetch attempts" });
    }
  },
);

/**
 * GET /api/topic-tests/:countryCode/:slug/questions
 * Questions with shuffled options. `isCorrect` is never included.
 */
router.get("/:countryCode/:slug/questions", async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  const slug = parseSlug(req.params.slug);
  if (!countryCode || !slug) {
    res.status(400).json({ error: "Invalid country code or topic slug" });
    return;
  }

  try {
    const topic = await prisma.topicTest.findFirst({
      where: { slug, countryCode, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        nameEN: true,
        description: true,
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            questionText: true,
            order: true,
            options: { select: { id: true, optionText: true, order: true } },
          },
        },
      },
    });

    if (!topic) {
      res.status(404).json({ error: "Topic test not found" });
      return;
    }

    res.json({
      topic: {
        id: topic.id,
        slug: topic.slug,
        name: topic.name,
        nameEN: topic.nameEN,
        description: topic.description,
      },
      questions: topic.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: q.order,
        source: "topic" as const,
        sourceName: topic.nameEN,
        options: shuffle(q.options),
      })),
    });
  } catch (err) {
    console.error("Failed to fetch topic questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/**
 * GET /api/topic-tests/:countryCode/:slug/questions/answers
 * The answer key for a topic, for client-side scoring in practice mode.
 */
router.get(
  "/:countryCode/:slug/questions/answers",
  requireAuth,
  async (req, res) => {
    const countryCode = parseCountryCode(req.params.countryCode);
    const slug = parseSlug(req.params.slug);
    if (!countryCode || !slug) {
      res.status(400).json({ error: "Invalid country code or topic slug" });
      return;
    }

    try {
      const topic = await prisma.topicTest.findFirst({
        where: { slug, countryCode, isActive: true },
        select: {
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              explanation: true,
              options: { select: { id: true, isCorrect: true } },
            },
          },
        },
      });

      if (!topic) {
        res.status(404).json({ error: "Topic test not found" });
        return;
      }

      res.json(
        topic.questions.map((q) => ({
          questionId: q.id,
          correctOptionId: q.options.find((o) => o.isCorrect)?.id ?? "",
          explanation: q.explanation,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch topic answer key:", err);
      res.status(500).json({ error: "Failed to fetch answers" });
    }
  },
);

export default router;
