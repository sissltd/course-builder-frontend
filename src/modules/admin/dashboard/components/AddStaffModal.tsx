"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";

interface AddStaffModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions = [
  { label: "Writer", value: "writer" },
  { label: "Verifier", value: "verifier" },
  { label: "Approver", value: "approver" },
];

export const AddStaffModal = ({ isOpen, onOpenChange }: AddStaffModalProps) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");

  const handleSendInvitation = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEmail("");
    setRole("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Invite a staff"
      className="sm:max-w-[500px]"
    >
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[16px]">
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
          <Button className="flex-1 h-[44px] text-[14px]" onClick={handleSendInvitation}>
            Send invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
