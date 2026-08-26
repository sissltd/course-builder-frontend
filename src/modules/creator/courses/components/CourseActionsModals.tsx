"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Edit, Trash, TickCircle } from "iconsax-react";
import type { CourseSummary } from "@/modules/creator/courses/types";

interface ActionModalProps {
  course: CourseSummary | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const MoveToDraftModal = ({
  course,
  isOpen,
  onOpenChange,
  onConfirm,
}: ActionModalProps) => {
  if (!course) return null;
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-[24px] py-[20px] text-center">
        <div className="flex size-[80px] items-center justify-center rounded-full bg-[#F5F5F5] text-[#606060]">
          <Edit size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">
            Move course to draft?
          </p>
          <p className="text-[14px] leading-[20px] text-[#606060]">
            Moving this course to draft will make it unavailable for review or
            publishing. You can always continue from where you left off.
          </p>
        </div>
        <div className="flex w-full gap-[12px]">
          <Button
            variant="app-outline"
            className="h-[44px] flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="h-[44px] flex-1"
            onClick={onConfirm}
          >
            Move to draft
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const DeleteCourseModal = ({
  course,
  isOpen,
  onOpenChange,
  onConfirm,
}: ActionModalProps) => {
  if (!course) return null;
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-[24px] py-[20px] text-center">
        <div className="flex size-[80px] items-center justify-center rounded-full bg-[#FFF0ED] text-[#FF5025]">
          <Trash size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">
            Delete course?
          </p>
          <p className="text-[14px] leading-[20px] text-[#606060]">
            Are you sure you want to delete this course? This action cannot be
            undone and all course content will be permanently lost.
          </p>
        </div>
        <div className="flex w-full gap-[12px]">
          <Button
            variant="app-outline"
            className="h-[44px] flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="h-[44px] flex-1 border-[#FF5025] bg-[#FF5025] hover:bg-[#D4401D]"
            onClick={onConfirm}
          >
            Delete course
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const AppealModal = ({
  course,
  isOpen,
  onOpenChange,
  onConfirm,
}: ActionModalProps) => {
  const [reason, setReason] = useState("");
  if (!course) return null;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Request for an appeal"
      description="Kindly provide your reason for an appeal request"
    >
      <div className="mt-[8px] flex flex-col gap-[24px]">
        <FormTextarea
          name="appealReason"
          label="Reason for appeal"
          placeholder="Enter your reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={5}
        />
        <div className="flex w-full gap-[12px]">
          <Button
            variant="app-outline"
            className="h-[44px] flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="h-[44px] flex-1"
            disabled={!reason}
            onClick={onConfirm}
          >
            Send request
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const AppealSuccessModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} showCloseButton={false}>
      <div className="flex flex-col items-center gap-[24px] py-[20px] text-center">
        <div className="flex size-[80px] items-center justify-center rounded-full bg-[#F1F8F2] text-[#3C7E44]">
          <TickCircle size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">
            Appeal Request Sent
          </p>
          <p className="text-[14px] leading-[20px] text-[#606060]">
            Your appeal request has been successfully sent. You will be notified
            via email on the outcome of your request.
          </p>
        </div>
        <Button
          variant="app-primary"
          className="h-[44px] w-full"
          onClick={() => onOpenChange(false)}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};
