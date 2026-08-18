import { Router } from "express";
import type { BookmarkToggleResponse, QuizQuestion } from "@roadready/shared";
import prisma from "../lib/prisma";
import { notFound, route } from "../lib/http";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/questions/bookmarks — the user's saved questions, answers revealed
router.get(
  "/bookmarks",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const stats = await prisma.questionStat.findMany({
      where: {
        userId: req.userId!,
        isBookmarked: true,
        question: { isActive: true },
      },
      orderBy: { lastSeenAt: "desc" },
      include: {
        question: {
          include: { options: { orderBy: { order: "asc" } }, topic: true },
        },
      },
    });

    // These are revision material, not a test, so the correct answer and the
    // explanation are included.
    const payload: QuizQuestion[] = stats.map((stat, i) => {
      const q = stat.question;
      return {
        id: q.id,
        order: i + 1,
        prompt: q.prompt,
        imageUrl: q.imageUrl,
        imageAlt: q.imageAlt,
        difficulty: q.difficulty,
        topic: {
          slug: q.topic.slug,
          name: q.topic.name,
          iconEmoji: q.topic.iconEmoji,
        },
        options: q.options.map((o) => ({
          id: o.id,
          label: o.label,
          text: o.text,
          order: o.order,
        })),
        isBookmarked: true,
        selectedOptionId: null,
        isCorrect: null,
        correctOptionId: q.options.find((o) => o.isCorrect)?.id ?? null,
        explanation: q.explanation,
      };
    });

    res.json(payload);
  }),
);

// POST /api/questions/:id/bookmark — toggle
router.post(
  "/:id/bookmark",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const questionId = req.params.id;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) throw notFound("Question not found");

    const existing = await prisma.questionStat.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
    const next = !existing?.isBookmarked;

    await prisma.questionStat.upsert({
      where: { userId_questionId: { userId, questionId } },
      create: { userId, questionId, isBookmarked: next },
      update: { isBookmarked: next },
    });

    const payload: BookmarkToggleResponse = { questionId, isBookmarked: next };
    res.json(payload);
  }),
);

export default router;
