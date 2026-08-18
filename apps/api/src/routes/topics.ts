import { Router } from "express";
import type { TopicSummary } from "@roadready/shared";
import prisma from "../lib/prisma";
import { notFound, route } from "../lib/http";
import { optionalAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/topics/:slug
router.get(
  "/:slug",
  optionalAuth,
  route(async (req: AuthRequest, res) => {
    const topic = await prisma.topic.findUnique({
      where: { slug: req.params.slug },
      include: {
        _count: { select: { questions: { where: { isActive: true } } } },
      },
    });

    if (!topic || !topic.isActive) throw notFound("Topic not found");

    const progress = req.userId
      ? await prisma.topicProgress.findUnique({
          where: { userId_topicId: { userId: req.userId, topicId: topic.id } },
        })
      : null;

    const payload: TopicSummary = {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      iconEmoji: topic.iconEmoji,
      order: topic.order,
      isPremium: topic.isPremium,
      questionCount: topic._count.questions,
      progress: progress
        ? {
            status: progress.status,
            bestScorePercent: progress.bestScorePercent,
            attemptCount: progress.attemptCount,
            passCount: progress.passCount,
            lastAttemptAt: progress.lastAttemptAt?.toISOString() ?? null,
          }
        : null,
    };

    res.json(payload);
  }),
);

export default router;
