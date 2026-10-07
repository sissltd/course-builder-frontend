/**
 * Records that the *user* asked to sign out, as opposed to the session having
 * died on them.
 *
 * The distinction matters for the post-logout destination. When a session
 * expires or a request 401s, preserving where the user was is a kindness — they
 * sign back in and land on the page they were reading. After a deliberate
 * logout that courtesy reads as a bug: they click Log out, sign back in, and are
 * returned to the settings screen they just left, as if the logout did nothing.
 *
 * Without an explicit marker the two are indistinguishable. `signOut` clears the
 * cookie, so the components still mounted on the dashboard briefly report
 * `unauthenticated` — which is precisely the state `ProtectedRoute` and the 401
 * handler in `baseApi` read as "the session lapsed, save the destination". They
 * race the sign-out navigation and write a callbackUrl the user never asked for.
 * This flag is what they check to tell the race from a real expiry.
 *
 * sessionStorage, not a module variable: `signOut` performs a full navigation,
 * so the flag has to outlive the document it was set in. It is cleared the
 * moment a new session is established.
 */
const MANUAL_LOGOUT_KEY = "SoluDesks.auth.manualLogout";

export function markManualLogout(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
  } catch {
    // A browser with storage disabled (private mode, blocked cookies) cannot
    // record the intent. The worst case is the old behaviour: a callbackUrl
    // that the login page's workspace check may still discard.
  }
}

export function wasLoggedOutManually(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearManualLogoutFlag(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
  } catch {
    // Nothing to do — the flag is already unreachable if storage throws.
  }
}