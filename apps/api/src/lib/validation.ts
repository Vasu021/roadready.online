/**
 * Request-parameter guards. Everything that reaches Prisma from a URL or body
 * goes through here first, so a malformed value fails fast with a 400 instead
 * of reaching the database.
 */

const COUNTRY_CODE = /^[A-Za-z]{2}$/;
// Deliberately conservative: one @, no spaces, a dotted domain.
const EMAIL = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const MIN_PASSWORD = 8;
/** bcrypt only uses the first 72 bytes, and huge inputs are a cheap DoS. */
const MAX_PASSWORD = 128;
const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;
const CUID = /^[a-z0-9]{20,40}$/;

export function parseCountryCode(value: unknown): string | null {
  if (typeof value !== "string" || !COUNTRY_CODE.test(value)) return null;
  return value.toUpperCase();
}

export function parseSlug(value: unknown): string | null {
  if (typeof value !== "string" || !SLUG.test(value)) return null;
  return value;
}

export function parseId(value: unknown): string | null {
  if (typeof value !== "string" || !CUID.test(value)) return null;
  return value;
}

/** Normalises an email: trimmed and lower-cased so one address is one account. */
export function parseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export function parsePassword(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.length < MIN_PASSWORD || value.length > MAX_PASSWORD) return null;
  return value;
}

export { MIN_PASSWORD, MAX_PASSWORD };

export function parseBoundedInt(
  value: unknown,
  min: number,
  max: number,
): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

/** Fisher–Yates, on a copy. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Take n items at random without repeating any. */
export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.max(0, n));
}
