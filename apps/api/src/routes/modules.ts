import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import {
  parseCountryCode,
  parseSlug,
  parseId,
  shuffle,
} from "../lib/validation";
import { loadTranslations, parseLocale } from "../lib/i18n";

const router = Router();

/**
 * GET /api/modules/:countryCode
 * The curriculum: every active module with lesson and question counts, and —
 * when signed in — how far the user has read.
 */
router.get("/:countryCode", requireAuth, async (req: AuthRequest, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  const locale = parseLocale(req.query.locale);

  if (!countryCode) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const modules = await prisma.module.findMany({
      where: { countryCode, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        order: true,
        officialTitle: true,
        title: true,
        summary: true,
        estimatedMinutes: true,
        isZusatzstoff: true,
        _count: { select: { lessons: true, questions: true } },
      },
    });

    const t = await loadTranslations(
      "module",
      modules.map((m) => m.id),
      locale,
    );

    // Progress is only meaningful for a signed-in user.
    const progress = req.userId
      ? await prisma.userModuleProgress.findMany({
          where: { userId: req.userId, module: { countryCode } },
          select: {
            moduleId: true,
            completedLessonIds: true,
            completedAt: true,
          },
        })
      : [];

    const byModule = new Map(progress.map((p) => [p.moduleId, p]));

    res.json(
      modules.map((m) => {
        const p = byModule.get(m.id);
        const done = Array.isArray(p?.completedLessonIds)
          ? (p!.completedLessonIds as string[]).length
          : 0;

        return {
          id: m.id,
          slug: m.slug,
          order: m.order,
          officialTitle: m.officialTitle,
          title: t(m.id, "title", m.title),
          summary: t(m.id, "summary", m.summary),
          estimatedMinutes: m.estimatedMinutes,
          isZusatzstoff: m.isZusatzstoff,
          lessonCount: m._count.lessons,
          questionCount: m._count.questions,
          completedLessons: done,
          completedAt: p?.completedAt ?? null,
        };
      }),
    );
  } catch (err) {
    console.error("Failed to fetch modules:", err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

/** GET /api/modules/:countryCode/:slug — one module with all of its lessons. */
router.get(
  "/:countryCode/:slug",
  requireAuth,
  async (req: AuthRequest, res) => {
    const countryCode = parseCountryCode(req.params.countryCode);
    const slug = parseSlug(req.params.slug);
    const locale = parseLocale(req.query.locale);

    if (!countryCode || !slug) {
      res.status(400).json({ error: "Invalid country code or module slug" });
      return;
    }

    try {
      const mod = await prisma.module.findFirst({
        where: { slug, countryCode, isActive: true },
        select: {
          id: true,
          slug: true,
          order: true,
          officialTitle: true,
          title: true,
          summary: true,
          intro: true,
          estimatedMinutes: true,
          isZusatzstoff: true,
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              slug: true,
              order: true,
              title: true,
              body: true,
              keyPoints: true,
              sceneJson: true,
              signIds: true,
            },
          },
          _count: { select: { questions: true } },
        },
      });

      if (!mod) {
        res.status(404).json({ error: "Module not found" });
        return;
      }

      const tm = await loadTranslations("module", [mod.id], locale);
      const tl = await loadTranslations(
        "lesson",
        mod.lessons.map((l) => l.id),
        locale,
      );

      const progress = req.userId
        ? await prisma.userModuleProgress.findUnique({
            where: {
              userId_moduleId: { userId: req.userId, moduleId: mod.id },
            },
            select: { completedLessonIds: true, completedAt: true },
          })
        : null;

      const completed = Array.isArray(progress?.completedLessonIds)
        ? (progress!.completedLessonIds as string[])
        : [];

      res.json({
        id: mod.id,
        slug: mod.slug,
        order: mod.order,
        officialTitle: mod.officialTitle,
        title: tm(mod.id, "title", mod.title),
        summary: tm(mod.id, "summary", mod.summary),
        intro: tm(mod.id, "intro", mod.intro),
        estimatedMinutes: mod.estimatedMinutes,
        isZusatzstoff: mod.isZusatzstoff,
        lessonCount: mod.lessons.length,
        questionCount: mod._count.questions,
        completedLessons: completed.length,
        completedAt: progress?.completedAt ?? null,
        completedLessonIds: completed,
        lessons: mod.lessons.map((l) => ({
          id: l.id,
          slug: l.slug,
          order: l.order,
          title: tl(l.id, "title", l.title),
          body: tl(l.id, "body", l.body),
          keyPoints: (l.keyPoints as string[]) ?? [],
          sceneJson: l.sceneJson ?? undefined,
          signIds: (l.signIds as string[] | null) ?? undefined,
        })),
      });
    } catch (err) {
      console.error("Failed to fetch module:", err);
      res.status(500).json({ error: "Failed to fetch module" });
    }
  },
);

/**
 * GET /api/modules/:countryCode/:slug/questions
 * The module's own "check yourself" pool. Options are shuffled and
 * `isCorrect` is never served.
 */
router.get("/:countryCode/:slug/questions", async (req, res) => {
  const countryCode = parseCountryCode(req.params.countryCode);
  const slug = parseSlug(req.params.slug);
  const locale = parseLocale(req.query.locale);

  if (!countryCode || !slug) {
    res.status(400).json({ error: "Invalid country code or module slug" });
    return;
  }

  try {
    const mod = await prisma.module.findFirst({
      where: { slug, countryCode, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true,
        officialTitle: true,
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            questionText: true,
            order: true,
            errorPoints: true,
            options: { select: { id: true, optionText: true, order: true } },
          },
        },
      },
    });

    if (!mod) {
      res.status(404).json({ error: "Module not found" });
      return;
    }

    const tq = await loadTranslations(
      "question",
      mod.questions.map((q) => q.id),
      locale,
    );
    const to = await loadTranslations(
      "option",
      mod.questions.flatMap((q) => q.options.map((o) => o.id)),
      locale,
    );

    res.json({
      module: {
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        officialTitle: mod.officialTitle,
      },
      questions: mod.questions.map((q) => ({
        id: q.id,
        questionText: tq(q.id, "questionText", q.questionText),
        order: q.order,
        errorPoints: q.errorPoints,
        source: "module" as const,
        sourceName: mod.title,
        options: shuffle(
          q.options.map((o) => ({
            ...o,
            optionText: to(o.id, "optionText", o.optionText),
          })),
        ),
      })),
    });
  } catch (err) {
    console.error("Failed to fetch module questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/**
 * GET /api/modules/:countryCode/:slug/questions/answers — protected
 * The answer key, for client-side scoring in module practice.
 */
router.get(
  "/:countryCode/:slug/questions/answers",
  requireAuth,
  async (req, res) => {
    const countryCode = parseCountryCode(req.params.countryCode);
    const slug = parseSlug(req.params.slug);
    const locale = parseLocale(req.query.locale);

    if (!countryCode || !slug) {
      res.status(400).json({ error: "Invalid country code or module slug" });
      return;
    }

    try {
      const mod = await prisma.module.findFirst({
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

      if (!mod) {
        res.status(404).json({ error: "Module not found" });
        return;
      }

      const te = await loadTranslations(
        "question",
        mod.questions.map((q) => q.id),
        locale,
      );

      res.json(
        mod.questions.map((q) => ({
          questionId: q.id,
          correctOptionId: q.options.find((o) => o.isCorrect)?.id ?? "",
          explanation: te(q.id, "explanation", q.explanation),
        })),
      );
    } catch (err) {
      console.error("Failed to fetch module answer key:", err);
      res.status(500).json({ error: "Failed to fetch answers" });
    }
  },
);

/**
 * POST /api/modules/progress
 * Marks one lesson read. The completed set is stored as a JSON array so a
 * lesson can be re-read without inflating anything.
 */
router.post("/progress", requireAuth, async (req: AuthRequest, res) => {
  const body = req.body as { moduleId?: unknown; lessonId?: unknown };
  const moduleId = parseId(body.moduleId);
  const lessonId = parseId(body.lessonId);

  if (!moduleId || !lessonId) {
    res.status(400).json({ error: "moduleId and lessonId are required" });
    return;
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, moduleId },
      select: { id: true },
    });

    if (!lesson) {
      res.status(404).json({ error: "Lesson not found in that module" });
      return;
    }

    const total = await prisma.lesson.count({ where: { moduleId } });

    const existing = await prisma.userModuleProgress.findUnique({
      where: { userId_moduleId: { userId: req.userId!, moduleId } },
      select: { completedLessonIds: true },
    });

    const current = Array.isArray(existing?.completedLessonIds)
      ? (existing!.completedLessonIds as string[])
      : [];
    const next = current.includes(lessonId) ? current : [...current, lessonId];
    const finished = next.length >= total;

    const saved = await prisma.userModuleProgress.upsert({
      where: { userId_moduleId: { userId: req.userId!, moduleId } },
      create: {
        userId: req.userId!,
        moduleId,
        completedLessonIds: next,
        lastLessonId: lessonId,
        completedAt: finished ? new Date() : null,
      },
      update: {
        completedLessonIds: next,
        lastLessonId: lessonId,
        completedAt: finished ? new Date() : null,
      },
      select: { completedLessonIds: true, completedAt: true },
    });

    res.json({
      completedLessons: (saved.completedLessonIds as string[]).length,
      totalLessons: total,
      completedAt: saved.completedAt,
    });
  } catch (err) {
    console.error("Failed to save module progress:", err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default router;
