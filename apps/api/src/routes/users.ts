import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { LOCALES, parseLocale } from "../lib/i18n";

const router = Router();

/** Themes the frontend ships. Stored per user so it follows them across devices. */
const THEMES = [
  "study",
  "wood",
  "greenboard",
  "blackboard",
  "daylight",
  "contrast",
] as const;

// GET /api/users/me — profile, preferences and attempt count
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user, totalAttempts] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, locale: true, theme: true },
      }),
      prisma.scenarioAttempt.count({ where: { userId: req.userId } }),
    ]);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ ...user, totalAttempts });
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PATCH /api/users/me/preferences — language and theme
router.patch("/me/preferences", requireAuth, async (req: AuthRequest, res) => {
  const body = req.body as { locale?: unknown; theme?: unknown };

  const data: { locale?: string; theme?: string } = {};

  if (body.locale !== undefined) {
    if (
      typeof body.locale !== "string" ||
      !(LOCALES as readonly string[]).includes(body.locale)
    ) {
      res.status(400).json({ error: "Unsupported locale" });
      return;
    }
    data.locale = parseLocale(body.locale);
  }

  if (body.theme !== undefined) {
    if (
      typeof body.theme !== "string" ||
      !(THEMES as readonly string[]).includes(body.theme)
    ) {
      res.status(400).json({ error: "Unsupported theme" });
      return;
    }
    data.theme = body.theme;
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, email: true, locale: true, theme: true },
    });
    res.json(user);
  } catch (err) {
    console.error("Failed to update preferences:", err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

export default router;
