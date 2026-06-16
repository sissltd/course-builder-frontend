"use client";

import React, { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/form/FormInput";
import { AppTextarea } from "@/components/form/AppTextarea";
import { Edit, Trash, TickCircle, InfoCircle } from "iconsax-react";
import { MyCourse } from "@/modules/dashboard/columns/my-courses";

interface ActionModalProps {
  course: MyCourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const MoveToDraftModal = ({ course, isOpen, onOpenChange, onConfirm }: ActionModalProps) => {
  if (!course) return null;
  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
        <div className="size-[80px] rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#606060]">
          <Edit size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">Move course to draft?</p>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            Moving this course to draft will make it unavailable for review or publishing. You can always continue from where you left off.
          </p>
        </div>
        <div className="flex gap-[12px] w-full">
          <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => onOpenChange(false)}>
            Cancel
          </AppButton>
          <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={onConfirm}>
            Move to draft
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};

export const DeleteCourseModal = ({ course, isOpen, onOpenChange, onConfirm }: ActionModalProps) => {
  if (!course) return null;
  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
        <div className="size-[80px] rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#FF5025]">
          <Trash size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">Delete course?</p>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            Are you sure you want to delete this course? This action cannot be undone and all course content will be permanently lost.
          </p>
        </div>
        <div className="flex gap-[12px] w-full">
          <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => onOpenChange(false)}>
            Cancel
          </AppButton>
          <AppButton variant="app-primary" className="flex-1 h-[44px] bg-[#FF5025] border-[#FF5025] hover:bg-[#D4401D]" onClick={onConfirm}>
            Delete course
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};

export const AppealModal = ({ course, isOpen, onOpenChange, onConfirm }: ActionModalProps) => {
  const [reason, setReason] = useState("");
  if (!course) return null;
  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Request for an appeal"
      description="Kindly provide your reason for an appeal request"
    >
      <div className="flex flex-col gap-[24px] mt-[8px]">
        <AppTextarea 
          label="Reason for appeal"
          placeholder="Enter your reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={5}
        />
        <div className="flex gap-[12px] w-full">
          <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => onOpenChange(false)}>
            Cancel
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]" 
            disabled={!reason}
            onClick={onConfirm}
          >
            Send request
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};

export const AppealSuccessModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
        <div className="size-[80px] rounded-full bg-[#F1F8F2] flex items-center justify-center text-[#3C7E44]">
          <TickCircle size={40} variant="Bulk" color="currentColor" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold text-[#202020]">Appeal Request Sent</p>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            Your appeal request has been successfully sent. You will be notified via email on the outcome of your request.
          </p>
        </div>
        <AppButton variant="app-primary" className="w-full h-[44px]" onClick={() => onOpenChange(false)}>
          Done
        </AppButton>
      </div>
    </AppModal>
  );
};
