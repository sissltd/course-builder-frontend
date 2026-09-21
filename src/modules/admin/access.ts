import type React from "react";
import { AdminRoute } from "@/lib/routes";
import { PERMISSION, type Permission } from "@/modules/auth/permissions";
import {
  Activity,
  Book,
  Box,
  Category,
  Global,
  Graph,
  Hashtag,
  Home2,
  Notification,
  People,
  Profile2User,
  SecurityUser,
  Setting2,
  TickCircle,
  Wallet,
} from "iconsax-react";

/**
 * The admin area's access table — the one place that says which permission a
 * page needs.
 *
 * The sidebar and the route guard both read this, so a link can never be shown
 * for a page the guard would bounce, or hidden for one it would allow. Adding a
 * page means adding one row here.
 *
 * `permissions` is an **any-of** list, read against `Me.permissions`. A row with
 * none is open to every signed-in admin. Every codename is copied from the
 * `Auth:` line of the endpoint the page actually loads rather than guessed from
 * its title, which is why several pages share one:
 *
 * - Overview / Analytics / System Health all read `/admin/overview|analytics|
 *   system-health/`, each of which accepts `dashboard.view` *or*
 *   `dashboard.view_limited` (the limited variant nulls the money figures).
 * - Courses / Production / Published all read `/admin/courses/` and its
 *   `/pending/` and `/approved/` variants, each accepting any of
 *   `courses.view`, `courses.approve` or `courses.reject`.
 * - Topics lists from `/topics/`, which any authenticated user may read, and
 *   carries the request queue — so either permission earns the entry.
 *
 * Notifications is the caller's own inbox at `/users/me/notifications/` and
 * Settings gates its own tabs, so neither has an entry-level permission.
 */
export interface AdminAccessEntry {
  name: string;
  href: AdminRoute;
  icon: React.ComponentType<{
    variant?: "Linear" | "Bold";
    size?: number;
    color?: string;
  }>;
  group: "admin" | "courses" | "system";
  permissions?: readonly Permission[];
}

export const ADMIN_ACCESS: readonly AdminAccessEntry[] = [
  {
    name: "Overview",
    href: AdminRoute.OVERVIEW,
    icon: Home2,
    group: "admin",
    permissions: [PERMISSION.DASHBOARD_VIEW, PERMISSION.DASHBOARD_VIEW_LIMITED],
  },
  {
    name: "Analytics",
    href: AdminRoute.ANALYTICS,
    icon: Graph,
    group: "admin",
    permissions: [PERMISSION.DASHBOARD_VIEW, PERMISSION.DASHBOARD_VIEW_LIMITED],
  },
  {
    name: "Users",
    href: AdminRoute.USERS,
    icon: People,
    group: "admin",
    permissions: [PERMISSION.CREATORS_VIEW_PROFILE],
  },
  {
    name: "MIE Recommendation",
    href: AdminRoute.MIE_RECOMMENDATION,
    icon: TickCircle,
    group: "admin",
    permissions: [PERMISSION.MIE_MANAGE_CONSOLE],
  },
  {
    name: "System Health",
    href: AdminRoute.SYSTEM_HEALTH,
    icon: Global,
    group: "admin",
    permissions: [PERMISSION.DASHBOARD_VIEW, PERMISSION.DASHBOARD_VIEW_LIMITED],
  },
  {
    name: "APE Pipeline",
    href: AdminRoute.APE_PIPELINE,
    icon: Box,
    group: "admin",
    permissions: [PERMISSION.MIE_VIEW_PIPELINE],
  },
  {
    name: "Teams",
    href: AdminRoute.TEAMS,
    icon: Profile2User,
    group: "admin",
    permissions: [PERMISSION.STAFF_VIEW],
  },
  {
    name: "KYC Review",
    href: AdminRoute.KYC_REVIEW,
    icon: SecurityUser,
    group: "admin",
    permissions: [PERMISSION.CREATORS_APPROVE_ACCOUNT],
  },
  {
    name: "Wallets",
    href: AdminRoute.WALLETS,
    icon: Wallet,
    group: "admin",
    permissions: [PERMISSION.CREATORS_VIEW_WALLET],
  },

  {
    name: "Courses",
    href: AdminRoute.COURSES,
    icon: Book,
    group: "courses",
    permissions: [
      PERMISSION.COURSES_VIEW,
      PERMISSION.COURSES_APPROVE,
      PERMISSION.COURSES_REJECT,
    ],
  },
  {
    name: "Production",
    href: AdminRoute.PRODUCTION,
    icon: Box,
    group: "courses",
    permissions: [
      PERMISSION.COURSES_VIEW,
      PERMISSION.COURSES_APPROVE,
      PERMISSION.COURSES_REJECT,
    ],
  },
  {
    name: "Published",
    href: AdminRoute.PUBLISHED,
    icon: Global,
    group: "courses",
    permissions: [
      PERMISSION.COURSES_VIEW,
      PERMISSION.COURSES_APPROVE,
      PERMISSION.COURSES_REJECT,
    ],
  },
  {
    name: "Reservation",
    href: AdminRoute.RESERVATION,
    icon: TickCircle,
    group: "courses",
    permissions: [PERMISSION.CATALOG_VIEW_TOPIC_QUEUE],
  },
  {
    name: "Categories",
    href: AdminRoute.CATEGORIES,
    icon: Category,
    group: "courses",
    permissions: [PERMISSION.CATALOG_MANAGE_CATEGORIES],
  },
  {
    name: "Topics",
    href: AdminRoute.TOPICS,
    icon: Hashtag,
    group: "courses",
    permissions: [
      PERMISSION.CATALOG_MANAGE_TOPICS,
      PERMISSION.CATALOG_VIEW_TOPIC_QUEUE,
    ],
  },

  {
    name: "Notification",
    href: AdminRoute.NOTIFICATIONS,
    icon: Notification,
    group: "system",
  },
  {
    name: "Activity Log",
    href: AdminRoute.ACTIVITY_LOG,
    icon: Activity,
    group: "system",
    permissions: [PERMISSION.AUDIT_VIEW],
  },
  { name: "Setting", href: AdminRoute.SETTINGS, icon: Setting2, group: "system" },
];

