import { UserRole, Workspace } from "@/modules/auth/types/auth";

export function getDashboardRoute(workspace?: string): string {
  switch (workspace?.toLowerCase()) {
    case Workspace.CREATOR_STUDIO:
      return "/creator/dashboard";
    case Workspace.ADMIN_DASHBOARD:
    case "admin_studio":
      return "/admin/dashboard";
    case Workspace.REVIEWER_STUDIO:
      return "/reviewer/dashboard";
    default:
      return "/creator/dashboard";
  }
}

export function getWorkspaceForRole(role?: UserRole | string): string {
  const normalized = String(role || "").toUpperCase();
  switch (normalized) {
    case UserRole.SUPER_ADMIN:
    case UserRole.STAFF:
    case "SUPER_ADMIN":
    case "ADMIN":
    case "STAFF":
      return Workspace.ADMIN_DASHBOARD;
    case UserRole.REVIEWER:
    case "REVIEWER":
    case "STAFF_WRITER":
    case "STAFF_VERIFIER":
    case "STAFF_APPROVER":
    case "CREATOR_REVIEWER":
    case "AI_REVIEWER":
    case "QA_REVIEWER":
      return Workspace.REVIEWER_STUDIO;
    case UserRole.COURSE_CREATOR:
    case "COURSE_CREATOR":
    default:
      return Workspace.CREATOR_STUDIO;
  }
}
