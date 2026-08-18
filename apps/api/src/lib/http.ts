import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * An error carrying the status code the client should see. Anything else that
 * escapes a handler is a bug and becomes a 500 with a generic message, so
 * internal details never leak into a response body.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message = "Not authenticated") =>
  new HttpError(401, message);
export const forbidden = (message = "Forbidden") => new HttpError(403, message);
export const notFound = (message: string) => new HttpError(404, message);
export const conflict = (message: string) => new HttpError(409, message);

/** Forwards rejected promises to the error middleware instead of hanging. */
export function route(
  handler: (req: Request, res: Response) => Promise<void> | void,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
}

// ── Body parsing helpers ────────────────────────────────────────────────────

type Body = Record<string, unknown>;

export function str(body: unknown, key: string): string {
  const value = (body as Body | null)?.[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequest(`"${key}" is required`);
  }
  return value.trim();
}

export function optionalStr(body: unknown, key: string): string | undefined {
  const value = (body as Body | null)?.[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw badRequest(`"${key}" must be a string`);
  return value.trim();
}

export function optionalInt(body: unknown, key: string): number | undefined {
  const value = (body as Body | null)?.[key];
  if (value === undefined || value === null) return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n)) throw badRequest(`"${key}" must be an integer`);
  return n;
}

export function oneOf<T extends string>(
  body: unknown,
  key: string,
  allowed: readonly T[],
): T {
  const value = str(body, key);
  if (!(allowed as readonly string[]).includes(value)) {
    throw badRequest(`"${key}" must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
}
