/**
 * The backend's `UserRoleEnum`, verbatim.
 *
 * This is the user's *workflow* role — the seat they sit. It decides their
 * login workspace, which review seats they may claim, and whether MFA is
 * mandatory. Their capabilities are a separate axis: see `permissions` on
 * `UserProfile`. A custom role created through `/admin/roles/` still reports
 * one of these values as its `base_role`, so gating on this enum alone hides
 * custom roles — gate on permissions instead.
 */
export enum UserRole {
  COURSE_CREATOR = "COURSE_CREATOR",
  REVIEWER = "REVIEWER",
  CREATOR_REVIEWER = "CREATOR_REVIEWER",
  STAFF_WRITER = "STAFF_WRITER",
  STAFF_VERIFIER = "STAFF_VERIFIER",
  STAFF_APPROVER = "STAFF_APPROVER",
  AI_REVIEWER = "AI_REVIEWER",
  QA_REVIEWER = "QA_REVIEWER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
}

export enum TokenPurpose {
  SIGNUP_VERIFICATION = "SIGNUP_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export enum Workspace {
  CREATOR_STUDIO = "creator_studio",
  ADMIN_DASHBOARD = "admin_dashboard",
  REVIEWER_STUDIO = "reviewer_studio",
  CREATOR_REVIEW_DASHBOARD = "creator_review_dashboard",
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  state?: string;
  address?: string;
  phone_number?: string;
  timezone: string;
  avatar_url: string;
  terms_accepted_at: string | null;
  role: UserRole;
  is_active: boolean;
  status: UserStatus;
  created_datetime: string;
  updated_datetime: string;
  has_completed_onboarding: boolean;
  category?: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country: string;
  phone: string;
  terms_accepted: boolean;
}

export type SignupResponse = User;

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse extends AuthTokens {
  user: User;
}

export interface ResendVerificationRequest {
  email: string;
  purpose: TokenPurpose;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  id_token: string;
}

export interface GoogleSignupRequest {
  id_token: string;
  first_name: string;
  last_name: string;
  country: string;
  terms_accepted: boolean;
}

/**
 * What `/auth/login/` returns once the password is accepted.
 *
 * A discriminated union rather than optional fields: the MFA challenge shape
 * carries no `access`/`refresh` at all, so typing those as optional would leave
 * `result.access` looking like a `string` while it is actually `undefined` —
 * which is exactly how MFA logins used to break.
 */
export interface LoginTokensResponse extends AuthTokens {
  user: User;
  role: UserRole;
  workspace: string;
  mfa_enrollment_overdue?: boolean;
}

/** HTTP 200 from `/auth/login/` when a second factor is enforced. */
export interface MfaChallengeResponse {
  mfa_required: true;
  challenge_token: string;
}

export type LoginResponse = LoginTokensResponse | MfaChallengeResponse;

export interface VerifyMfaChallengeRequest {
  challenge_token: string;
  code: string;
}

/** Redeeming a challenge yields the same payload as a direct login. */
export type VerifyMfaChallengeResponse = LoginTokensResponse;

// ─── MFA enrollment ──────────────────────────────────────────────────────────

export interface MfaEnrollResponse {
  secret: string;
  otpauth_uri: string;
  /** A bare base64 PNG — prefix it with `data:image/png;base64,` to render. */
  qr_code_base64: string;
}

/** Every MFA mutation beyond the challenge takes just a live TOTP code. */
export interface MfaCodeRequest {
  code: string;
}

/**
 * Shown exactly once, at enrollment or regeneration. There is no endpoint that
 * returns them again — only a regenerate, which invalidates the old batch.
 */
export interface MfaRecoveryCodesResponse {
  recovery_codes: string[];
}

export interface RefreshRequest {
  refresh: string;
}

export type RefreshResponse = AuthTokens;

export interface LogoutRequest {
  refresh: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Starting a two-step email change. Identity is proven with the account's
 * *current* password, then a confirmation link goes to `new_email` — nothing
 * about the account changes on this call alone.
 *
 * Both fields are required: a body of `{ new_email }` would 400.
 */
export interface ChangeEmailRequest {
  new_email: string;
  password: string;
}

/**
 * Applying a pending email change. The token is the only credential, so this
 * works for a signed-out caller opening the link from their new inbox. The
 * token is single-use — replaying this fails.
 */
export interface ConfirmChangeEmailRequest {
  token: string;
}

export interface ProfileCategory {
  id: string;
  name: string;
}

/**
 * The role whose *permissions* the user holds — the role card from
 * `/admin/roles/`. This is what a Super Admin assigned them; `base_role` is
 * the built-in workflow role that assignment was derived from.
 */
export interface AccessRole {
  id: string;
  name: string;
  is_system: boolean;
  base_role: string;
}

export type AssignedTrack = "CREATOR_TRACK" | "AI_TRACK" | "ALL" | null;

export interface UserProfile extends Omit<User, "category"> {
  full_name: string;
  member_since: string;
  is_verified: boolean;
  badges: string[];
  category: ProfileCategory | null;
  assigned_track?: AssignedTrack;
  /** Display name for `role`, e.g. `Writer`. Safe to render as-is. */
  role_label: string;
  access_role: AccessRole;
  /**
   * Permission codenames the user holds, sorted. The backend's own guidance:
   * "Use these to decide which controls to show; the API enforces them
   * regardless." Gate UI on these rather than on `role` — a custom role is
   * invisible to role checks. See `@/modules/auth/permissions`.
   */
  permissions: string[];
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  timezone?: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  state?: string;
  address?: string;
  category?: string;
}

export interface OnboardingProfile {
  id: string;
  primary_expertise_category: string | null;
  primary_expertise_area: string | null;
  primary_expertise_other: string | null;
  video_comfort_level: string | null;
  monthly_course_capacity: string | null;
  agreement_accepted_at: string | null;
  onboarding_completed_at: string | null;
  has_completed_onboarding: boolean;
}

export interface UpdateOnboardingRequest {
  category_id?: string;
  expertise_area?: string;
  other_expertise?: string;
  video_comfort_level?: string;
  monthly_course_capacity?: string;
  agreement_accepted?: boolean;
}

export interface NotificationPreferences {
  id: string;
  new_course_assigned: boolean;
  escalation_assigned: boolean;
  creator_feedback: boolean;
  sla_amber_warning: boolean;
  sla_red_critical_alert: boolean;
  sla_breached: boolean;
  kyc_submission_alert: boolean;
  account_deletion_detection_alert: boolean;
  mie_recommendation_alert: boolean;
  mie_pipeline_alert: boolean;
  in_app_enabled: boolean;
  sla_amber_threshold_hours_override: number;
  sla_red_threshold_hours_override: number;
}

export type UpdateNotificationPreferencesRequest = Partial<
  Omit<NotificationPreferences, "id">
>;
