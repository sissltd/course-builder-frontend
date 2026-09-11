"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";

interface AppealSuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
}

export const AppealSuccessModal = ({
  isOpen,
  onOpenChange,
  onGoHome,
}: AppealSuccessModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="sm:max-w-[365px] p-[20px] rounded-[24px]"
    >
      <div className="flex flex-col gap-[16px]">
        <div className="bg-[#E6F9EF] rounded-full size-[60px] flex items-center justify-center px-[14px] py-[12px]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 16L13.3333 21.3333L24 10.6667"
              stroke="#008500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[20px] font-semibold text-[#202020] leading-[28px]">
            Submission successful
          </h2>
          <p className="text-[14px] text-[#606060] leading-[20px] tracking-[-0.28px]">
            Your appeal has been successfully submitted to the appropriate
            quarters. You&apos;ll be updated once its resolved.
          </p>
        </div>

        <Button
          variant="app-primary"
          size="app"
          onClick={onGoHome}
          className="w-full mt-[8px]"
        >
          Go home
        </Button>
      </div>
    </Modal>
  );
};
