"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInviteMutation } from "@/modules/creator/collaborators/api/courseInvitesApi";
import { CollaboratorRole } from "@/modules/creator/collaborators/types";

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export const InviteCollaboratorModal = ({
  isOpen,
  onClose,
  courseId,
}: InviteCollaboratorModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CollaboratorRole>(CollaboratorRole.COLLABORATOR);
  const [error, setError] = useState("");

  const [createInvite, { isLoading }] = useCreateInviteMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      await createInvite({
        course_id: courseId,
        email: email.trim(),
        role,
      }).unwrap();
      setEmail("");
      setRole(CollaboratorRole.COLLABORATOR);
      onClose();
    } catch {
      setError("Failed to send invite. Check the email and try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Invite Collaborator"
      description="Send an invitation to collaborate on this course."
      footer={
        <div className="flex items-center gap-[12px] justify-end w-full">
          <Button
            variant="app-outline"
            onClick={onClose}
            className="h-[40px] px-[16px]"
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || !email.trim()}
            className="h-[40px] px-[16px]"
          >
            Send Invite
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <Label className="text-[14px] font-normal text-[#202020]">
            Email address <span className="text-[#FF5025]">*</span>
          </Label>
          <Input
            type="email"
            placeholder="collaborator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[44px] bg-white border border-[#E0E0E0] px-[16px] py-[12px] text-[14px] placeholder:text-[#B6B6B6] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[1.5px] focus-visible:border-[#0063EF]"
          />
          {error && (
            <p className="text-[12px] text-[#FF5025]">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label className="text-[14px] font-normal text-[#202020]">
            Role
          </Label>
          <Select
            value={role}
            onValueChange={(val) => setRole(val as CollaboratorRole)}
          >
            <SelectTrigger className="h-[44px] bg-white border border-[#E0E0E0] px-[16px] py-[12px] text-[14px] focus:ring-0 focus:outline-none focus:border-[1.5px] focus:border-[#0063EF]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CollaboratorRole.COLLABORATOR}>
                Collaborator
              </SelectItem>
              <SelectItem value={CollaboratorRole.ADMIN}>
                Admin
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </Modal>
  );
};
