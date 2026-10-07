import { AdminRoute, CreatorRoute, ReviewerRoute } from "@/lib/routes";
import { UserRole, Workspace } from "@/modules/auth/types/auth";

/**
 * Every seat the backend can issue, and the dashboard it belongs in.
 *
 * This is the one place that says "these roles point to this dashboard". The
 * **seat** decides the workspace; the **permissions** on `Me.permissions`
 * decide which pages render inside it. That is the backend's own two-axis
 * split, and keeping the two apart is why a Writer can open the admin
 * dashboard and still not see the Teams page.
 *
 * `Record<UserRole, Workspace>` is deliberate — it is total, so adding a value
 * to the backend's `UserRoleEnum` fails to compile here rather than falling
 * silently through to the creator studio.
 *
 * Course Creators are not staff; they are external users of the product. Their
 * studio is listed only to keep this map total and is otherwise left alone.
 */
export const SEAT_WORKSPACE: Record<UserRole, Workspace> = {
  [UserRole.SUPER_ADMIN]: Workspace.ADMIN_DASHBOARD,
  [UserRole.ADMIN]: Workspace.ADMIN_DASHBOARD,
  [UserRole.STAFF_WRITER]: Workspace.ADMIN_DASHBOARD,
  /*
    AI Reviewer is absent from the review queue's own audience ("Creator
    Reviewer, Verifier, QA Reviewer, Admin, Approver and Super Admin"), so the
    reviewer studio is not its home. The AI-facing surfaces — the MIE console
    and the APE pipeline — both live in the admin area.
  */
  [UserRole.AI_REVIEWER]: Workspace.ADMIN_DASHBOARD,

  [UserRole.REVIEWER]: Workspace.REVIEWER_STUDIO,
  [UserRole.CREATOR_REVIEWER]: Workspace.REVIEWER_STUDIO,
  [UserRole.STAFF_VERIFIER]: Workspace.REVIEWER_STUDIO,
  [UserRole.STAFF_APPROVER]: Workspace.REVIEWER_STUDIO,
  [UserRole.QA_REVIEWER]: Workspace.REVIEWER_STUDIO,

  [UserRole.COURSE_CREATOR]: Workspace.CREATOR_STUDIO,
};

/** The seats belonging to a dashboard — the inverse of `SEAT_WORKSPACE`. */
export function seatsForWorkspace(workspace: Workspace): UserRole[] {
  return (Object.keys(SEAT_WORKSPACE) as UserRole[]).filter(
    (seat) => SEAT_WORKSPACE[seat] === workspace,
  );
}

export function getDashboardRoute(workspace?: string): string {
  switch (workspace?.toLowerCase()) {
    case Workspace.CREATOR_STUDIO:
      return CreatorRoute.DASHBOARD;
    case Workspace.ADMIN_DASHBOARD:
    case "admin_studio":
      return AdminRoute.OVERVIEW;
    case Workspace.REVIEWER_STUDIO:
    case Workspace.CREATOR_REVIEW_DASHBOARD:
      return ReviewerRoute.DASHBOARD;
    default:
      return CreatorRoute.DASHBOARD;
  }
}

/**
 * The URL prefix each dashboard owns, derived from its own entry route so the
 * prefix can't drift from the route it is meant to guard.
 */
const WORKSPACE_PATH_PREFIX: Record<string, string> = {
  [Workspace.ADMIN_DASHBOARD]: AdminRoute.OVERVIEW.replace(/\/dashboard$/, ""),
  [Workspace.CREATOR_STUDIO]: CreatorRoute.DASHBOARD.replace(/\/dashboard$/, ""),
  [Workspace.REVIEWER_STUDIO]: ReviewerRoute.DASHBOARD.replace(
    /\/dashboard$/,
    "",
  ),
};

/** The workspaces that own a dashboard prefix, for reverse lookups. */
function workspaceOwningPath(path: string): string | undefined {
  return Object.entries(WORKSPACE_PATH_PREFIX).find(
    ([, prefix]) => path === prefix || path.startsWith(`${prefix}/`),
  )?.[0];
}

/**
 * Whether a saved redirect aims at a dashboard this user's workspace does not
 * own.
 *
 * `ProtectedRoute` already bounces a user out of the wrong dashboard, but only
 * after the app has rendered, and only for routes that go through it. A saved
 * `?callbackUrl` is resolved before anything renders, and it can outlive the
 * session that produced it — so a creator whose tab still carries
 * `/admin/users` from an earlier sign-in would be aimed at the admin area.
 * Deciding here means the redirect is discarded instead of issued and then
 * undone.
 *
 * Only *mismatched dashboards* are rejected. A path outside every dashboard —
 * `/auth/accept-invitation`, `/terms`, `/change-email` — is left alone: those
 * flows are reached deliberately and are already gated by `isSafeInternalPath`.
 * Discarding them would break the invitation and email-change detours that
 * depend on the destination surviving the trip through login.
 *
 * The query string and fragment are stripped first, so `/admin/users?tab=x` is
 * recognised as an admin path rather than passing as an unrecognised one, and
 * the segment boundary keeps `/creatorly` out of the creator studio.
 */
export function isCrossWorkspaceRedirect(
  path: string,
  workspace?: string,
): boolean {
  const pathname = path.split(/[?#]/)[0];
  const owner = workspaceOwningPath(pathname);
  if (!owner) return false;

  return owner !== workspace?.toLowerCase();
}

/**
 * Maps a seat to its workspace. This is the one place a *role* — rather than a
 * permission — is still the right input, because the backend documents `role`
 * as deciding "review seats, MFA mandate, staff roster membership and login
 * workspace". A custom role keeps its `base_role`'s workspace.
 *
 * An unrecognised or empty value — a stale token, a null role — keeps the
 * creator studio it has always fallen back to.
 */
export function getWorkspaceForRole(role?: UserRole | string): string {
  const normalized = String(role ?? "")
    .trim()
    .toUpperCase();

  const isKnownSeat = (Object.values(UserRole) as string[]).includes(normalized);

  return isKnownSeat
    ? SEAT_WORKSPACE[normalized as UserRole]
    : Workspace.CREATOR_STUDIO;
}
