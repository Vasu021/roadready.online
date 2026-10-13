import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { MIN_PASSWORD, parseEmail, parsePassword } from "../lib/validation";

const router = Router();

const BCRYPT_ROUNDS = 12;

/**
 * A pre-computed hash of a throwaway value. Comparing against it when no user
 * exists keeps the login path's timing roughly constant, so response time does
 * not reveal whether an email is registered.
 */
const DUMMY_HASH = bcrypt.hashSync(
  "unused-placeholder-password",
  BCRYPT_ROUNDS,
);

const CREDENTIALS_ERROR = "Invalid email or password";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const body = req.body as { email?: unknown; password?: unknown };
  const email = parseEmail(body.email);
  const password = parsePassword(body.password);

  if (!email) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }
  if (!password) {
    res.status(400).json({
      error: `Password must be between ${MIN_PASSWORD} and 128 characters`,
    });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      res
        .status(409)
        .json({ error: "An account with that email already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hashed },
      select: { id: true, email: true },
    });

    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const body = req.body as { email?: unknown; password?: unknown };
  const email = parseEmail(body.email);
  const password = typeof body.password === "string" ? body.password : null;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    // Always run a comparison, even with no user, to even out the timing.
    const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

    if (!user || !valid) {
      res.status(401).json({ error: CREDENTIALS_ERROR });
      return;
    }

    const token = signToken({ sub: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
