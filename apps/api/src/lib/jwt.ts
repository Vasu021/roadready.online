import jwt from "jsonwebtoken";

const EXPIRY = "7d";
const ALGORITHM = "HS256" as const;
const MIN_SECRET_LENGTH = 24;
const DEV_FALLBACK = "dev-only-insecure-secret-do-not-ship";

/**
 * Resolves the signing secret.
 *
 * The fallback below is published in this repository, so anyone could mint
 * tokens for a server using it. It is therefore allowed only where NODE_ENV
 * *explicitly* says this is a developer machine. An unset NODE_ENV is treated
 * as a deployment and fails closed: a staging box that simply forgot the
 * variable would otherwise accept forged sessions while looking healthy.
 */
function resolveSecret(): string {
  const secret = process.env.JWT_SECRET;
  const env = process.env.NODE_ENV;
  const isLocal = env === "development" || env === "test";

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    if (!isLocal) {
      throw new Error(
        `JWT_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters ` +
          `(NODE_ENV is ${env ?? "unset"}; the development fallback is only ` +
          `available when NODE_ENV is "development" or "test").`,
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
