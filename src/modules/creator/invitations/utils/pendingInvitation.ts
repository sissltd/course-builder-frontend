import { toast } from "sonner";

import { normalizeApiError } from "@/lib/api/errors";
import type { WorkspaceCollaborator } from "../../collaborators/types";

/** Locates the roster row an invitation link points at. */
export function findInvitationById(
  rows: WorkspaceCollaborator[],
  inviteId: string,
): WorkspaceCollaborator | undefined {
  return rows.find((row) => row.id === inviteId);
}

export function announceRemovalFailure(error: unknown): void {
  const { message } = normalizeApiError(error as never);
  toast.error(message ?? "Could not remove this collaborator.");
}
