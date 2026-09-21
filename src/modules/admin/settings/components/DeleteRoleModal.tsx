"use client";

import React, { useMemo, useState } from "react";
import { Trash } from "iconsax-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useDeleteRoleMutation } from "@/modules/admin/roles/api/rolesApi";
import type { RoleCard } from "@/modules/admin/roles/types";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleCard | null;
  /** Every role, used to build the reassignment options. */
  roles: RoleCard[];
  onDeleted?: () => void;
}

/**
 * Deletes a custom role.
 *
 * A role with members cannot be deleted without naming where those members go:
 * the endpoint returns **409 and changes nothing** if `reassign_to_role_id` is
 * missing. `member_count` is on the role card precisely so this can be asked
 * before the call rather than discovered from a failure, so the select is shown
 * up front when the count is non-zero.
 *
 * The candidates are restricted to roles sharing this one's `base_role`, which
 * the endpoint requires — a member's seat is a property of their base role, and
 * moving them across would silently change which review seats they can sit.
 */
export const DeleteRoleModal = ({
  isOpen,
  onOpenChange,
  role,
  roles,
  onDeleted,
}: DeleteRoleModalProps) => {
  const [reassignTo, setReassignTo] = useState("");
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

  const memberCount = role?.member_count ?? 0;
  const hasMembers = memberCount > 0;

  const reassignOptions = useMemo(
    () =>
      roles
        .filter(
          (candidate) =>
            candidate.id !== role?.id &&
            candidate.base_role === role?.base_role,
        )
        .map((candidate) => ({ label: candidate.name, value: candidate.id })),
    [roles, role?.id, role?.base_role],
  );

  const canDelete = !hasMembers || reassignTo.length > 0;

  const handleClose = () => {
    setReassignTo("");
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!role || !canDelete) return;

    try {
      await deleteRole({
        id: role.id,
        reassignToRoleId: hasMembers ? reassignTo : undefined,
      }).unwrap();

      toast.success(
        hasMembers
          ? `Role “${role.name}” deleted — ${memberCount} member${memberCount === 1 ? "" : "s"} moved`
          : `Role “${role.name}” deleted`,
      );
      onDeleted?.();
      handleClose();
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not delete the role");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleClose();
      }}
    >
      <div className="flex flex-col gap-[16px] p-2">
        <div className="flex items-center gap-[12px]">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[var(--sd-danger-soft)] text-[var(--sd-danger)]">
            <Trash size={22} variant="Bold" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold text-sd-grey-12">
              Delete role
            </h3>
            <p className="text-[13px] text-sd-grey-9">
              {role ? `Deleting “${role.name}”` : "Deleting this role"}
            </p>
          </div>
        </div>

        {hasMembers ? (
          <>
            <p className="text-[13px] leading-[20px] text-sd-grey-11">
              {memberCount} {memberCount === 1 ? "person holds" : "people hold"}{" "}
              this role. They will be moved to the role you pick below and
              signed out everywhere, so they will need to sign in again.
            </p>
            <FormSelect
              name="reassignToRole"
              label="Move members to"
              placeholder={
                reassignOptions.length > 0
                  ? "Select a role"
                  : "No other role shares this base role"
              }
              options={reassignOptions}
              value={reassignTo}
              onValueChange={setReassignTo}
            />
            {reassignOptions.length === 0 && (
              <span className="text-[12px] leading-[18px] text-[var(--sd-danger)]">
                Members can only be moved to a role with the same base role, and
                there is no other one. Create one first, or move these people
                individually from Teams.
              </span>
            )}
          </>
        ) : (
          <p className="text-[13px] leading-[20px] text-sd-grey-11">
            Nobody holds this role, so nothing else changes. Built-in roles
            cannot be deleted — only custom ones.
          </p>
        )}

        <div className="flex items-center justify-end gap-[10px] pt-[8px]">
          <AppButton
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleClose}
            className="h-[40px] px-[16px]"
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            variant="destructive"
            disabled={isLoading || !canDelete}
            onClick={handleConfirm}
            className="h-[40px] px-[16px]"
          >
            {isLoading ? "Deleting..." : "Delete role"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
