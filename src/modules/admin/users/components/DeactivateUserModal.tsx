"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import type { AdminUser } from "@/modules/admin/teams/types";

interface DeactivateUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  isOpen,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for deactivating this user.");
      return;
    }
    setError("");
    await onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Deactivate account?"
      className="sm:max-w-[480px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <p className="text-[14px] text-[#606060] leading-[20px]">
          Are you sure you want to deactivate{" "}
          <span className="font-semibold text-[#202020]">
            {user?.first_name} {user?.last_name}
          </span>
          ? This action will disable their access to the platform.
        </p>

        <div className="flex flex-col gap-[8px]">
          <label htmlFor="deactivate-reason" className="text-[14px] font-medium text-[#202020]">
            Reason
          </label>
          <textarea
            id="deactivate-reason"
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter reason for deactivation..."
            className="w-full h-[80px] border border-[#E8E8E8] rounded-[8px] p-[12px] text-[14px] text-[#202020] placeholder:text-[#999999] resize-none focus:outline-none focus:border-[#0063EF]"
            disabled={isLoading}
          />
          {error && <span className="text-[12px] text-sd-danger">{error}</span>}
        </div>

        <div className="flex gap-[12px] pt-[4px]">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-[44px] text-[14px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading || !reason.trim()}
            className="flex-1 h-[44px] text-[14px]"
          >
            {isLoading ? "Deactivating..." : "Confirm"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
