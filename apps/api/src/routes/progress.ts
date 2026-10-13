import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { parseBoundedInt, parseId, parseSlug } from "../lib/validation";

const router = Router();

// GET /api/progress/:userId
router.get("/:userId", requireAuth, async (req: AuthRequest, res) => {
  // A user may only read their own attempts, whatever id the URL carries.
  if (req.userId !== req.params.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const rows = await prisma.scenarioAttempt.findMany({
      where: { userId: req.params.userId },
      orderBy: { completedAt: "desc" },
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// POST /api/progress
// Creates a ScenarioAttempt and upserts UserProgress + UserScenarioProgress in a transaction.
// Accepts scenarioId as a scenario slug or DB id.
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const body = req.body as {
    scenarioId?: unknown;
    passed?: unknown;
    score?: unknown;
    timeSeconds?: unknown;
    mode?: unknown;
  };

  // Accepts either a DB id or a slug, but it must look like one of the two —
  // an unchecked string used to end up written straight into UserProgress.
  const scenarioRef = parseId(body.scenarioId) ?? parseSlug(body.scenarioId);
  const newScore = parseBoundedInt(body.score ?? 0, 0, 1000);
  const newTime = parseBoundedInt(body.timeSeconds ?? 0, 0, 86_400);
  const attemptMode = body.mode === undefined ? "PRACTICE" : body.mode;

  if (
    !scenarioRef ||
    typeof body.passed !== "boolean" ||
    newScore === null ||
    newTime === null ||
    (attemptMode !== "PRACTICE" && attemptMode !== "TEST")
  ) {
    res.status(400).json({ error: "Invalid progress payload" });
    return;
  }

  const userId = req.userId!;
  const passed = body.passed;
  const now = new Date();

  try {
    // The scenario must exist: progress against an arbitrary id is not progress.
    const known = await prisma.scenario.findFirst({
      where: { OR: [{ id: scenarioRef }, { slug: scenarioRef }] },
      select: { id: true },
    });

    if (!known) {
      res.status(404).json({ error: "Scenario not found" });
      return;
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const resolvedId = known.id;

      const attempt = await tx.scenarioAttempt.create({
        data: {
          userId,
          scenarioId: resolvedId,
          mode: attemptMode,
          passed,
          score: newScore,
          timeSeconds: newTime,
        },
      });

      // Legacy UserProgress upsert
      const existing = await tx.userProgress.findUnique({
        where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
      });

      if (!existing) {
        await tx.userProgress.create({
          data: {
            userId,
            scenarioId: resolvedId,
            bestScore: newScore,
            bestTimeSeconds: passed ? newTime : null,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
            lastAttemptAt: now,
          },
        });
      } else {
        const betterTime =
          passed &&
          (existing.bestTimeSeconds === null ||
            newTime < existing.bestTimeSeconds);

        await tx.userProgress.update({
          where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
          data: {
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            ...(newScore > existing.bestScore && { bestScore: newScore }),
            ...(betterTime && { bestTimeSeconds: newTime }),
            lastAttemptAt: now,
          },
        });
      }

      // UserScenarioProgress — the model new code should read.
      {
        const existingProgress = await tx.userScenarioProgress.findUnique({
          where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
        });

        const newStatus = passed ? "COMPLETED" : "IN_PROGRESS";
        const keepCompleted =
          existingProgress?.status === "COMPLETED" &&
          newStatus === "IN_PROGRESS";

        await tx.userScenarioProgress.upsert({
          where: { userId_scenarioId: { userId, scenarioId: resolvedId } },
          create: {
            userId,
            scenarioId: resolvedId,
            status: newStatus,
            lastAttemptAt: now,
            bestScore: newScore,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
          },
          update: {
            status: keepCompleted ? "COMPLETED" : newStatus,
            lastAttemptAt: now,
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            ...((existingProgress == null ||
              newScore > existingProgress.bestScore) && {
              bestScore: newScore,
            }),
          },
        });
      }

      return attempt;
    });

    res.status(201).json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default router;
