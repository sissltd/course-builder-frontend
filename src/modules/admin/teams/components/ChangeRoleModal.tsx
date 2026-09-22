"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useChangeStaffRoleMutation } from "../hooks";
import { useGetRolesQuery } from "@/modules/admin/roles/api/rolesApi";
import type { TeamRow } from "./TeamActionMenu";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamRow | null;
  onChanged?: () => void;
}

/**
 * Moves a staff member to another role — built-in or custom.
 *
 * The picker is every role from `GET /admin/roles/`. That endpoint already
 * returns only staff roles (a role's `base_role` is one of the six staff
 * positions), so there is nothing to filter on kind — only the member's current
 * role is removed, because the endpoint refuses a role they already hold.
 *
 * The member is signed out everywhere by this call, and any review seat they
 * had claimed but not decided that the new role cannot sit goes back to the
 * queue. Both are stated up front rather than discovered afterwards.
 */
export const ChangeRoleModal = ({
  isOpen,
  onOpenChange,
  member,
  onChanged,
}: ChangeRoleModalProps) => {
  const [roleId, setRoleId] = useState("");
  const { data: roles } = useGetRolesQuery();
  const [changeStaffRole, { isLoading }] = useChangeStaffRoleMutation();

  const options = useMemo(
    () =>
      (roles ?? [])
        .filter((role) => role.id !== member?.roleId)
        .map((role) => ({
          label: role.is_system
            ? role.name
            : `${role.name} · ${role.base_role_label}`,
          value: role.id,
        })),
    [roles, member?.roleId],
  );

  const handleClose = () => {
    setRoleId("");
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!member || !roleId || isLoading) return;

    try {
      const res = await changeStaffRole({
        id: member.userId,
        body: { role_id: roleId },
      }).unwrap();

      const nextRole = (roles ?? []).find((role) => role.id === roleId);
      toast.success(
        res?.message ??
          `${member.name} is now ${nextRole?.name ?? "in the new role"}`,
        {
          description:
            "They have been signed out everywhere and notified. Any review seat they had claimed is released if the new role cannot sit it.",
        },
      );
      onChanged?.();
      handleClose();
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not change the role");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleClose();
      }}
      title="Change role"
      className="sm:max-w-[500px]"
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#606060]">
          Moving{" "}
          <span className="font-medium text-[#202020]">{member?.name}</span> from{" "}
          <span className="font-medium text-[#202020]">
            {member?.roleLabel || member?.role}
          </span>
          . Their permissions come from the role you pick.
        </p>

        <FormSelect
          name="changeRole"
          label="New role"
          placeholder="Select a role"
          options={options}
          value={roleId}
          onValueChange={setRoleId}
        />

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="outline"
            className="h-[44px] flex-1 text-[14px]"
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            className="h-[44px] flex-1 text-[14px]"
            disabled={isLoading || !roleId}
            onClick={handleSave}
          >
            {isLoading ? "Changing..." : "Change role"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
