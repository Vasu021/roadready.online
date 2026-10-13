import type { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Small fixed-window rate limiter, kept in process memory.
 *
 * It exists to blunt credential stuffing and write spam on a single instance.
 * A multi-instance deployment should move this to Redis — the per-instance
 * window is a floor, not a guarantee.
 */
export function rateLimit({
  windowMs,
  max,
  message = "Too many requests — please slow down and try again shortly.",
}: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  const buckets = new Map<string, Bucket>();
  let lastSweep = Date.now();

  function sweep(now: number) {
    if (now - lastSweep < windowMs) return;
    lastSweep = now;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return function limiter(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    sweep(now);

    // req.ip honours `trust proxy`, which index.ts sets when deployed behind one.
    const key = `${req.ip ?? "unknown"}:${req.baseUrl}${req.path}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({ error: message });
      return;
    }

    next();
  };
}
