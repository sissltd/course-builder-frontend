export const PENDING_INVITATION_STORAGE_KEY =
  "SoluDesks.auth.invitation.pending";

export interface PendingInvitation {
  /**
   * A workspace invitation is addressed by its roster id (`invite_id`); a staff
   * invitation stores its emailed token here instead. Both mean the same thing
   * to this module: "an invitation the caller has not dealt with yet".
   */
  inviteId: string;
  /** Kept so the landing page can show who the invitation belongs to. */
  invitedEmail?: string;
  savedAt: number;
}

/**
 * An invitation link that needs an account has to survive the detour through
 * signup, which wipes the query string the invitation arrived in. Persisting
 * the id locally lets the flow resume as soon as the account exists.
 *
 * localStorage rather than sessionStorage: the detour can span a device unlock
 * or an emailed verification, and a session-scoped value would be lost.
 */
export function savePendingInvitation(
  inviteId: string,
  invitedEmail?: string,
): void {
  if (typeof window === "undefined" || !inviteId) return;
  try {
    window.localStorage.setItem(
      PENDING_INVITATION_STORAGE_KEY,
      JSON.stringify({
        inviteId,
        invitedEmail,
        savedAt: Date.now(),
      } satisfies PendingInvitation),
    );
  } catch {
    // A full or blocked storage must not break the page; the id is still in
    // the URL for this visit.
  }
}

export function readPendingInvitation(): PendingInvitation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_INVITATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingInvitation>;
    if (!parsed || typeof parsed.inviteId !== "string" || !parsed.inviteId) {
      return null;
    }
    return {
      inviteId: parsed.inviteId,
      invitedEmail:
        typeof parsed.invitedEmail === "string" ? parsed.invitedEmail : undefined,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : 0,
    };
  } catch {
    return null;
  }
}

export function clearPendingInvitation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_INVITATION_STORAGE_KEY);
  } catch {
    // Nothing to do — a failed cleanup just means we try again next time.
  }
}

/**
 * Either a fresh invitation link or one left over from a previous visit. A link
 * in the URL always wins so re-sharing the email re-targets the page.
 */
export function resolvePendingInviteId(
  inviteIdParam: string | null,
): string | null {
  const fromUrl = inviteIdParam?.trim();
  if (fromUrl) return fromUrl;
  return readPendingInvitation()?.inviteId ?? null;
}