/**
 * Pages reachable from the admin area that are not sidebar entries.
 *
 * These are deep-linkable (a course overview opened from a row, the MIE
 * sub-pages behind their parent), so they still need a permission — otherwise
 * the sidebar would hide a link the URL bar could still reach.
 */
const ADMIN_SUB_PAGE_ACCESS: readonly {
  prefix: string;
  permissions: readonly Permission[];
}[] = [
  {
    prefix: AdminRoute.MIE_DEVELOPERS,
    permissions: [PERMISSION.MIE_MANAGE_CONSOLE],
  },
  {
    prefix: AdminRoute.MIE_REJECTION_REASONS,
    permissions: [PERMISSION.MIE_MANAGE_CONSOLE],
  },
  {
    prefix: AdminRoute.COURSE_OVERVIEW,
    permissions: [
      PERMISSION.COURSES_VIEW,
      PERMISSION.COURSES_APPROVE,
      PERMISSION.COURSES_REJECT,
    ],
  },
];

export function adminAccessForPath(
  pathname: string | null,
): readonly Permission[] | undefined {
  if (!pathname) return undefined;

  // Longest prefix wins, so `/admin/mie-recommendation/developers` resolves to
  // its own row rather than the parent's.
  const candidates = [
    ...ADMIN_ACCESS.map((entry) => ({
      prefix: entry.href as string,
      permissions: entry.permissions,
    })),
    ...ADMIN_SUB_PAGE_ACCESS,
  ]
    .filter(
      (entry) =>
        pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`),
    )
    .sort((a, b) => b.prefix.length - a.prefix.length);

  return candidates[0]?.permissions;
}

/**
 * The first admin page the caller may open, used as a redirect target.
 *
 * `null` when the table holds nothing for them. That is not reachable today —
 * Notification and Setting carry no permission, so some row always matches —
 * but returning Overview as a fallback would be actively wrong now that seats
 * other than Admin can enter: it would send a caller to a page they cannot
 * open, and the guard would bounce them straight back.
 */
export function firstAllowedAdminRoute(
  canAny: (permissions: readonly (Permission | string)[]) => boolean,
): string | null {
  const entry = ADMIN_ACCESS.find(
    (candidate) => !candidate.permissions || canAny(candidate.permissions),
  );
  return entry?.href ?? null;
}
