"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { CloseCircle } from "iconsax-react";

interface ReservationRejectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topicTitle?: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
}

export const ReservationRejectModal = ({
  isOpen,
  onOpenChange,
  topicTitle,
  isLoading = false,
  onConfirm,
}: ReservationRejectModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-[16px] p-2">
        <div className="flex items-center gap-[12px]">
          <div className="flex size-[40px] items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
            <CloseCircle size={24} variant="Bold" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold text-sd-grey-12">
              Reject Reservation Request
            </h3>
            <p className="text-[13px] text-sd-reviewer-muted">
              {topicTitle ? `Rejecting request for "${topicTitle}"` : "Rejecting topic reservation request"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-sd-grey-12">
            Rejection Reason (Optional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this reservation request is being rejected..."
            className="w-full rounded-[8px] border border-sd-grey-4 p-[10px] text-[13px] outline-none focus:border-sd-blue resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-[10px] pt-[8px]">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleCancel}
            className="h-[40px] px-[16px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className="h-[40px] px-[16px] bg-[#D54800] hover:bg-[#B33D00] text-white"
          >
            {isLoading ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
