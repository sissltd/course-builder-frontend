"use client";

import React, { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/form/AppInput";
import { Bank, InfoCircle, TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";

interface WithdrawalFlowProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "amount" | "no-account" | "select-account" | "confirm" | "success";

export const WithdrawalFlow = ({ isOpen, onOpenChange }: WithdrawalFlowProps) => {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [hasAccount, setHasAccount] = useState(true); // Toggle for demo

  const handleNext = () => {
    if (step === "amount") {
      if (hasAccount) setStep("select-account");
      else setStep("no-account");
    } else if (step === "select-account") {
      setStep("confirm");
    } else if (step === "confirm") {
      setStep("success");
    }
  };

  const reset = () => {
    setStep("amount");
    onOpenChange(false);
  };

  return (
    <>
      {step === "amount" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Withdraw Earnings"
          className="sm:max-w-[500px]"
        >
          <div className="flex flex-col gap-[20px]">
            <AppInput
              label="Enter amount"
              placeholder="$0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
      )}

      {step === "no-account" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Withdraw Earnings"
        >
          <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
             <div className="size-[80px] rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#F05A25]">
                <InfoCircle size={40} variant="Bulk" color="#F05A25" />
             </div>
             <div className="flex flex-col gap-[8px]">
                <p className="text-[16px] font-medium text-[#202020]">Ooops!, please add an account to continue</p>
                <AppButton variant="app-outline" className="w-fit mx-auto h-[40px] px-[20px] text-[#0063EF] border-[#0063EF]">
                   Add bank account
                </AppButton>
             </div>
             <div className="flex gap-[12px] w-full">
              <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("amount")}>
                Cancel
              </AppButton>
              <AppButton variant="app-primary" className="flex-1 h-[44px]" disabled>
                Withdraw
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {step === "select-account" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Withdraw Earnings"
        >
          <div className="flex flex-col gap-[20px]">
             <AppInput
              label="Enter amount"
              placeholder="$0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex flex-col gap-[12px]">
                <p className="text-[14px] font-medium text-[#202020]">Select available account</p>
                <div className="flex flex-col gap-[12px]">
                    <div className="p-[12px] border border-[#0063EF] bg-[#F4F9FF] rounded-[12px] flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-[12px]">
                            <div className="size-[40px] rounded-full bg-white border border-[#F0F0F0] flex items-center justify-center text-[#606060]">
                                <Bank size={20} variant="Linear" color="#606060" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-medium text-[#202020]">Osaite Emmanuel</span>
                                <span className="text-[12px] text-[#606060]">Access bank - 1234567890</span>
                            </div>
                        </div>
                        <span className="px-[8px] py-[2px] bg-[#EBF3FF] text-[#0063EF] rounded-[4px] text-[12px] font-medium">Default</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-[12px]">
              <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("amount")}>
                Cancel
              </AppButton>
              <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleNext}>
                Withdraw
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {step === "confirm" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Confirm withdrawal"
        >
          <div className="flex flex-col gap-[20px]">
             <p className="text-[14px] text-[#606060] leading-[20px]">
                A one time confirmation code has been sent to your email <span className="text-[#202020] font-medium">emmanuelosaite@gmail.com</span>. Kindly provide this code to complete the process.
             </p>
             <AppInput
              label="OTP"
              placeholder="Enter code"
            />
            <div className="flex gap-[12px]">
              <AppButton variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("select-account")}>
                Cancel
              </AppButton>
              <AppButton variant="app-primary" className="flex-1 h-[44px]" onClick={handleNext}>
                Confirm
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {step === "success" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          showCloseButton={false}
        >
          <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
             <div className="size-[80px] rounded-full bg-[#F1F8F2] flex items-center justify-center text-[#3C7E44]">
                <TickCircle size={40} variant="Bulk" color="#3C7E44" />
             </div>
             <div className="flex flex-col gap-[8px]">
                <p className="text-[20px] font-semibold text-[#202020]">Withdrawal Initiated</p>
                <p className="text-[14px] text-[#606060] leading-[20px]">
                    Your withdrawal request is being processed. You&apos;ll receive a notification once the funds are available in your account.
                </p>
             </div>
             <AppButton variant="app-primary" className="w-full h-[44px]" onClick={reset}>
                Close
             </AppButton>
          </div>
        </AppModal>
      )}
    </>
  );
};
