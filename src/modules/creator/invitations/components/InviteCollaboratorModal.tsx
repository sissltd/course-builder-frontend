"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import {
  WorkspaceCollaboratorRole,
  WorkspaceCollaboratorStatus,
} from "../../collaborators/types";
import {
  useInviteWorkspaceCollaboratorMutation,
  useUpdateWorkspaceCollaboratorMutation,
} from "../../collaborators/hooks";
import { normalizeApiError } from "@/lib/api/errors";
import { ROLE_LABELS } from "../utils/format";

const ROLE_OPTIONS = (
  Object.values(WorkspaceCollaboratorRole) as WorkspaceCollaboratorRole[]
).map((role) => ({ label: ROLE_LABELS[role], value: role }));

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: () => void;
}

/**
 * Adding someone to the workspace roster. They need no account yet — the
 * backend accepts a bare email and issues the invitation, which is why this is
 * a single field rather than a person picker.
 */
export const InviteCollaboratorModal = ({
  isOpen,
  onOpenChange,
  onInvited,
}: InviteCollaboratorModalProps) => {
  const [invite, { isLoading }] = useInviteWorkspaceCollaboratorMutation();
  const [invitedEmail, setInvitedEmail] = useState("");
  const [role, setRole] = useState<WorkspaceCollaboratorRole>(
    WorkspaceCollaboratorRole.COLLABORATOR,
  );

  const reset = () => {
    setInvitedEmail("");
    setRole(WorkspaceCollaboratorRole.COLLABORATOR);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmed = invitedEmail.trim();
    if (!trimmed) {
      toast.error("Please enter an email address.");
      return;
    }

    try {
      await invite({
        invited_email: trimmed,
        role,
        status: WorkspaceCollaboratorStatus.PENDING,
      }).unwrap();
      toast.success(`Invitation sent to ${trimmed}.`);
      onInvited?.();
      handleClose();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      if (fieldErrors.invited_email) {
        toast.error(fieldErrors.invited_email);
      }
      toast.error(message ?? "Could not send this invitation.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Invite someone to your workspace"
      description="They will receive an invitation by email. They do not need an account yet."
      showCloseButton={false}
    >
      <div className="flex flex-col gap-[20px] mt-[8px]">
        <FormInput
          name="invited_email"
          label="Email address"
          placeholder="person@example.com"
          type="email"
          required
          value={invitedEmail}
          onChange={(e) => setInvitedEmail(e.target.value)}
        />
        <FormSelect
          name="role"
          label="Role"
          placeholder="Select role"
          options={ROLE_OPTIONS}
          value={role}
          onValueChange={(value) =>
            setRole(value as WorkspaceCollaboratorRole)
          }
        />
        <div className="flex gap-[12px]">
          <Button
            variant="app-outline"
            className="flex-1 h-[44px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="flex-1 h-[44px]"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Send invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface ChangeRoleModalProps {
  collaboratorId: string | null;
  currentRole: WorkspaceCollaboratorRole | null;
  displayName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

/** Role or status only — PATCH addresses the roster entry by id. */
export const ChangeRoleModal = ({
  collaboratorId,
  currentRole,
  displayName,
  isOpen,
  onOpenChange,
  onUpdated,
}: ChangeRoleModalProps) => {
  const [update, { isLoading }] = useUpdateWorkspaceCollaboratorMutation();
  // Seeded once per mount; the caller keys this component on the collaborator
  // so opening a different row remounts it with that row's role.
  const [role, setRole] = useState<WorkspaceCollaboratorRole | null>(currentRole);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!collaboratorId || !role) return;
    if (role === currentRole) {
      handleClose();
      return;
    }

    try {
      await update({ id: collaboratorId, body: { role } }).unwrap();
      toast.success(`${displayName} is now an ${ROLE_LABELS[role]}.`);
      onUpdated?.();
      handleClose();
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Could not update this role.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Change role"
      description={`Update the workspace role for ${displayName}.`}
      showCloseButton={false}
    >
      <div className="flex flex-col gap-[20px] mt-[8px]">
        <FormSelect
          name="role"
          label="Role"
          placeholder="Select role"
          options={ROLE_OPTIONS}
          value={role ?? undefined}
          onValueChange={(value) => setRole(value as WorkspaceCollaboratorRole)}
        />
        <div className="flex gap-[12px]">
          <Button
            variant="app-outline"
            className="flex-1 h-[44px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="flex-1 h-[44px]"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Save role
          </Button>
        </div>
      </div>
    </Modal>
  );
};
