export enum CollaboratorRole {
  ADMIN = "ADMIN",
  COLLABORATOR = "COLLABORATOR",
}

export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  REVOKED = "REVOKED",
}

export enum WorkspaceCollaboratorRole {
  ADMIN = "ADMIN",
  AUTHOR = "AUTHOR",
  COLLABORATOR = "COLLABORATOR",
}

/**
 * A roster entry's lifecycle, which is *not* the same ladder as a course
 * invite's (`InviteStatus`): a workspace collaborator is never declined, only
 * invited, accepted into an active seat, or soft-deleted by its owner.
 *
 * REMOVED is a soft delete — `removed_at` is stamped and the row is kept so the
 * past course audit trail stays intact.
 */
export enum WorkspaceCollaboratorStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REMOVED = "REMOVED",
}

export interface CollaboratorModule {
  id: string;
  title: string;
  order: number;
}

export interface CollaboratorCategory {
  id: string;
  name: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  country_of_origin: string;
  date_added: string;
  role: CollaboratorRole;
  role_label: string;
  course_id: string;
  course_title: string;
  category: CollaboratorCategory;
  assigned_modules: CollaboratorModule[];
}

export interface CollaboratorsListParams {
  course_id?: string;
  role?: CollaboratorRole;
  search?: string;
  date_from?: string;
  date_to?: string;
  category?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface UpdateCollaboratorRequest {
  role?: CollaboratorRole;
  assigned_modules?: string[];
}

export interface CourseInvite {
  id: string;
  course: string;
  email: string;
  invitee: Record<string, string> | null;
  role: CollaboratorRole;
  assigned_modules: CollaboratorModule[];
  status: InviteStatus;
  is_expired: boolean;
  expires_at: string;
  responded_at: string | null;
  created_datetime: string;
}

export interface CreateInviteRequest {
  course_id: string;
  email: string;
  role?: CollaboratorRole;
  assigned_modules?: string[];
}

export interface CourseInvitesListParams {
  course_id: string;
  ordering?: string;
  page?: number;
  size?: number;
}

/**
 * One row of the workspace roster. This is account-level, not course-scoped:
 * everyone the caller works with across their workspace.
 *
 * `name`/`email` describe the *person's account*, so they are null until the
 * invitee actually registers — `invited_email` is what the roster knows from
 * the moment the invitation is sent.
 */
export interface WorkspaceCollaborator {
  id: string;
  name: string | null;
  email: string | null;
  owner: string;
  user: string | null;
  invited_email: string;
  role: WorkspaceCollaboratorRole;
  role_label: string;
  sex: string | null;
  country_of_origin: string | null;
  status: WorkspaceCollaboratorStatus;
  removed_at: string | null;
  date_added: string;
  created_datetime: string;
}

/** Invite someone by email — they need no account yet. */
export interface CreateWorkspaceCollaboratorRequest {
  invited_email: string;
  role: WorkspaceCollaboratorRole;
  sex?: string;
  country_of_origin?: string;
  status?: WorkspaceCollaboratorStatus;
}

/** Role or demographic fields only; the roster entry itself is addressed by id. */
export interface UpdateWorkspaceCollaboratorRequest {
  invited_email?: string;
  role?: WorkspaceCollaboratorRole;
  sex?: string;
  country_of_origin?: string;
  status?: WorkspaceCollaboratorStatus;
}

/**
 * Removed people are hidden from the list by default, so callers that want to
 * surface them must pass `status: REMOVED` explicitly.
 */
export interface WorkspaceCollaboratorsListParams {
  role?: WorkspaceCollaboratorRole;
  status?: WorkspaceCollaboratorStatus;
  search?: string;
  /** Course category, a uuid. */
  category?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  size?: number;
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
