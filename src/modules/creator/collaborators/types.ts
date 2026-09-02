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

export interface WorkspaceCollaborator {
  id: string;
  owner: string;
  user: string | null;
  invited_email: string;
  role: WorkspaceCollaboratorRole;
  sex: string | null;
  country_of_origin: string | null;
  status: InviteStatus;
  removed_at: string | null;
  created_datetime: string;
}

export interface CreateWorkspaceCollaboratorRequest {
  invited_email: string;
  role: WorkspaceCollaboratorRole;
  sex?: string;
  country_of_origin?: string;
}

export interface UpdateWorkspaceCollaboratorRequest {
  invited_email?: string;
  role?: WorkspaceCollaboratorRole;
  sex?: string;
  country_of_origin?: string;
}

export interface WorkspaceCollaboratorsListParams {
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
