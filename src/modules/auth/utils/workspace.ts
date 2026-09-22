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
      return "/creator/dashboard";
    case Workspace.ADMIN_DASHBOARD:
    case "admin_studio":
      return "/admin/dashboard";
    case Workspace.REVIEWER_STUDIO:
    case Workspace.CREATOR_REVIEW_DASHBOARD:
      return "/reviewer/dashboard";
    default:
      return "/creator/dashboard";
  }
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
