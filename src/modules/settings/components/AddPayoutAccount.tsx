"use client";

import React, { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/form/FormInput";
import { Bank, Mobile, ArrowRight, TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";

interface AddPayoutAccountProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = "type" | "local" | "mobile" | "success";

export const AddPayoutAccount = ({ isOpen, onOpenChange, onSuccess }: AddPayoutAccountProps) => {
  const [step, setStep] = useState<Step>("type");

  const handleSuccess = () => {
    setStep("success");
  };

  const handleClose = () => {
    if (step === "success") {
      onSuccess();
    }
    onOpenChange(false);
    setStep("type");
  };

  return (
    <>
      <AppModal
        isOpen={isOpen && step === "type"}
        onOpenChange={onOpenChange}
        title="Select account type"
      >
        <div className="flex flex-col gap-[16px] mt-[8px]">
          <button
            onClick={() => setStep("local")}
            className="flex items-center justify-between p-[20px] border border-[#F0F0F0] rounded-[12px] hover:border-[#0063EF] hover:bg-[#F4F9FF] group transition-all"
          >
            <div className="flex items-center gap-[12px]">
              <div className="size-[40px] rounded-full bg-sd-grey-1 flex items-center justify-center text-[#606060] group-hover:bg-white group-hover:text-[#0063EF] transition-colors border border-[#F0F0F0]">
                <Bank size={20} variant="Linear" color="currentColor" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-semibold text-[#202020]">Local account</span>
                <span className="text-[14px] text-[#606060]">Withdraw money to a local account</span>
              </div>
            </div>
            <ArrowRight size={20} variant="Linear" color="#B6B6B6" />
          </button>

          <button
            onClick={() => setStep("mobile")}
            className="flex items-center justify-between p-[20px] border border-[#F0F0F0] rounded-[12px] hover:border-[#0063EF] hover:bg-[#F4F9FF] group transition-all"
          >
            <div className="flex items-center gap-[12px]">
              <div className="size-[40px] rounded-full bg-sd-grey-1 flex items-center justify-center text-[#606060] group-hover:bg-white group-hover:text-[#0063EF] transition-colors border border-[#F0F0F0]">
                <Mobile size={20} variant="Linear" color="currentColor" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-semibold text-[#202020]">Mobile money</span>
                <span className="text-[14px] text-[#606060]">Add a mobile money provider</span>
              </div>
            </div>
            <ArrowRight size={20} variant="Linear" color="#B6B6B6" />
          </button>
        </div>
      </AppModal>

      <AppModal
        isOpen={isOpen && step === "local"}
        onOpenChange={() => setStep("type")}
        title="Add local account"
        description="Add your local account information"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <AppInput label="Bank" placeholder="Select bank" />
          <AppInput label="Account number" placeholder="1234567890" hint="This process is automatic" />
          <AppInput label="Account name" placeholder="Account name" readOnly />
          <div className="flex gap-[12px]">
            <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("type")}>
              Cancel
            </AppButton>
            <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleSuccess}>
              Save account
            </AppButton>
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={isOpen && step === "mobile"}
        onOpenChange={() => setStep("type")}
        title="Add mobile account"
        description="Add your mobile account information"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <AppInput label="Select provider" placeholder="Select provider" />
          <AppInput label="Account number" placeholder="1234567890" hint="This process is automatic" />
          <AppInput label="Account name" placeholder="Account name" readOnly />
          <div className="flex gap-[12px]">
            <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("type")}>
              Cancel
            </AppButton>
            <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleSuccess}>
              Save account
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
            <p className="text-[20px] font-semibold text-[#202020]">Account added</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Your account has been successfully added. You can now use it for your payouts.
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
