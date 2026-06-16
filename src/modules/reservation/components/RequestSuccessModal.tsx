"use client";

import React from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { TickCircle } from "iconsax-react";

interface RequestSuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RequestSuccessModal = ({ isOpen, onOpenChange }: RequestSuccessModalProps) => {
  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="sm:max-w-[400px]"
    >
      <div className="flex flex-col items-center text-center gap-[24px] py-[8px]">
        <div className="size-[60px] rounded-full bg-[#ECFDF3] flex items-center justify-center">
          <TickCircle size={32} variant="Bold" color="#027A48" />
        </div>
        
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[24px] font-semibold text-[#202020] leading-tight">
            Request Initiated
          </h2>
          <p className="text-[14px] text-[#606060] leading-relaxed">
            Your topic request has been sent. You'll receive an update once its approved
          </p>
        </div>
        
        <AppButton
          variant="app-primary"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Go to Reservation
        </AppButton>
      </div>
    </AppModal>
  );
};
