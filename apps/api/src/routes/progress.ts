import { Router } from "express";
import type { ProgressOverview, TopicMastery } from "@roadready/shared";
import prisma from "../lib/prisma";
import { notFound, route } from "../lib/http";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toCountrySummary, toQuizSummary } from "../lib/serialize";

const router = Router();

/**
 * GET /api/progress/overview
 *
 * Everything the dashboard needs in one round trip. `?country=DE` overrides the
 * user's selected country; with neither, the totals still come back so a user
 * who has not picked a country yet sees an empty dashboard rather than an error.
 */
router.get(
  "/overview",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { selectedCountry: true },
    });
    if (!user) throw notFound("User not found");

    const requestedCode =
      typeof req.query.country === "string"
        ? req.query.country.toUpperCase()
        : null;

    const country = requestedCode
      ? await prisma.country.findUnique({ where: { code: requestedCode } })
      : user.selectedCountry;

    const [
      completedQuizzes,
      stats,
      bookmarkCount,
      mistakeCount,
      recentQuizzes,
    ] = await Promise.all([
      prisma.quiz.aggregate({
        where: { userId, status: "COMPLETED" },
        _count: { _all: true },
      }),
      prisma.questionStat.aggregate({
        where: { userId },
        _sum: { timesSeen: true, timesCorrect: true },
      }),
      prisma.questionStat.count({ where: { userId, isBookmarked: true } }),
      prisma.questionStat.count({ where: { userId, timesWrong: { gt: 0 } } }),
      prisma.quiz.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 8,
        include: {
          country: true,
          topic: true,
          items: { select: { answeredAt: true } },
        },
      }),
    ]);

    const answered = stats._sum.timesSeen ?? 0;
    const correct = stats._sum.timesCorrect ?? 0;

    let topics: TopicMastery[] = [];
    let topicsCompleted = 0;

    if (country) {
      const rows = await prisma.topic.findMany({
        where: { countryId: country.id, isActive: true },
        orderBy: { order: "asc" },
        include: {
          category: { select: { name: true } },
          _count: { select: { questions: { where: { isActive: true } } } },
          progress: { where: { userId } },
        },
      });

      topics = rows.map((t) => {
        const p = t.progress[0];
        return {
          topicSlug: t.slug,
          topicName: t.name,
          iconEmoji: t.iconEmoji,
          categoryName: t.category?.name ?? null,
          questionCount: t._count.questions,
          status: p?.status ?? "NOT_STARTED",
          bestScorePercent: p?.bestScorePercent ?? 0,
          attemptCount: p?.attemptCount ?? 0,
        };
      });
      topicsCompleted = topics.filter((t) => t.status === "COMPLETED").length;
    }

    const payload: ProgressOverview = {
      country: country
        ? toCountrySummary(country, {
            topics: topics.length,
            questions: topics.reduce((sum, t) => sum + t.questionCount, 0),
          })
        : null,
      totals: {
        quizzesCompleted: completedQuizzes._count._all,
        questionsAnswered: answered,
        questionsCorrect: correct,
        accuracyPercent:
          answered === 0 ? 0 : Math.round((correct / answered) * 100),
        topicsCompleted,
        topicsTotal: topics.length,
        bookmarkCount,
        mistakeCount,
      },
      topics,
      recentQuizzes: recentQuizzes.map(toQuizSummary),
    };

    res.json(payload);
  }),
);

export default router;
