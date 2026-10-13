import { ApiError, api, getStoredToken } from "./api";
import { isTokenValid } from "./jwt";

export type SessionCheck = "allowed" | "denied";

let cache: { token: string; result: Promise<SessionCheck> } | null = null;

/**
 * Asks the API whether the stored token is a real session.
 *
 * Reading the token's own claims proves nothing — the payload is just
 * base64, so anyone can write `{"sub":"…","exp":<far future>}` into
 * localStorage. Only the API holds the signing secret, so only the API can
 * answer this, and `/api/users/me` is the cheapest way to ask.
 *
 * The answer is cached per token, so signing in or out re-checks and ordinary
 * navigation between protected pages does not.
 */
export function verifySession(): Promise<SessionCheck> {
  const token = getStoredToken();

  // No token, or one that has plainly expired: no need to ask.
  if (!token || !isTokenValid(token)) return Promise.resolve("denied");

  if (cache?.token !== token) {
    cache = {
      token,
      result: api.users
        .me()
        .then((): SessionCheck => "allowed")
        .catch((err: unknown): SessionCheck => {
          if (err instanceof ApiError && err.status === 401) return "denied";

          // The server was unreachable or failing. That is not evidence the
          // session is bad, so don't sign the user out over it — retry on the
          // next check, and let the API refuse anything it should refuse.
          cache = null;
          return "allowed";
        }),
    };
  }

  return cache.result;
}

/** Forgets the cached answer, so the next check asks the API again. */
export function resetSessionCheck(): void {
  cache = null;
}
