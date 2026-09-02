export enum AuthRoute {
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  REGISTER_SUCCESS = "/auth/register/success",
  FORGOT_PASSWORD = "/auth/forgot-password",
  RESET_PASSWORD = "/auth/reset-password",
  VERIFY_EMAIL = "/auth/verify-email",
  ONBOARDING = "/auth/onboarding",
}

export enum WebsiteRoute {
  HOME = "/",
  TERMS = "/terms",
  PRIVACY = "/privacy",
  ABOUT = "/about",
  CONTACT = "/contact",
  COMPANY = "/company",
  CREATORS = "/creators",
  PRODUCT = "/product",
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
  TEAMS = "/admin/teams",
  COURSES = "/admin/courses",
  PRODUCTION = "/admin/production",
  PUBLISHED = "/admin/published",
  RESERVATION = "/admin/reservation",
  CATEGORIES = "/admin/categories",
  NOTIFICATIONS = "/admin/notifications",
  ACTIVITY_LOG = "/admin/activity-log",
  SETTINGS = "/admin/settings",
  COURSE_OVERVIEW = "/admin/course-overview",
  KYC_REVIEW = "/admin/kyc-review",
  WALLETS = "/admin/wallets",
}

export enum CreatorRoute {
  DASHBOARD = "/creator/dashboard",
  COURSES = "/creator/courses",
  COURSES_CREATE = "/creator/courses/create",
  COURSES_BUILDER = "/creator/courses/builder",
  DRAFTS = "/creator/drafts",
  COLLABORATORS = "/creator/collaborators",
  WALLET = "/creator/wallet",
  RESERVATION = "/creator/reservation",
  NOTIFICATIONS = "/creator/notifications",
  PROFILE = "/creator/profile",
  SETTINGS = "/creator/settings",
  HELP = "/creator/help",
  KYC = "/creator/kyc",
}

export enum ReviewerRoute {
  DASHBOARD = "/reviewer/dashboard",
  PENDING = "/reviewer/pending",
  APPROVED_COURSES = "/reviewer/approved-courses",
  IN_REVIEW = "/reviewer/in-review",
  PUBLISHED_COURSES = "/reviewer/published-courses",
  ACTIVITY_LOG = "/reviewer/activity-log",
  NOTIFICATIONS = "/reviewer/notifications",
  SETTINGS = "/reviewer/settings",
  COURSE_OVERVIEW = "/reviewer/course-overview",
  FEEDBACK = "/reviewer/feedback",
  REVIEW_QUEUE = "/reviewer/review-queue",
}
