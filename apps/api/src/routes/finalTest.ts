import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { parseCountryCode, sample, shuffle } from "../lib/validation";
import { FINAL_TEST } from "../config/finalTest";

const router = Router();

interface ServedQuestion {
  id: string;
  questionText: string;
  order: number;
  source: "topic" | "scenario" | "sign";
  sourceName: string;
  imagePrompt?: string | null;
  options: { id: string; optionText: string; order: number }[];
}

const questionSelect = {
  id: true,
  questionText: true,
  options: { select: { id: true, optionText: true, order: true } },
} as const;

/**
 * GET /api/final-test/:countryCode/questions — protected
 * A mixed test: rule questions, driving situations and sign recognition.
 * Options are shuffled and `isCorrect` is never served; the test is graded
 * server-side through the TestSession answer routes.
 */
router.get("/:countryCode/questions", requireAuth, async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  if (!countryCode) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
      select: { id: true, code: true, name: true, flagEmoji: true },
    });

    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }

    const [ruleRows, signRows, scenarioRows] = await Promise.all([
      prisma.question.findMany({
        where: {
          topicTest: { countryCode, isActive: true, isSignTopic: false },
        },
        select: { ...questionSelect, topicTest: { select: { nameEN: true } } },
      }),
      prisma.question.findMany({
        where: {
          topicTest: { countryCode, isActive: true, isSignTopic: true },
        },
        select: { ...questionSelect, topicTest: { select: { nameEN: true } } },
      }),
      prisma.question.findMany({
        where: {
          scenario: { country: { code: countryCode }, isActive: true },
        },
        select: {
          ...questionSelect,
          scenario: {
            select: { name: true, imagePrompt: true },
          },
        },
      }),
    ]);

    const rules: ServedQuestion[] = ruleRows.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      order: 0,
      source: "topic",
      sourceName: q.topicTest?.nameEN ?? "Traffic rules",
      options: q.options,
    }));

    const signs: ServedQuestion[] = signRows.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      order: 0,
      source: "sign",
      sourceName: q.topicTest?.nameEN ?? "Traffic signs",
      options: q.options,
    }));

    const scenarios: ServedQuestion[] = scenarioRows.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      order: 0,
      source: "scenario",
      sourceName: q.scenario?.name ?? "Driving situation",
      imagePrompt: q.scenario?.imagePrompt ?? null,
      options: q.options,
    }));

    // Draw the configured mix, then top up from whatever is left so the test
    // still has the right length when one pool is short.
    const picked = [
      ...sample(rules, FINAL_TEST.mix.topic),
      ...sample(scenarios, FINAL_TEST.mix.scenario),
      ...sample(signs, FINAL_TEST.mix.sign),
    ];

    if (picked.length < FINAL_TEST.questionCount) {
      const used = new Set(picked.map((q) => q.id));
      const rest = [...rules, ...scenarios, ...signs].filter(
        (q) => !used.has(q.id),
      );
      picked.push(...sample(rest, FINAL_TEST.questionCount - picked.length));
    }

    const questions = shuffle(picked)
      .slice(0, FINAL_TEST.questionCount)
      .map((q, i) => ({
        ...q,
        order: i + 1,
        options: shuffle(q.options),
      }));

    res.json({
      country,
      total: questions.length,
      timeLimitSeconds: FINAL_TEST.timeLimitMinutes * 60,
      passPercent: Math.round(FINAL_TEST.passRatio * 100),
      questions,
    });
  } catch (err) {
    console.error("Failed to build final test:", err);
    res.status(500).json({ error: "Failed to build final test" });
  }
});

export default router;
