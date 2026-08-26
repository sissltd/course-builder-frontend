export enum CollaboratorRole {
  ADMIN = "ADMIN",
  COLLABORATOR = "COLLABORATOR",
}

export interface CollaboratorUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  sex: string;
}

export interface CollaboratorModule {
  id: string;
  title: string;
  order: number;
}

export interface Collaborator {
  id: string;
  user: CollaboratorUser;
  role: CollaboratorRole;
  assigned_modules: CollaboratorModule[];
  created_datetime: string;
}

export interface InviteCollaboratorRequest {
  course_id: string;
  email: string;
  role?: CollaboratorRole;
  assigned_modules?: string[];
}

export interface UpdateCollaboratorRequest {
  role?: CollaboratorRole;
  assigned_modules?: string[];
}

export interface CollaboratorsListParams {
  course_id: string;
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
