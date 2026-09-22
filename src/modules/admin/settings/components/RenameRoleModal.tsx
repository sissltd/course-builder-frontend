"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { normalizeApiError } from "@/lib/api/errors";
import { useUpdateRoleMutation } from "@/modules/admin/roles/api/rolesApi";
import type { RoleCard } from "@/modules/admin/roles/types";

interface RenameRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleCard | null;
}

/**
 * Renames a custom role.
 *
 * Built-in roles reject `name` — the endpoint documents "Custom roles only" —
 * so the menu that opens this is only offered when `is_system` is false. Only
 * the name is sent; permissions are edited as chips on the tab itself and
 * `permissions` on this endpoint is a full replacement, so including it here
 * would risk blanking the set.
 */
export const RenameRoleModal = ({
  isOpen,
  onOpenChange,
  role,
}: RenameRoleModalProps) => {
  const [name, setName] = useState("");
  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const handleClose = () => {
    setName("");
    onOpenChange(false);
  };

  const trimmed = name.trim();
  const canSubmit =
    trimmed.length > 0 && trimmed !== role?.name && !isLoading;

  const handleSave = async () => {
    if (!role || !canSubmit) return;

    try {
      await updateRole({ id: role.id, body: { name: trimmed } }).unwrap();
      toast.success(`Role renamed to “${trimmed}”`);
      handleClose();
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not rename the role");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      showCloseButton={false}
      className="sm:max-w-[520px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
              Edit role
            </span>
            <span className="text-[13px] text-sd-grey-9">
              {role?.name}
            </span>
          </div>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close edit role modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[24px] pt-[4px]">
        <FormInput
          name="roleTitle"
          label="Role title"
          placeholder={role?.name ?? "Enter name"}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
        />

        <p className="text-[12px] leading-[18px] text-sd-grey-9">
          Permissions are edited with the chips on the Roles &amp; Permissions
          tab. Their base role — {role?.base_role_label ?? "—"} — cannot be
          changed.
        </p>

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="outline"
            size="app"
            className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            variant="app-primary"
            size="app"
            disabled={!canSubmit}
            className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
