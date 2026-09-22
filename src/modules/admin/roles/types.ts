/**
 * Types for the RBAC endpoints backing Admin → Settings → Roles & Permissions.
 *
 * Shapes are taken from the published OpenAPI examples for
 * `GET /admin/roles/` and `GET /admin/permissions/`, which are hand-written
 * (unlike most of that schema's auto-generated `example:` filler, which
 * disagrees with the live serializers and must not be trusted).
 */

/** A staff position a role can be built on. `InvitableStaffRoleEnum`. */
export enum StaffBaseRole {
  STAFF_WRITER = "STAFF_WRITER",
  STAFF_VERIFIER = "STAFF_VERIFIER",
  STAFF_APPROVER = "STAFF_APPROVER",
  AI_REVIEWER = "AI_REVIEWER",
  QA_REVIEWER = "QA_REVIEWER",
  ADMIN = "ADMIN",
}

export const STAFF_BASE_ROLE_LABELS: Record<StaffBaseRole, string> = {
  [StaffBaseRole.STAFF_WRITER]: "Writer",
  [StaffBaseRole.STAFF_VERIFIER]: "Verifier",
  [StaffBaseRole.STAFF_APPROVER]: "Approver",
  [StaffBaseRole.AI_REVIEWER]: "AI Reviewer",
  [StaffBaseRole.QA_REVIEWER]: "QA Reviewer",
  [StaffBaseRole.ADMIN]: "Admin",
};

export const STAFF_BASE_ROLE_OPTIONS = (
  Object.keys(STAFF_BASE_ROLE_LABELS) as StaffBaseRole[]
).map((value) => ({ label: STAFF_BASE_ROLE_LABELS[value], value }));

/**
 * One role card from `GET /admin/roles/`.
 *
 * `permissions` holds codenames only — labels live on the permission groups,
 * so the two endpoints are always paired.
 */
export interface RoleCard {
  id: string;
  name: string;
  description: string;
  base_role: StaffBaseRole | string;
  base_role_label: string;
  /** True for the platform's built-in roles. */
  is_system: boolean;
  is_locked: boolean;
  is_deletable: boolean;
  /** Whether *the caller* may edit this role — drives the row menu. */
  can_edit: boolean;
  member_count: number;
  permissions: string[];
}

export interface PermissionItem {
  codename: string;
  label: string;
  description: string;
  /** Codenames this one pulls in with it, if any. */
  implies: string[];
  /**
   * Whether this permission may be given to Course Creator / Creator Reviewer,
   * who every public sign-up holds.
   */
  grantable_to_public_roles: boolean;
  /**
   * Whether *the caller* may grant this one. The API 403s on codenames you do
   * not hold yourself, so chips must be disabled rather than merely warned.
   */
  grantable_by_you: boolean;
}

export interface PermissionGroup {
  key: string;
  label: string;
  /** True for a group the design shows; false for backend-only extras. */
  is_design_group: boolean;
  permissions: PermissionItem[];
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  /**
   * Required, and immutable once the role exists: it decides which review
   * seats members may sit, whether MFA is mandatory, and their workspace.
   */
  base_role: StaffBaseRole;
  permissions: string[];
}

export interface RoleUpdateRequest {
  /** Custom roles only. */
  name?: string;
  description?: string;
  /**
   * The **complete** new permission set, not a patch. Sending a subset removes
   * everything left out.
   */
  permissions?: string[];
}

/** A member of a role, from `GET /admin/roles/{id}/members/`. */
export interface RoleMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_label: string;
  is_active: boolean;
  status: string;
  created_datetime: string;
}
