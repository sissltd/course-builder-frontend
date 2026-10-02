export enum AuthRoute {
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  REGISTER_SUCCESS = "/auth/register/success",
  FORGOT_PASSWORD = "/auth/forgot-password",
  RESET_PASSWORD = "/auth/reset-password",
  VERIFY_EMAIL = "/auth/verify-email",
  CHANGE_EMAIL = "/change-email",
  CHANGE_EMAIL_CONFIRM = "/auth/change-email/confirm",
  ONBOARDING = "/auth/onboarding",
  ACCEPT_INVITATION = "/accept-invitation",
  SIGNUP_GOOGLE = "/auth/signup-google",
}

export enum WebsiteRoute {
  HOME = "/",
  TERMS = "/terms",
  PRIVACY = "/privacy",
  ABOUT = "/about",
  CONTACT = "/contact",
  CREATORS = "/creators",
  COOKIES = "/cookies",
}

export enum AdminRoute {
  OVERVIEW = "/admin/dashboard",
  ANALYTICS = "/admin/analytics",
  MIE_RECOMMENDATION = "/admin/mie-recommendation",
  MIE_DEVELOPERS = "/admin/mie-recommendation/developers",
  MIE_REJECTION_REASONS = "/admin/mie-recommendation/rejection-reasons",
  SYSTEM_HEALTH = "/admin/system-health",
  APE_PIPELINE = "/admin/ape-pipeline",
  USERS = "/admin/users",
  TEAMS = "/admin/teams",
  COURSES = "/admin/courses",
  PRODUCTION = "/admin/production",
  PUBLISHED = "/admin/published",
  RESERVATION = "/admin/reservation",
  CATEGORIES = "/admin/categories",
  TOPICS = "/admin/topics",
  NOTIFICATIONS = "/admin/notifications",
  ACTIVITY_LOG = "/admin/activity-log",
  SETTINGS = "/admin/settings",
  COURSE_OVERVIEW = "/admin/course-overview",
  KYC_REVIEW = "/admin/kyc-review",
  WALLETS = "/admin/wallets",
  SUPPORT = "/admin/support",
  /**
   * Next's dynamic segment for the support request detail page. Not a URL you
   * navigate to directly — build one with `adminSupportDetailRoute`, so the
   * segment is never hand-written as a literal at a call site.
   */
  SUPPORT_DETAIL = "/admin/support/[id]",
}

/**
 * The admin support request detail page for one id.
 *
 * Lives beside the enum rather than in a component so the `[id]` segment has a
 * single owner: a literal `` `${AdminRoute.SUPPORT}/${id}` `` at a call site
 * would satisfy the same route but would no longer be traceable to a member,
 * which is exactly what the "no hardcoded route strings" rule exists to prevent.
 */
export const adminSupportDetailRoute = (id: string): string =>
  AdminRoute.SUPPORT_DETAIL.replace("[id]", encodeURIComponent(id));

export enum CreatorRoute {
  DASHBOARD = "/creator/dashboard",
  COURSES = "/creator/courses",
  COURSES_CREATE = "/creator/courses/create",
  COURSES_AI_CREATE = "/creator/courses/create-with-ai",
  COURSES_BUILDER = "/creator/courses/builder",
  COURSES_IMPORT = "/creator/courses/import",
  DRAFTS = "/creator/drafts",
  COLLABORATORS = "/creator/collaborators",
  INVITATIONS = "/creator/invitations",
  WALLET = "/creator/wallet",
  RESERVATION = "/creator/reservation",
  NOTIFICATIONS = "/creator/notifications",
  PROFILE = "/creator/profile",
  SETTINGS = "/creator/settings",
  HELP = "/creator/help",
  SUPPORT = "/creator/support",
  KYC = "/creator/kyc",
}

export enum ReviewerRoute {
  DASHBOARD = "/reviewer/dashboard",
  PENDING = "/reviewer/pending",
  APPROVED_COURSES = "/reviewer/approved-courses",
  IN_REVIEW = "/reviewer/in-review",
  PUBLISHED_COURSES = "/reviewer/published-courses",
  COURSES = "/reviewer/courses",
  ACTIVITY_LOG = "/reviewer/activity-log",
  NOTIFICATIONS = "/reviewer/notifications",
  SETTINGS = "/reviewer/settings",
  COURSE_OVERVIEW = "/reviewer/course-overview",
  FEEDBACK = "/reviewer/feedback",
  REVIEW_QUEUE = "/reviewer/review-queue",
}
