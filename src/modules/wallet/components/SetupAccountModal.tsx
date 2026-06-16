"use client";

import React, { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/form/AppInput";
import { AppSelect } from "@/components/form/AppSelect";
import { TickCircle } from "iconsax-react";

interface SetupAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "form" | "success";

export const SetupAccountModal = ({ isOpen, onOpenChange }: SetupAccountModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider && accountNumber && accountName) {
      setStep("success");
    }
  };

  const handleClose = () => {
    setStep("form");
    setProvider("");
    setAccountNumber("");
    setAccountName("");
    onOpenChange(false);
  };

  return (
    <>
      {step === "form" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Add mobile account"
          description="Add your mobile account information"
        >
          <form onSubmit={handleSave} className="flex flex-col gap-[20px] pt-[10px]">
            <AppSelect
              label="Select provider"
              placeholder="Select provider"
              value={provider}
              onValueChange={setProvider}
              required
              options={[
                { label: "Access Bank", value: "Access Bank" },
                { label: "Guaranty Trust Bank", value: "GTBank" },
                { label: "Zenith Bank", value: "Zenith Bank" },
                { label: "United Bank for Africa", value: "UBA" },
              ]}
            />

            <div className="flex flex-col gap-[4px]">
              <AppInput
                label="Account number"
                placeholder="1234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
              <span className="text-[12px] text-sd-grey-11 font-medium leading-[16px]">
                This process is automatic
              </span>
            </div>

            <AppInput
              label="Account name"
              placeholder="Account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />

            <div className="flex gap-[12px] mt-[12px]">
              <AppButton
                type="button"
                variant="app-outline"
                className="flex-1 h-[44px]"
                onClick={handleClose}
              >
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                variant="app-primary"
                className="flex-1 h-[44px]"
                disabled={!provider || !accountNumber || !accountName}
              >
                Save account
              </AppButton>
            </div>
          </form>
        </AppModal>
      )}

      {step === "success" && (
        <AppModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          showCloseButton={false}
        >
          <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
            {/* Green Tick Circle */}
            <div className="size-[80px] rounded-full bg-[#E6F3E6] flex items-center justify-center text-[#3C7E44]">
              <TickCircle size={40} variant="Bulk" color="#3C7E44" />
            </div>

            <div className="flex flex-col gap-[8px]">
              <h2 className="text-[24px] font-semibold text-[#202020]">Account added</h2>
              <p className="text-[14px] text-sd-grey-11 leading-[20px] max-w-[320px] mx-auto">
                Your Local account with name, (<strong className="text-[#202020] font-medium">{accountName} - {accountNumber}</strong>) has been successfully added
              </p>
            </div>

            <AppButton
              variant="app-primary"
              className="w-full h-[44px]"
              onClick={handleClose}
            >
              Go home
            </AppButton>
          </div>
        </AppModal>
      )}
    </>
  );
};
