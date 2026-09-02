"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { TickCircle } from "iconsax-react";
import {
  useGetBanksQuery,
  useVerifyBankAccountMutation,
  useCreatePayoutAccountMutation,
} from "@/modules/creator/hooks";
import { toast } from "sonner";

interface SetupAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "form" | "success";

export const SetupAccountModal = ({ isOpen, onOpenChange, onSuccess }: SetupAccountModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const verifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifiedKeyRef = useRef("");

  const { data: banks = [] } = useGetBanksQuery();
  const [verifyAccount, { isLoading: isVerifying }] = useVerifyBankAccountMutation();
  const [createAccount, { isLoading: isCreating }] = useCreatePayoutAccountMutation();

  const bankOptions = banks.map((b) => ({ label: b.name, value: b.code }));

  useEffect(() => {
    return () => {
      if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);
    };
  }, []);

  const runVerification = useCallback(
    async (bankCode: string, accNumber: string) => {
      try {
        const result = await verifyAccount({
          bank_code: bankCode,
          account_number: accNumber,
        }).unwrap();
        verifiedKeyRef.current = `${bankCode}-${accNumber}`;
        setVerifiedName(result.account_name);
      } catch {
        verifiedKeyRef.current = "";
        setVerifiedName("");
        toast.error("Could not verify account. Check bank and account number.");
      }
    },
    [verifyAccount],
  );

  useEffect(() => {
    if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);

    if (selectedBankCode && accountNumber.length === 10) {
      verifyTimeoutRef.current = setTimeout(() => {
        runVerification(selectedBankCode, accountNumber);
      }, 500);
    }
  }, [selectedBankCode, accountNumber, runVerification]);

  const currentKey = `${selectedBankCode}-${accountNumber}`;
  const accountName = currentKey === verifiedKeyRef.current ? verifiedName : "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankCode || !accountNumber || !accountName) return;
    try {
      await createAccount({
        account_name: accountName,
        account_number: accountNumber,
        bank_code: selectedBankCode,
        account_type: "Local Account",
        is_default: false,
      }).unwrap();
      setStep("success");
      onSuccess?.();
    } catch {
      toast.error("Failed to add account. Please try again.");
    }
  };

  const handleClose = () => {
    setStep("form");
    setSelectedBankCode("");
    setAccountNumber("");
    setVerifiedName("");
    verifiedKeyRef.current = "";
    onOpenChange(false);
  };

  return (
    <>
      {step === "form" && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Add bank account"
          description="Add your bank account information"
        >
          <form onSubmit={handleSave} className="flex flex-col gap-[20px] pt-[10px]">
            <FormSelect
              name="provider"
              label="Select bank"
              placeholder="Select bank"
              searchable
              searchPlaceholder="Search banks..."
              emptyText="No banks found"
              value={selectedBankCode}
              onValueChange={setSelectedBankCode}
              options={bankOptions}
              required
            />

            <div className="flex flex-col gap-[4px]">
              <FormInput
                label="Account number"
                placeholder="1234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                name="accountNumber"
                hint={isVerifying ? "Verifying account..." : "Enter 10-digit account number"}
              />
            </div>

            <FormInput
              label="Account name"
              placeholder="Account name"
              value={accountName}
              readOnly
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
                disabled={!selectedBankCode || !accountNumber || !accountName || isVerifying || isCreating}
                isLoading={isCreating}
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
