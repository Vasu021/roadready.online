import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { parseCountryCode } from "../lib/validation";

const router = Router();

/**
 * This is the one router mounted without authentication, because the
 * signed-out landing page needs the country list and its facts panel. Any
 * route added here is public — anything that serves course content belongs in
 * one of the protected routers instead.
 */

// GET /api/countries — public
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

// GET /api/countries/:code/facts — public
router.get("/:code/facts", async (req, res) => {
  const code = parseCountryCode(req.params.code);
  if (!code) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code },
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

// GET /api/countries/:code/scenarios — protected: this lists course content
router.get("/:code/scenarios", requireAuth, async (req, res) => {
  const code = parseCountryCode(req.params.code);
  if (!code) {
    res.status(400).json({ error: "Invalid country code" });
    return;
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code },
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
