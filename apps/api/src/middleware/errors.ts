import type { Request, Response, NextFunction } from "express";

/** Unmatched routes answer in JSON, like every other endpoint. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

/**
 * Last-resort error handler. Details are logged server-side; the client gets a
 * generic message so stack traces and query internals never leave the process.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  // A malformed JSON body surfaces here as a SyntaxError from body-parser.
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Malformed JSON body" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
