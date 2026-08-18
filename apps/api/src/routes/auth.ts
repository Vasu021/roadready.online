import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { signToken } from "../lib/jwt";
import {
  badRequest,
  conflict,
  notFound,
  optionalStr,
  route,
  str,
  unauthorized,
} from "../lib/http";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toAuthUser } from "../lib/serialize";

const router = Router();

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const withCountry = { selectedCountry: { select: { code: true } } } as const;

// POST /api/auth/register
router.post(
  "/register",
  route(async (req, res) => {
    const email = str(req.body, "email").toLowerCase();
    const password = str(req.body, "password");
    const name = optionalStr(req.body, "name");

    if (!EMAIL_PATTERN.test(email))
      throw badRequest("Enter a valid email address");
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw badRequest(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw conflict("An account with that email already exists");

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, BCRYPT_COST),
        name: name || null,
      },
      include: withCountry,
    });

    res.status(201).json({
      token: signToken({ sub: user.id, email: user.email }),
      user: toAuthUser(user),
    });
  }),
);

// POST /api/auth/login
router.post(
  "/login",
  route(async (req, res) => {
    const email = str(req.body, "email").toLowerCase();
    const password = str(req.body, "password");

    const user = await prisma.user.findUnique({
      where: { email },
      include: withCountry,
    });

    // Same message either way, so the endpoint cannot be used to enumerate
    // which addresses have accounts.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw unauthorized("Invalid email or password");
    }

    res.json({
      token: signToken({ sub: user.id, email: user.email }),
      user: toAuthUser(user),
    });
  }),
);

// GET /api/auth/me
router.get(
  "/me",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: withCountry,
    });
    if (!user) throw notFound("User not found");
    res.json(toAuthUser(user));
  }),
);

// PATCH /api/auth/me — update display name and/or selected country
router.patch(
  "/me",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const name = optionalStr(req.body, "name");
    const rawCountry = (req.body as Record<string, unknown> | null)
      ?.countryCode;

    let selectedCountryId: string | null | undefined;
    if (rawCountry === null) {
      selectedCountryId = null;
    } else if (rawCountry !== undefined) {
      const code = str(req.body, "countryCode").toUpperCase();
      const country = await prisma.country.findUnique({ where: { code } });
      if (!country) throw notFound("Country not found");
      selectedCountryId = country.id;
    }

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: {
        ...(name !== undefined && { name: name || null }),
        ...(selectedCountryId !== undefined && { selectedCountryId }),
      },
      include: withCountry,
    });

    res.json(toAuthUser(user));
  }),
);

export default router;
