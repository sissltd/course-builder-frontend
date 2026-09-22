"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { TickCircle } from "iconsax-react";
import { useInviteStaffMutation } from "../api/staffApi";
import { useGetRolesQuery } from "@/modules/admin/roles/api/rolesApi";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api/errors";

interface AddStaffModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Invites a staff member.
 *
 * The role list is `GET /admin/roles/`, not a hardcoded trio: the invitation
 * endpoint accepts `role_id` for a built-in *or* custom role, and `role_id` is
 * what the backend documents as the preference ("kept for existing clients" is
 * how it describes the `role` enum). Sending the id is also the only way a role
 * built on this platform's own Roles screen can ever be assigned.
 *
 * Roles are labelled with their base role when they are custom, because two
 * roles can share a name across different seats.
 */
export const AddStaffModal = ({ isOpen, onOpenChange }: AddStaffModalProps) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roleId, setRoleId] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { data: roles } = useGetRolesQuery();
  const [inviteStaff, { isLoading }] = useInviteStaffMutation();

  const roleOptions = React.useMemo(
    () =>
      (roles ?? []).map((role) => ({
        label: role.is_system
          ? role.name
          : `${role.name} · ${role.base_role_label}`,
        value: role.id,
      })),
    [roles],
  );

  const selectedRoleLabel =
    roleOptions.find((option) => option.value === roleId)?.label ?? "selected";

  const handleSendInvitation = () => {
    if (!email || !firstName || !lastName || !roleId) {
      toast.error("Please fill all fields");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    try {
      await inviteStaff({
        email,
        first_name: firstName,
        last_name: lastName,
        role_id: roleId,
      }).unwrap();

      setShowConfirm(false);
      setTimeout(() => setShowSuccess(true), 300);
    } catch (err) {
      setShowConfirm(false);
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Failed to send invitation");
    }
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRoleId("");
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const handleDone = () => {
    setShowSuccess(false);
    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open && !showConfirm && !showSuccess) handleCancel();
        }}
        title="Invite a staff"
        className="sm:max-w-[500px]"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-[16px] text-[14px] text-[#888] tracking-[-0.28px] leading-[20px] mb-[8px]">
          Send an invitation to add a staff member to your team.
        </div>
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex gap-[12px]">
              <FormInput
                name="first_name"
                label="First name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                name="last_name"
                label="Last name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <FormInput
              name="email"
              label="Email address"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormSelect
              name="role"
              label="Role"
              placeholder={
                roleOptions.length > 0 ? "Select role" : "Loading roles..."
              }
              options={roleOptions}
              value={roleId}
              onValueChange={setRoleId}
            />
          </div>
          <div className="flex gap-[12px]">
            <Button variant="outline" className="flex-1 h-[44px] text-[14px]" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="flex-1 h-[44px] text-[14px]"
              onClick={handleSendInvitation}
              disabled={isLoading || !firstName || !lastName || !email || !roleId}
            >
              {isLoading ? "Sending..." : "Send invitation"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        title="Send invitation?"
        description={`An invitation will be sent to ${email || "this email"} with the role of ${selectedRoleLabel}.`}
        confirmLabel={isLoading ? "Sending..." : "Yes, send"}
        variant="primary"
        onConfirm={handleConfirmSend}
        isLoading={isLoading}
      />

      <Modal isOpen={showSuccess} onOpenChange={setShowSuccess}>
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div className="size-[80px] rounded-full bg-[#EBF7EE] flex items-center justify-center">
            <TickCircle variant="Bold" size={48} color="#008500" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[28px] font-semibold text-[#202020] leading-tight">Invitation sent!</span>
            <p className="text-[14px] text-[#606060] leading-normal max-w-[320px]">
              An invitation has been sent to {email || "the provided email"}.
            </p>
          </div>
          <button
            onClick={handleDone}
            className="w-full h-[44px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer mt-[8px]"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
};

