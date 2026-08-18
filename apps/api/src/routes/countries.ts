import { Router } from "express";
import type {
  CategoryWithTopics,
  CountryTopicsResponse,
  TopicSummary,
} from "@roadready/shared";
import prisma from "../lib/prisma";
import { notFound, route } from "../lib/http";
import { optionalAuth, type AuthRequest } from "../middleware/auth";
import { toCountryDetail, toCountrySummary } from "../lib/serialize";

const router = Router();

// GET /api/countries
router.get(
  "/",
  route(async (_req, res) => {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        topics: {
          where: { isActive: true },
          select: { _count: { select: { questions: true } } },
        },
      },
    });

    res.json(
      countries.map((c) =>
        toCountrySummary(c, {
          topics: c.topics.length,
          questions: c.topics.reduce((sum, t) => sum + t._count.questions, 0),
        }),
      ),
    );
  }),
);

async function loadCountry(code: string) {
  const country = await prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      topics: {
        where: { isActive: true },
        select: { _count: { select: { questions: true } } },
      },
    },
  });
  if (!country) throw notFound("Country not found");
  return {
    country,
    counts: {
      topics: country.topics.length,
      questions: country.topics.reduce((sum, t) => sum + t._count.questions, 0),
    },
  };
}

// GET /api/countries/:code
router.get(
  "/:code",
  route(async (req, res) => {
    const { country, counts } = await loadCountry(req.params.code);
    res.json(toCountryDetail(country, counts));
  }),
);

// GET /api/countries/:code/topics — topics grouped by category.
// Progress is merged in when the request carries a valid token.
router.get(
  "/:code/topics",
  optionalAuth,
  route(async (req: AuthRequest, res) => {
    const { country, counts } = await loadCountry(req.params.code);

    const categories = await prisma.category.findMany({
      where: { countryId: country.id },
      orderBy: { order: "asc" },
      include: {
        topics: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: { _count: { select: { questions: true } } },
        },
      },
    });

    const progressByTopic = new Map<string, TopicSummary["progress"]>();

    if (req.userId) {
      const rows = await prisma.topicProgress.findMany({
        where: { userId: req.userId, topic: { countryId: country.id } },
      });
      for (const row of rows) {
        progressByTopic.set(row.topicId, {
          status: row.status,
          bestScorePercent: row.bestScorePercent,
          attemptCount: row.attemptCount,
          passCount: row.passCount,
          lastAttemptAt: row.lastAttemptAt?.toISOString() ?? null,
        });
      }
    }

    const payload: CountryTopicsResponse = {
      country: toCountryDetail(country, counts),
      categories: categories
        .map<CategoryWithTopics>((cat) => ({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          order: cat.order,
          topics: cat.topics.map<TopicSummary>((t) => ({
            id: t.id,
            slug: t.slug,
            name: t.name,
            description: t.description,
            iconEmoji: t.iconEmoji,
            order: t.order,
            isPremium: t.isPremium,
            questionCount: t._count.questions,
            progress: progressByTopic.get(t.id) ?? null,
          })),
        }))
        .filter((cat) => cat.topics.length > 0),
    };

    res.json(payload);
  }),
);

export default router;
