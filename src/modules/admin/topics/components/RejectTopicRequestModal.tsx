"use client";

import React, { useState } from "react";
import { CloseCircle } from "iconsax-react";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";

interface RejectTopicRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestName?: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
}

/**
 * The rejection reason is optional on the endpoint, so an empty box is a valid
 * submission — the request is still retained in the review history either way.
 */
export const RejectTopicRequestModal = ({
  isOpen,
  onOpenChange,
  requestName,
  isLoading = false,
  onConfirm,
}: RejectTopicRequestModalProps) => {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <div className="flex flex-col gap-[16px] p-2">
        <div className="flex items-center gap-[12px]">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[var(--sd-danger-soft)] text-[var(--sd-danger)]">
            <CloseCircle size={24} variant="Bold" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold text-sd-grey-12">
              Reject topic request
            </h3>
            <p className="text-[13px] text-sd-grey-9">
              {requestName
                ? `Rejecting the request for “${requestName}”`
                : "Rejecting this topic request"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="topic-request-rejection-reason"
            className="text-[13px] font-medium text-sd-grey-12"
          >
            Rejection reason (optional)
          </label>
          <textarea
            id="topic-request-rejection-reason"
            rows={3}
            value={reason}
            disabled={isLoading}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this topic request is being rejected..."
            className="w-full resize-none rounded-[8px] border border-sd-grey-4 p-[10px] text-[13px] outline-none focus:border-sd-blue"
          />
          <span className="text-[12px] text-sd-grey-9">
            The requester sees this. No topic is created — the request stays in
            the review history.
          </span>
        </div>

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
            disabled={isLoading}
            onClick={() => onConfirm(reason.trim())}
            className="h-[40px] px-[16px]"
          >
            {isLoading ? "Rejecting..." : "Reject request"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
