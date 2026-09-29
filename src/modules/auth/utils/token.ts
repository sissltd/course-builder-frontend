export function decodeJwtPayload<T extends Record<string, unknown>>(
  token: string,
): T {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return JSON.parse(atob(padded)) as T;
}

/** The backend issues access tokens with a 25 minute lifetime. */
export const ACCESS_TOKEN_LIFETIME_MS = 25 * 60 * 1000;

/**
 * How long before expiry a refresh is attempted. With a 25 minute lifetime
 * this puts the refresh at the 20 minute mark, leaving the remaining 5 minutes
 * as slack for the rotated token to reach the browser and for an in-flight
 * request to finish.
 */
export const ACCESS_TOKEN_REFRESH_WINDOW_MS = 5 * 60 * 1000;

/**
 * How often the client re-reads its own session so `next-auth` gets a chance to
 * run the `jwt` callback. The refresh only happens *during* that callback, so
 * this interval has to be comfortably shorter than the refresh window —
 * otherwise the token can lapse before the proactive refresh ever runs, and
 * the only thing left is the reactive 401 retry.
 *
 * At 5 minutes the proactive refresh lands between 20 and 25 minutes.
 */
export const SESSION_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function getAccessTokenExpiresAt(accessToken: string): number {
  try {
    const payload = decodeJwtPayload<{ exp?: number }>(accessToken);
    return payload.exp ? payload.exp * 1000 : Date.now() + ACCESS_TOKEN_LIFETIME_MS;
  } catch {
    // A malformed token tells us nothing; assume the nominal lifetime rather
    // than treating the session as immediately expired.
    return Date.now() + ACCESS_TOKEN_LIFETIME_MS;
  }
}

/** True once the token is inside the refresh window and should be rotated. */
export function shouldRefreshAccessToken(
  expiresAt: number | undefined,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return false;
  return now >= expiresAt - ACCESS_TOKEN_REFRESH_WINDOW_MS;
}
