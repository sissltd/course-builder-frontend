export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  STAFF = "STAFF",
  COURSE_CREATOR = "COURSE_CREATOR",
  REVIEWER = "REVIEWER",
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

export interface LoginResponse extends AuthTokens {
  user: User;
  role: UserRole;
  workspace: string;
  mfa_enrollment_overdue?: boolean;
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

export interface ProfileCategory {
  id: string;
  name: string;
}

export interface UserProfile extends User {
  full_name: string;
  member_since: string;
  is_verified: boolean;
  badges: string[];
  category: ProfileCategory | null;
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
