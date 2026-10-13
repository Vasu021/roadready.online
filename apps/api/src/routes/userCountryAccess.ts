import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { parseCountryCode } from "../lib/validation";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/user-country-access
// Body: { countryCode: string }
// Upserts a UserCountryAccess row for the authenticated user + country
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const countryCode = parseCountryCode(
    (req.body as { countryCode?: unknown }).countryCode,
  );

  if (!countryCode) {
    res.status(400).json({ error: "A valid countryCode is required" });
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

    const existing = await prisma.userCountryAccess.findUnique({
      where: {
        userId_countryId: { userId: req.userId!, countryId: country.id },
      },
    });

    if (!existing) {
      await prisma.userCountryAccess.create({
        data: { userId: req.userId!, countryId: country.id },
      });
    }

    res.json({ alreadyExisted: existing !== null });
  } catch (err) {
    console.error("Failed to record country access:", err);
    res.status(500).json({ error: "Failed to record country access" });
  }
});

export default router;
