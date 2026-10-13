import jwt from "jsonwebtoken";

const EXPIRY = "7d";
const ALGORITHM = "HS256" as const;
const MIN_SECRET_LENGTH = 24;
const DEV_FALLBACK = "dev-only-insecure-secret-do-not-ship";

/**
 * Resolves the signing secret.
 *
 * A hardcoded fallback would let anyone who has read this repository forge
 * tokens, so outside development a missing or trivially short JWT_SECRET is a
 * startup failure rather than a silent downgrade.
 */
function resolveSecret(): string {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    if (isProduction) {
      throw new Error(
        `JWT_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters in production.`,
      );
    }
    console.warn(
      `[auth] JWT_SECRET missing or shorter than ${MIN_SECRET_LENGTH} characters — using an insecure development secret.`,
    );
    return DEV_FALLBACK;
  }

  return secret;
}

const SECRET = resolveSecret();

export interface JwtPayload {
  sub: string; // userId
  email: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRY,
    algorithm: ALGORITHM,
  });
}

/**
 * Verifies a token. The algorithm is pinned so a token presented with a
 * different `alg` header can never be accepted.
 */
export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, SECRET, { algorithms: [ALGORITHM] });

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof (decoded as JwtPayload).sub !== "string" ||
    typeof (decoded as JwtPayload).email !== "string"
  ) {
    throw new Error("Malformed token payload");
  }

  return decoded as JwtPayload;
}
