import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { unauthorized } from "../lib/http";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

/** Rejects the request unless a valid bearer token is present. */
export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const token = readToken(req);
  if (!token) {
    next(unauthorized("Missing or invalid Authorization header"));
    return;
  }
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    next(unauthorized("Invalid or expired token"));
  }
}

/**
 * Attaches the user when a valid token is present and does nothing otherwise.
 * Used by endpoints that serve public content but enrich it with progress —
 * an invalid token must not turn a browsable page into a 401.
 */
export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const token = readToken(req);
  if (token) {
    try {
      const payload = verifyToken(token);
      req.userId = payload.sub;
      req.userEmail = payload.email;
    } catch {
      // Ignore — the request continues as anonymous.
    }
  }
  next();
}
