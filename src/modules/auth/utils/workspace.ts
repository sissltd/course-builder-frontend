import { UserRole, Workspace } from "@/modules/auth/types/auth";

export function getDashboardRoute(workspace?: string): string {
  switch (workspace) {
    case Workspace.CREATOR_STUDIO:
      return "/creator/dashboard";
    case Workspace.ADMIN_STUDIO:
      return "/admin/dashboard";
    case Workspace.REVIEWER_STUDIO:
      return "/reviewer/dashboard";
    default:
      return "/creator/dashboard";
  }
}

export function getWorkspaceForRole(role: UserRole): string {
  switch (role) {
    case UserRole.REVIEWER:
      return Workspace.REVIEWER_STUDIO;
    case UserRole.COURSE_CREATOR:
      return Workspace.CREATOR_STUDIO;
    default:
      return Workspace.CREATOR_STUDIO;
  }
}
