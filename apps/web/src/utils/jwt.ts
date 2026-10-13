export interface JwtPayload {
  sub?: string;
  email?: string;
  exp?: number;
}

/**
 * Decodes a JWT payload. This does NOT verify the signature — it only reads
 * the claims so the UI can restore a session and notice an expired token.
 * Every protected response is still authorised by the API.
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as JwtPayload;
    return typeof payload === "object" && payload !== null ? payload : null;
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload | null): boolean {
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now();
}

/** True when a usable, unexpired token is present. */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwt(token);
  return Boolean(payload?.sub) && !isExpired(payload);
}
