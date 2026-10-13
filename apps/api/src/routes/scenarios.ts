import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";
import { parseCountryCode, parseId, shuffle } from "../lib/validation";

const router = Router();

/**
 * GET /api/scenarios/progress/:userId/:countryCode — protected
 * Ensures a UserScenarioProgress row exists for every active scenario in the
 * country, then returns them. Used when a user picks their country.
 */
router.get(
  "/progress/:userId/:countryCode",
  requireAuth,
  async (req: AuthRequest, res) => {
    const { userId } = req.params;
    const countryCode = parseCountryCode(req.params.countryCode);

    if (!countryCode) {
      res.status(400).json({ error: "Invalid country code" });
      return;
    }
    if (req.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    try {
      const country = await prisma.country.findUnique({
        where: { code: countryCode },
        select: { id: true },
      });

      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      const activeScenarios = await prisma.scenario.findMany({
        where: { countryId: country.id, isActive: true },
        select: { id: true },
      });

      if (activeScenarios.length === 0) {
        res.json([]);
        return;
      }

      await prisma.$transaction(
        activeScenarios.map((s) =>
          prisma.userScenarioProgress.upsert({
            where: { userId_scenarioId: { userId, scenarioId: s.id } },
            update: {},
            create: { userId, scenarioId: s.id },
          }),
        ),
      );

      const progress = await prisma.userScenarioProgress.findMany({
        where: { userId, scenario: { countryId: country.id, isActive: true } },
        select: { scenarioId: true, status: true },
      });

      res.json(progress);
    } catch (err) {
      console.error("Failed to fetch scenario progress:", err);
      res.status(500).json({ error: "Failed to fetch scenario progress" });
    }
  },
);

/**
 * GET /api/scenarios/:countryCode
 * Every driving-situation question for a country. Options are shuffled and
 * `isCorrect` is withheld — the answer comes from the /answer route.
 */
router.get("/:countryCode", async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  if (!countryCode) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const scenarios = await prisma.scenario.findMany({
      where: {
        country: { code: countryCode },
        isActive: true,
        type: "PRACTICE",
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        order: true,
        imagePrompt: true,
        imageUrl: true,
        questions: {
          orderBy: { order: "asc" },
          take: 1,
          select: {
            id: true,
            questionText: true,
            order: true,
            options: { select: { id: true, optionText: true, order: true } },
          },
        },
      },
    });

    res.json(
      scenarios.map((s) => {
        const q = s.questions[0];
        return {
          id: s.id,
          slug: s.slug,
          name: s.name,
          description: s.description,
          order: s.order,
          imagePrompt: s.imagePrompt,
          imageUrl: s.imageUrl,
          question: q
            ? {
                id: q.id,
                questionText: q.questionText,
                order: q.order,
                source: "scenario" as const,
                sourceName: s.name,
                imagePrompt: s.imagePrompt,
                imageUrl: s.imageUrl,
                options: shuffle(q.options),
              }
            : null,
        };
      }),
    );
  } catch (err) {
    console.error("Failed to fetch scenarios:", err);
    res.status(500).json({ error: "Failed to fetch scenarios" });
  }
});

/**
 * GET /api/scenarios/:countryCode/:id/answer — protected
 * The answer key for one driving situation.
 */
router.get("/:countryCode/:id/answer", requireAuth, async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  const id = parseId(req.params.id);

  if (!countryCode || !id) {
    res.status(400).json({ error: "Invalid country code or scenario id" });
    return;
  }

  try {
    const scenario = await prisma.scenario.findFirst({
      where: { id, country: { code: countryCode }, isActive: true },
      select: {
        questions: {
          orderBy: { order: "asc" },
          take: 1,
          select: {
            id: true,
            explanation: true,
            options: { select: { id: true, isCorrect: true } },
          },
        },
      },
    });

    const question = scenario?.questions[0];
    if (!question) {
      res.status(404).json({ error: "Scenario question not found" });
      return;
    }

    res.json({
      questionId: question.id,
      correctOptionId: question.options.find((o) => o.isCorrect)?.id ?? "",
      explanation: question.explanation,
    });
  } catch (err) {
    console.error("Failed to fetch scenario answer:", err);
    res.status(500).json({ error: "Failed to fetch answer" });
  }
});

export default router;
