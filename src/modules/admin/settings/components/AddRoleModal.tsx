"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useCreateRoleMutation } from "@/modules/admin/roles/api/rolesApi";
import { STAFF_BASE_ROLE_OPTIONS, type StaffBaseRole } from "@/modules/admin/roles/types";

interface AddRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fires with the new role's id so the tab can select it. */
  onCreated?: (roleId?: string) => void;
}

/**
 * Creates a custom role.
 *
 * `base_role` is required by the endpoint and is **immutable afterwards** — the
 * backend states it "decides workflow behaviour the permissions don't: which
 * review seats members sit, whether MFA is mandatory, and their workspace". The
 * original dialog only collected a name, which the API would have rejected. It
 * is collected here with that permanence stated up front, because it cannot be
 * corrected later without deleting the role.
 *
 * The role is created with no permissions and the chips are granted afterwards,
 * which is also how the endpoint is designed: `permissions` is required but may
 * be empty.
 */
export const AddRoleModal = ({
  isOpen,
  onOpenChange,
  onCreated,
}: AddRoleModalProps) => {
  const [name, setName] = useState("");
  const [baseRole, setBaseRole] = useState("");
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const reset = () => {
    setName("");
    setBaseRole("");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const canSubmit = name.trim().length > 0 && baseRole.length > 0 && !isLoading;

  const handleSave = async () => {
    if (!canSubmit) return;

    try {
      const role = await createRole({
        name: name.trim(),
        base_role: baseRole as StaffBaseRole,
        permissions: [],
      }).unwrap();

      toast.success(`Role “${name.trim()}” created`, {
        description:
          "It has no permissions yet — select the chips to grant some.",
      });
      onCreated?.(role?.id);
      handleClose();
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not create the role");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      showCloseButton={false}
      className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            Add new role
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close add role modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[24px] pt-[4px]">
        <FormInput
          name="addRoleTitle"
          label="Role title"
          placeholder="Enter name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
        />

        <div className="flex flex-col gap-[6px]">
          <FormSelect
            name="addRoleBaseRole"
            label="Based on"
            placeholder="Select a base role"
            options={STAFF_BASE_ROLE_OPTIONS}
            value={baseRole}
            onValueChange={setBaseRole}
          />
          <span className="text-[12px] leading-[18px] text-sd-grey-9">
            Decides which review seats members of this role may sit, whether MFA
            is required, and their workspace. This cannot be changed after the
            role is created.
          </span>
        </div>

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
