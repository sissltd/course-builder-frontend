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
  ADMIN_STUDIO = "admin_studio",
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
