"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
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
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Add mobile account"
          description="Add your mobile account information"
        >
          <form onSubmit={handleSave} className="flex flex-col gap-[20px] pt-[10px]">
            <FormSelect
              name="provider"
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
              <FormInput
                label="Account number"
                placeholder="1234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                name="accountNumber"
              />
              <span className="text-[12px] text-sd-grey-11 font-medium leading-[16px]">
                This process is automatic
              </span>
            </div>

            <FormInput
              label="Account name"
              placeholder="Account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              name="accountName"
            />

            <div className="flex gap-[12px] mt-[12px]">
              <Button
                type="button"
                variant="app-outline"
                className="flex-1 h-[44px]"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="app-primary"
                className="flex-1 h-[44px]"
                disabled={!provider || !accountNumber || !accountName}
              >
                Save account
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {step === "success" && (
        <Modal
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

            <Button
              variant="app-primary"
              className="w-full h-[44px]"
              onClick={handleClose}
            >
              Go home
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
