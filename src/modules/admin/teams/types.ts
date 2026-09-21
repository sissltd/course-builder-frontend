export enum AdminUserRole {
  COURSE_CREATOR = "COURSE_CREATOR",
  CREATOR_REVIEWER = "CREATOR_REVIEWER",
  STAFF_WRITER = "STAFF_WRITER",
  STAFF_VERIFIER = "STAFF_VERIFIER",
  STAFF_APPROVER = "STAFF_APPROVER",
  AI_REVIEWER = "AI_REVIEWER",
  QA_REVIEWER = "QA_REVIEWER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum AdminUserStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

/*
  The invitable positions are `StaffBaseRole` (see `admin/roles/types`), which is
  the backend's `InvitableStaffRoleEnum` — the same six values this endpoint
  accepts. Re-exported rather than redeclared so a role added on the backend
  cannot drift between the invite dialog and the role builder.
*/
export {
  StaffBaseRole,
  StaffBaseRole as StaffRole,
} from "@/modules/admin/roles/types";
import type { StaffBaseRole } from "@/modules/admin/roles/types";

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_label: string;
  status: string;
  status_label: string;
  is_active: boolean;
  is_locked: boolean;
  country: string;
  last_login: string | null;
  created_datetime: string;
}

export interface UsersListParams {
  role?: string;
  status?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  size?: number;
  page_size?: number;
}

export interface SuspendUserRequest {
  reason: string;
  assigned_track?: string;
}

export interface DeactivateUserRequest {
  reason: string;
}

export interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_label: string;
  invitation_status: string;
  invited_by: string;
  created_datetime: string;
}

export interface InviteStaffRequest {
  email: string;
  first_name: string;
  last_name: string;
  /**
   * A built-in position. Send this or `role_id`, **not both** — the endpoint
   * documents `role_id` as the preference, because only it can name a custom
   * role built through Admin → Settings → Roles & Permissions.
   */
  role?: StaffBaseRole;
  /** A built-in *or* custom staff role, from `GET /admin/roles/`. */
  role_id?: string;
}

/** `POST /auth/staff/{id}/change-role/` */
export interface ChangeStaffRoleRequest {
  role_id: string;
}

/**
 * `POST /auth/staff/{id}/erase/`.
 *
 * Both fields are required. The endpoint refuses with 409 while the member's
 * wallet still holds a balance or a payout is in flight.
 */
export interface EraseAccountRequest {
  /** Must match the account's email exactly, character for character. */
  confirm_email: string;
  /** Kept in the audit log. 1–500 characters. */
  reason: string;
}

/**
 * The generic body the lifecycle actions return — revoke and reactivate instead
 * return `StaffActionResponse`.
 */
export interface SuccessEnvelope {
  success?: boolean;
  status: number;
  message: string;
  data?: unknown;
  technical_message?: string | null;
}

export interface StaffActionResponse {
  detail: string;
  staff: StaffMember;
}

export interface AcceptStaffInvitationRequest {
  email: string;
  token: string;
  password: string;
}

export interface AcceptStaffInvitationResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    created_datetime: string;
    has_completed_onboarding?: boolean;
    country?: string;
    state?: string;
    address?: string;
    phone_number?: string;
    timezone?: string;
    avatar_url?: string;
    status?: string;
  };
}

export interface PaginatedPaginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number: number | null;
  next: string | null;
  previous_page_number: number | null;
  previous: string | null;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: T;
  };
}
