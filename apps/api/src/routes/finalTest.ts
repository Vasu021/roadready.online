import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { parseCountryCode, sample, shuffle } from "../lib/validation";
import { FINAL_TEST } from "../config/finalTest";
import { loadTranslations, parseLocale, type Locale } from "../lib/i18n";

const router = Router();

interface ServedQuestion {
  id: string;
  questionText: string;
  order: number;
  errorPoints: number;
  source: "topic" | "scenario" | "sign" | "module";
  sourceName: string;
  imagePrompt?: string | null;
  sceneJson?: unknown;
  options: { id: string; optionText: string; order: number }[];
}

const questionSelect = {
  id: true,
  questionText: true,
  errorPoints: true,
  options: { select: { id: true, optionText: true, order: true } },
} as const;

async function translateQuestions(
  questions: ServedQuestion[],
  locale: Locale,
): Promise<ServedQuestion[]> {
  if (locale === "en") return questions;

  const tq = await loadTranslations(
    "question",
    questions.map((q) => q.id),
    locale,
  );
  const optionIds = questions.flatMap((q) => q.options.map((o) => o.id));
  const to = await loadTranslations("option", optionIds, locale);

  return questions.map((q) => ({
    ...q,
    questionText: tq(q.id, "questionText", q.questionText),
    options: q.options.map((o) => ({
      ...o,
      optionText: to(o.id, "optionText", o.optionText),
    })),
  }));
}

/**
 * GET /api/final-test/:countryCode/questions — protected
 *
 * Mirrors the official exam: 20 Grundstoff questions and 10 class-B
 * Zusatzstoff questions, weighted 2 to 5 error points. Options are shuffled
 * and `isCorrect` is never served — grading happens in the session routes.
 */
router.get("/:countryCode/questions", requireAuth, async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  const locale = parseLocale(req.query.locale);

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

    const [
      grundstoffModules,
      zusatzModules,
      topicRows,
      signRows,
      scenarioRows,
    ] = await Promise.all([
      prisma.question.findMany({
        where: {
          module: { countryCode, isActive: true, isZusatzstoff: false },
        },
        select: { ...questionSelect, module: { select: { title: true } } },
      }),
      prisma.question.findMany({
        where: {
          module: { countryCode, isActive: true, isZusatzstoff: true },
        },
        select: { ...questionSelect, module: { select: { title: true } } },
      }),
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
        where: { scenario: { country: { code: countryCode }, isActive: true } },
        select: {
          ...questionSelect,
          scenario: {
            select: { name: true, imagePrompt: true, sceneJson: true },
          },
        },
      }),
    ]);

    const asServed = (
      rows: typeof grundstoffModules,
      source: ServedQuestion["source"],
      nameOf: (r: (typeof grundstoffModules)[number]) => string,
    ): ServedQuestion[] =>
      rows.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: 0,
        errorPoints: q.errorPoints,
        source,
        sourceName: nameOf(q),
        options: q.options,
      }));

    // Grundstoff: the twelve basic modules, the rule topics and sign topics.
    const grundstoffPool: ServedQuestion[] = [
      ...asServed(
        grundstoffModules,
        "module",
        (q) => q.module?.title ?? "Module",
      ),
      ...topicRows.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: 0,
        errorPoints: q.errorPoints,
        source: "topic" as const,
        sourceName: q.topicTest?.nameEN ?? "Traffic rules",
        options: q.options,
      })),
      ...signRows.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: 0,
        errorPoints: q.errorPoints,
        source: "sign" as const,
        sourceName: q.topicTest?.nameEN ?? "Traffic signs",
        options: q.options,
      })),
    ];

    // Zusatzstoff: the two class-B modules plus the illustrated situations,
    // which are the practical, car-specific half of the exam.
    const zusatzPool: ServedQuestion[] = [
      ...asServed(zusatzModules, "module", (q) => q.module?.title ?? "Module"),
      ...scenarioRows.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        order: 0,
        errorPoints: q.errorPoints,
        source: "scenario" as const,
        sourceName: q.scenario?.name ?? "Driving situation",
        imagePrompt: q.scenario?.imagePrompt ?? null,
        sceneJson: q.scenario?.sceneJson ?? undefined,
        options: q.options,
      })),
    ];

    const picked = [
      ...sample(grundstoffPool, FINAL_TEST.mix.grundstoff),
      ...sample(zusatzPool, FINAL_TEST.mix.zusatzstoff),
    ];

    // Top up from whatever is left if one pool is short.
    if (picked.length < FINAL_TEST.questionCount) {
      const used = new Set(picked.map((q) => q.id));
      const rest = [...grundstoffPool, ...zusatzPool].filter(
        (q) => !used.has(q.id),
      );
      picked.push(...sample(rest, FINAL_TEST.questionCount - picked.length));
    }

    const translated = await translateQuestions(
      shuffle(picked).slice(0, FINAL_TEST.questionCount),
      locale,
    );

    const questions = translated.map((q, i) => ({
      ...q,
      order: i + 1,
      options: shuffle(q.options),
    }));

    res.json({
      country,
      total: questions.length,
      timeLimitSeconds: FINAL_TEST.timeLimitMinutes * 60,
      maxErrorPoints: FINAL_TEST.maxErrorPoints,
      totalErrorPoints: questions.reduce((sum, q) => sum + q.errorPoints, 0),
      questions,
    });
  } catch (err) {
    console.error("Failed to build final test:", err);
    res.status(500).json({ error: "Failed to build final test" });
  }
});

export default router;
