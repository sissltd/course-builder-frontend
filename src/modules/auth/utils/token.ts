export function decodeJwtPayload<T extends Record<string, unknown>>(
  token: string,
): T {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return JSON.parse(atob(padded)) as T;
}

export function getAccessTokenExpiresAt(accessToken: string): number {
  const payload = decodeJwtPayload<{ exp?: number }>(accessToken);
  return payload.exp ? payload.exp * 1000 : Date.now() + 30 * 60 * 1000;
}
