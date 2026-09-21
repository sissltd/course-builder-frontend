import type React from "react";
import { ReviewerRoute } from "@/lib/routes";
import { PERMISSION, type Permission } from "@/modules/auth/permissions";
import { UserRole } from "@/modules/auth/types/auth";
import {
  Activity,
  Eye,
  Global,
  Home2,
  Notification,
  Setting2,
  TaskSquare,
  TickCircle,
} from "iconsax-react";

/**
 * The reviewer area's access table — the counterpart to `@/modules/admin/access`.
 *
 * The sidebar and the route guard both read this, so a link can never be shown
 * for a page the guard would bounce, or hidden for one it would allow.
 *
 * An entry is open when **every** rule it declares passes, and there are two
 * kinds of rule because the backend uses two:
 *
 * - `permissions` — an any-of list read against `Me.permissions`.
 * - `seats` — for rules the backend enforces in the service layer rather than
 *   as a permission. Only `/reviewer/overview/` needs this today.
 *
 * An entry with neither is open to anyone the seat gate already admitted, which
 * is why the self-scoped pages below carry no rule: `/users/me/*` is documented
 * as "Any authenticated user", and inventing a codename for it would hide a page
 * the backend would happily serve.
 */
export interface ReviewerAccessEntry {
  name: string;
  href: ReviewerRoute;
  icon: React.ComponentType<{
    variant?: "Linear" | "Bold";
    size?: number;
    color?: string;
  }>;
  /*
    Three groups, matching the sidebar's own layout: "review" renders under its
    Main Menu heading, "system" under System, and "footer" sits alone at the
    bottom beside the account card.
  */
  group: "review" | "system" | "footer";
  permissions?: readonly Permission[];
  seats?: readonly UserRole[];
}

/**
 * The rule shared by every review-queue page, copied from the endpoints rather
 * than guessed: `/review-queue/` and its `/pending/`, `/in-review/`,
 * `/approved/` and `/published/` variants each carry the identical Auth line —
 * "`courses.approve`, `courses.reject` or `courses.view`". There is genuinely
 * nothing finer to split them by.
 */
const QUEUE_PERMISSIONS = [
  PERMISSION.COURSES_VIEW,
  PERMISSION.COURSES_APPROVE,
  PERMISSION.COURSES_REJECT,
] as const;

export const REVIEWER_ACCESS: readonly ReviewerAccessEntry[] = [
  {
    name: "Overview",
    href: ReviewerRoute.DASHBOARD,
    icon: Home2,
    group: "review",
    /*
      A seat rule, not a permission. `GET /reviewer/overview/` is documented as
      "Creator Reviewer or Verifier (role enforced in the service layer)" — the
      endpoint grants no permission that could stand in for it, and it excludes
      Approvers and QA Reviewers, who are otherwise full members of this
      dashboard. An Approver therefore lands on Pending instead; see
      `firstAllowedReviewerRoute`.
    */
    seats: [UserRole.CREATOR_REVIEWER, UserRole.STAFF_VERIFIER],
  },
  {
    name: "Pending",
    href: ReviewerRoute.PENDING,
    icon: TaskSquare,
    group: "review",
    permissions: QUEUE_PERMISSIONS,
  },
  {
    name: "Approved Courses",
    href: ReviewerRoute.APPROVED_COURSES,
    icon: TickCircle,
    group: "review",
    permissions: QUEUE_PERMISSIONS,
  },
  {
    name: "In review",
    href: ReviewerRoute.IN_REVIEW,
    icon: Eye,
    group: "review",
    permissions: QUEUE_PERMISSIONS,
  },
  {
    name: "Published Courses",
    href: ReviewerRoute.PUBLISHED_COURSES,
    icon: Global,
    group: "review",
    permissions: QUEUE_PERMISSIONS,
  },

  // Self-scoped: `/users/me/activity-log/`, `/users/me/notifications/`. No rule.
  {
    name: "Activity log",
    href: ReviewerRoute.ACTIVITY_LOG,
    icon: Activity,
    group: "system",
  },
  {
    name: "Notification",
    href: ReviewerRoute.NOTIFICATIONS,
    icon: Notification,
    group: "system",
  },
  {
    name: "Setting",
    href: ReviewerRoute.SETTINGS,
    icon: Setting2,
    group: "footer",
  },
];

/**
 * Reviewer routes reachable by URL that are not sidebar entries — the course
 * overview opened from a row, and the three placeholder views. They still need
 * a rule, or the sidebar would hide a link the URL bar could still reach.
 */
const REVIEWER_SUB_PAGE_ACCESS: readonly {
  prefix: string;
  permissions?: readonly Permission[];
}[] = [
  {
    prefix: ReviewerRoute.REVIEW_QUEUE,
    permissions: QUEUE_PERMISSIONS,
  },
  {
    prefix: ReviewerRoute.COURSE_OVERVIEW,
    permissions: QUEUE_PERMISSIONS,
  },
  {
    prefix: ReviewerRoute.COURSES,
    permissions: QUEUE_PERMISSIONS,
  },
  {
    prefix: ReviewerRoute.FEEDBACK,
    permissions: QUEUE_PERMISSIONS,
  },
];

type AccessRule = Pick<ReviewerAccessEntry, "permissions" | "seats">;

/**
 * The single test both the sidebar and the guard use, so a link can never
 * disagree with the page it points at.
 *
 * Fails closed on both axes: `canAny` returns false until the profile
 * resolves, and an entry with a seat rule is closed to a caller whose seat has
 * not resolved either.
 */
export function canOpenReviewerEntry(
  rule: AccessRule,
  canAny: (permissions: readonly (Permission | string)[]) => boolean,
  seat: UserRole | string | null,
): boolean {
  if (rule.permissions && !canAny(rule.permissions)) return false;

  if (rule.seats) {
    const normalized = seat ? String(seat).trim().toUpperCase() : "";
    if (!normalized || !rule.seats.includes(normalized as UserRole)) return false;
  }

  return true;
}

export function reviewerAccessForPath(
  pathname: string | null,
): AccessRule | undefined {
  if (!pathname) return undefined;

  // Longest prefix wins, so a future `/reviewer/dashboard/<x>` resolves to its
  // own row rather than the parent's.
  const candidates = [
    ...REVIEWER_ACCESS.map((entry) => ({
      prefix: entry.href as string,
      rule: entry as AccessRule,
    })),
    ...REVIEWER_SUB_PAGE_ACCESS.map((entry) => ({
      prefix: entry.prefix,
      rule: entry as AccessRule,
    })),
  ]
    .filter(
      (entry) =>
        pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`),
    )
    .sort((a, b) => b.prefix.length - a.prefix.length);

  return candidates[0]?.rule;
}

/**
 * The first reviewer page the caller may open, or `null` when there is none —
 * in which case the guard sends them out of the reviewer area entirely rather
 * than to a landing page they would also be bounced from.
 */
export function firstAllowedReviewerRoute(
  canAny: (permissions: readonly (Permission | string)[]) => boolean,
  seat: UserRole | string | null,
): ReviewerRoute | null {
  const entry = REVIEWER_ACCESS.find((candidate) =>
    canOpenReviewerEntry(candidate, canAny, seat),
  );
  return entry?.href ?? null;
}
