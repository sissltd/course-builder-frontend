import { UserRole, Workspace } from "@/modules/auth/types/auth";

export function getDashboardRoute(workspace?: string): string {
  switch (workspace) {
    case Workspace.CREATOR_STUDIO:
      return "/creator/dashboard";
    case Workspace.ADMIN_STUDIO:
    case "admin_dashboard":
      return "/admin/dashboard";
    case Workspace.REVIEWER_STUDIO:
      return "/reviewer/dashboard";
    default:
      return "/creator/dashboard";
  }
}

export function getWorkspaceForRole(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.STAFF:
      return Workspace.ADMIN_STUDIO;
    case UserRole.REVIEWER:
      return Workspace.REVIEWER_STUDIO;
    case UserRole.COURSE_CREATOR:
    default:
      return Workspace.CREATOR_STUDIO;
  }
}
