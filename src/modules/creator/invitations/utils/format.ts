import type {
  WorkspaceCollaborator,
  WorkspaceCollaboratorRole,
  WorkspaceCollaboratorStatus,
} from "../../collaborators/types";

export const ROLE_LABELS: Record<WorkspaceCollaboratorRole, string> = {
  ADMIN: "Admin",
  AUTHOR: "Author",
  COLLABORATOR: "Collaborator",
};

export const STATUS_LABELS: Record<WorkspaceCollaboratorStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  REMOVED: "Removed",
};

/** Badge styling per lifecycle state, matching the pill used on the courses table. */
export const STATUS_STYLES: Record<
  WorkspaceCollaboratorStatus,
  { chip: string; dot: string }
> = {
  PENDING: { chip: "bg-[#FFF4E5] text-[#B54708]", dot: "bg-[#F79009]" },
  ACTIVE: { chip: "bg-[#E6F9EF] text-[#008500]", dot: "bg-[#008500]" },
  REMOVED: { chip: "bg-[#F0F0F0] text-[#636363]", dot: "bg-[#B6B6B6]" },
};

/**
 * A roster row has no account until the invitee registers, so the display name
 * falls back to the invited address rather than rendering an empty cell.
 */
export function getCollaboratorDisplayName(
  collaborator: Pick<WorkspaceCollaborator, "name" | "invited_email">,
): string {
  return collaborator.name?.trim() || collaborator.invited_email;
}

const AVATAR_COLORS = [
  "#0063EF",
  "#F05A25",
  "#606060",
  "#FF5025",
  "#2E7D32",
  "#7B1FA2",
];

export function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
