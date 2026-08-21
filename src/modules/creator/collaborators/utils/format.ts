import { CollaboratorRole } from "../types";
import type { Collaborator } from "../types";

const AVATAR_COLORS = [
  "#0063EF",
  "#F05A25",
  "#27AE60",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
];

export function getCollaboratorRoleDisplay(role: CollaboratorRole): string {
  switch (role) {
    case CollaboratorRole.ADMIN:
      return "Admin";
    case CollaboratorRole.COLLABORATOR:
      return "Collaborator";
    default:
      return "Collaborator";
  }
}

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getCollaboratorInitials(collaborator: Collaborator): string {
  const first = collaborator.user.first_name?.[0] ?? "";
  const last = collaborator.user.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function formatCollaboratorDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
