"use client";

import React, { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/form/FormInput";
import { TickCircle } from "iconsax-react";
import { AppInput } from "@/components/form/AppInput";

interface ChangeEmailFlowProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = "password" | "new-email" | "verify" | "success";

export const ChangeEmailFlow = ({ isOpen, onOpenChange, onSuccess }: ChangeEmailFlowProps) => {
  const [step, setStep] = useState<Step>("password");

  const handleNext = () => {
    if (step === "password") setStep("new-email");
    else if (step === "new-email") setStep("verify");
    else if (step === "verify") setStep("success");
  };

  const handleClose = () => {
    if (step === "success") {
      onSuccess();
    }
    onOpenChange(false);
    setStep("password");
  };

  return (
    <>
      <AppModal
        isOpen={isOpen && step === "password"}
        onOpenChange={onOpenChange}
        title="Change email address"
        description="Provide your password to change your email address"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <AppInput label="Password" placeholder="Enter your password" type="password" />
          <div className="flex gap-[12px]">
            <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => onOpenChange(false)}>
              Cancel
            </AppButton>
            <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleNext}>
              Continue
            </AppButton>
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={isOpen && step === "new-email"}
        onOpenChange={() => setStep("password")}
        title="Enter a new email"
        description="Enter your new email address"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <AppInput label="Email address" placeholder="Enter new email address" />
          <div className="flex gap-[12px]">
            <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("password")}>
              Cancel
            </AppButton>
            <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleNext}>
              Continue
            </AppButton>
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={isOpen && step === "verify"}
        onOpenChange={() => setStep("new-email")}
        title="Verify email"
        description="Kindly enter the code sent to your email to verify this change"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <AppInput label="Verification code" placeholder="Enter code" />
          <div className="flex gap-[12px]">
            <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("new-email")}>
              Cancel
            </AppButton>
            <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleNext}>
              Verify
            </AppButton>
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={isOpen && step === "success"}
        onOpenChange={handleClose}
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
          <div className="size-[80px] rounded-full bg-[#F1F8F2] flex items-center justify-center text-[#3C7E44]">
            <TickCircle size={40} variant="Bulk" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">Email Updated!</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Congratulations Emmanuel, your email has been successfully updated.
            </p>
          </div>
          <AppButton variant="app-primary" className="w-full h-[44px]" onClick={handleClose}>
            Close
          </AppButton>
        </div>
      </AppModal>
    </>
  );
};
