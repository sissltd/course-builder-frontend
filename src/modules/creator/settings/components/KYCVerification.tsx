"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { TickCircle, Logout, Trash, InfoCircle } from "iconsax-react";
import { FormInput } from "@/components/form/FormInput";

interface KYCVerificationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = "selection" | "details" | "success";

export const KYCVerification = ({ isOpen, onOpenChange, onSuccess }: KYCVerificationProps) => {
  const [step, setStep] = useState<Step>("selection");
  const [docType, setDocType] = useState("National ID (NIN)");

  const docTypes = [
    "National ID (NIN)",
    "Driver’s License",
    "International passport",
    "Voter’s ID",
  ];

  const handleNext = () => {
    if (step === "selection") setStep("details");
    else if (step === "details") setStep("success");
  };

  const handleClose = () => {
    if (step === "success") {
      onSuccess();
    }
    onOpenChange(false);
    setStep("selection");
  };

  return (
    <>
      <Modal
        isOpen={isOpen && step !== "success"}
        onOpenChange={onOpenChange}
        title={step === "selection" ? "Document type" : docType}
        description={
          step === "selection"
            ? "Kindly select your verification method"
            : `Please enter your ${docType.toLowerCase()} number in the field below`
        }
      >
        <div className="flex flex-col gap-[24px] mt-[8px]">
          {step === "selection" ? (
            <div className="flex flex-col gap-[12px]">
              <FormInput name="country" label="Country" placeholder="Nigeria" readOnly />
              <div className="flex flex-col gap-[12px]">
                {docTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-[12px] p-[16px] border border-[#F0F0F0] rounded-[8px] cursor-pointer hover:bg-sd-grey-1 transition-colors"
                  >
                    <input
                      type="radio"
                      name="docType"
                      checked={docType === type}
                      onChange={() => setDocType(type)}
                      className="size-[20px] accent-[#0063EF]"
                    />
                    <span className="text-[14px] text-[#202020] font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <FormInput name="docTypeNumber" label={docType} placeholder={`Enter your ${docType} number`} />
          )}

          <div className="flex flex-col gap-[12px]">
             <p className="text-[12px] text-[#606060] text-center leading-[18px]">
                By clicking continue, you agree to Soludesk Verification Policy and Terms of Service
             </p>
             <Button variant="app-primary" className="w-full h-[44px]" onClick={handleNext}>
                Continue
             </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isOpen && step === "success"}
        onOpenChange={handleClose}
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
          <div className="size-[80px] rounded-full bg-[#F1F8F2] flex items-center justify-center text-[#3C7E44]">
            <TickCircle size={40} variant="Bulk" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">KYC submitted</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Thanks for taking this time to complete your KYC verification. You will be notified once your account is verified
            </p>
          </div>
          <Button variant="app-primary" className="w-full h-[44px]" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};
