/**
 * Permission codenames the frontend gates on.
 *
 * These are deliberately *not* the full set — `GET /admin/permissions/` returns
 * every permission with its label, description and group, and that is what the
 * Roles & Permissions screen renders. This file only names the handful the UI
 * actually branches on, so a typo is a compile error rather than a control that
 * silently never appears.
 *
 * The backend's guidance on `Me.permissions`: "Use these to decide which
 * controls to show; the API enforces them regardless." Gating here is a UX
 * affordance, never a security boundary.
 */
export const PERMISSION = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",
  /** Same surfaces as `dashboard.view`, with money figures nulled out. */
  DASHBOARD_VIEW_LIMITED: "dashboard.view_limited",

  // Courses / review
  COURSES_VIEW: "courses.view",
  COURSES_CREATE: "courses.create",
  COURSES_EDIT: "courses.edit",
  COURSES_APPROVE: "courses.approve",
  COURSES_REJECT: "courses.reject",
  COURSES_PUBLISH: "courses.publish",
  COURSES_ASSIGN: "courses.assign",
  COURSES_SET_PRICING: "courses.set_pricing",

  // Catalog
  CATALOG_MANAGE_CATEGORIES: "catalog.manage_categories",
  CATALOG_MANAGE_TOPICS: "catalog.manage_topics",
  CATALOG_VIEW_TOPIC_QUEUE: "catalog.view_topic_queue",

  // Staff
  STAFF_VIEW: "staff.view",
  STAFF_VIEW_DETAIL: "staff.view_detail",
  STAFF_ADD: "staff.add",
  STAFF_FULL_ACCESS: "staff.full_access",
  STAFF_DELETE: "staff.delete",
  STAFF_RESET_PASSWORD: "staff.reset_password",

  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  // Creators
  CREATORS_VIEW_WALLET: "creators.view_wallet",
  CREATORS_VIEW_PROFILE: "creators.view_profile",
  CREATORS_APPROVE_ACCOUNT: "creators.approve_account",

  // Platform
  AUDIT_VIEW: "audit.view",
  MIE_VIEW_PIPELINE: "mie.view_pipeline",
  MIE_MANAGE_CONSOLE: "mie.manage_console",
  PLATFORM_EDIT_SETTINGS: "platform.edit_settings",

  /*
    The `teams.*` pair governs *non-staff* accounts — Course Creators and
    Creator Reviewers, reached through `/users/admin/`. The `staff.*` set above
    governs the staff roster. The two families are deliberately separate on the
    backend and an account of the wrong kind answers 404, so a control must pick
    the family that matches the row it acts on.
  */
  TEAMS_INVITE: "teams.invite",
  TEAMS_RESET_PASSWORD: "teams.reset_password",
  TEAMS_DELETE_ACCOUNT: "teams.delete_account",
  TEAMS_SUSPEND: "teams.suspend",
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];
