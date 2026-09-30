/**
 * The `redux-persist` key. Owned here because the auth-failure path needs to
 * reach into storage to drop a dead session, and `redux/index.ts` needs the same
 * string to name the store.
 */
export const PERSIST_ROOT_KEY = "root";

/**
 * The localStorage key `redux-persist` writes the whole store under.
 */
const PERSIST_STORAGE_KEY = `persist:${PERSIST_ROOT_KEY}`;

/**
 * Drop only the auth slice from the persisted store.
 *
 * A blanket `localStorage.clear()` was used here and it took unrelated state
 * with it. When auth is no longer whitelisted (see `redux/index.ts`) this is a
 * no-op, but it still clears out the token written by any older build so an
 * upgraded tab cannot resurrect a dead session.
 */
export function purgePersistedAuth(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(PERSIST_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as Record<string, string>;
    if (!("auth" in parsed)) return;

    delete parsed.auth;

    // `persist:{"auth":"..."}` collapses to `persist:{}` when auth was the only
    // whitelisted slice — drop the key entirely rather than leave it behind.
    if (Object.keys(parsed).length === 0) {
      window.localStorage.removeItem(PERSIST_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(PERSIST_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Unreadable or unparseable storage is not worth failing a redirect over.
  }
}
