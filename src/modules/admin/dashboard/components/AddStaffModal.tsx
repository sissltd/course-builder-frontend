"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { TickCircle } from "iconsax-react";
import { useInviteStaffMutation } from "@/modules/admin/teams/hooks";
import { StaffRole } from "@/modules/admin/teams/types";
import { toast } from "sonner";

interface AddStaffModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions = [
  { label: "Writer", value: StaffRole.STAFF_WRITER },
  { label: "Verifier", value: StaffRole.STAFF_VERIFIER },
  { label: "Approver", value: StaffRole.STAFF_APPROVER },
];

export const AddStaffModal = ({ isOpen, onOpenChange }: AddStaffModalProps) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [inviteStaff, { isLoading }] = useInviteStaffMutation();

  const handleSendInvitation = () => {
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    try {
      await inviteStaff({
        email,
        first_name: firstName,
        last_name: lastName,
        role: role as StaffRole,
      }).unwrap();
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      setShowConfirm(false);
      const data = err as { data?: { errors?: { message: string }[] } };
      const message = data?.data?.errors?.[0]?.message ?? "Failed to send invitation";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    onOpenChange(false);
  };

  const handleDone = () => {
    setShowSuccess(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
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
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                name="last_name"
                label="Last name"
                placeholder="Last name"
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
              placeholder="Select role"
              options={roleOptions}
              value={role}
              onValueChange={setRole}
            />
          </div>
          <div className="flex gap-[12px]">
            <Button variant="outline" className="flex-1 h-[44px] text-[14px]" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="flex-1 h-[44px] text-[14px]"
              onClick={handleSendInvitation}
              disabled={isLoading || !firstName || !lastName || !email || !role}
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
        description={`An invitation will be sent to ${email || "this email"} with the role of ${roleOptions.find((r) => r.value === role)?.label || "selected"}.`}
        confirmLabel="Yes, send"
        variant="primary"
        onConfirm={handleConfirmSend}
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
