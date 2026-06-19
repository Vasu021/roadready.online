import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// GET /api/countries
router.get("/", async (_req, res) => {
  try {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            _count: { select: { scenarios: { where: { isActive: true } } } },
          },
        },
        _count: { select: { scenarios: { where: { isActive: true } } } },
      },
    });

    res.json(
      countries.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        flagEmoji: c.flagEmoji,
        isActive: c.isActive,
        scenarioCount: c._count.scenarios,
        categories: c.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          order: cat.order,
          scenarioCount: cat._count.scenarios,
        })),
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// GET /api/countries/:code/facts
router.get("/:code/facts", async (req, res) => {
  try {
    const country = await prisma.country.findUnique({
      where: { code: req.params.code.toUpperCase() },
      select: { facts: true },
    });

    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }

    res.json({ facts: country.facts ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch country facts" });
  }
});

// GET /api/countries/:code/test-questions?limit=N — protected
// A sample of questions drawn ACROSS all active scenarios for the country, with
// `isCorrect` HIDDEN — this powers the graded Full Test, which scores answers
// server-side via POST /api/test-sessions/:id/answers. Returns the countryId so
// the caller can open a matching TestSession.
router.get("/:code/test-questions", requireAuth, async (req, res) => {
  try {
    const country = await prisma.country.findUnique({
      where: { code: req.params.code.toUpperCase() },
    });
    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }

    const limitRaw = Number(req.query.limit);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 50)
        : 15;

    const questions = await prisma.question.findMany({
      where: { scenario: { countryId: country.id, isActive: true } },
      include: {
        options: { select: { id: true, optionText: true, order: true } },
      },
    });

    const sampled = shuffle(questions).slice(0, limit);

    res.json({
      countryId: country.id,
      questions: sampled.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: shuffle(
          q.options.map((o) => ({ id: o.id, optionText: o.optionText })),
        ),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch test questions" });
  }
});

// GET /api/countries/:code/scenarios
router.get("/:code/scenarios", async (req, res) => {
  try {
    const country = await prisma.country.findUnique({
      where: { code: req.params.code.toUpperCase() },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            scenarios: {
              where: { isActive: true },
              orderBy: { order: "asc" },
              include: { _count: { select: { questions: true } } },
            },
          },
        },
      },
    });

    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }

    res.json({
      country: {
        id: country.id,
        code: country.code,
        name: country.name,
        flagEmoji: country.flagEmoji,
      },
      categories: country.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        order: cat.order,
        scenarios: cat.scenarios.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          description: s.description,
          order: s.order,
          isActive: s.isActive,
          isPremium: s.isPremium,
          type: s.type,
          videoUrl: s.videoUrl,
          questionCount: s._count.questions,
        })),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scenarios" });
  }
});

export default router;
