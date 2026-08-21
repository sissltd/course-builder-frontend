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

export enum StaffRole {
  STAFF_WRITER = "STAFF_WRITER",
  STAFF_VERIFIER = "STAFF_VERIFIER",
  STAFF_APPROVER = "STAFF_APPROVER",
}

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
}

export interface SuspendUserRequest {
  reason: string;
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
  role: StaffRole;
}

export interface StaffActionResponse {
  detail: string;
  staff: StaffMember;
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
