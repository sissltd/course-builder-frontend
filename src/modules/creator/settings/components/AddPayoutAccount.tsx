"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Bank, Mobile, ArrowRight, TickCircle } from "iconsax-react";
import {
  useGetBanksQuery,
  useVerifyBankAccountMutation,
  useCreatePayoutAccountMutation,
} from "@/modules/creator/hooks";
import { toast } from "sonner";

interface AddPayoutAccountProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = "type" | "local" | "mobile" | "success";

export const AddPayoutAccount = ({ isOpen, onOpenChange, onSuccess }: AddPayoutAccountProps) => {
  const [step, setStep] = useState<Step>("type");
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

  const handleSave = async () => {
    try {
      await createAccount({
        account_name: accountName,
        account_number: accountNumber,
        bank_code: selectedBankCode,
        account_type: "Local Account",
        is_default: false,
      }).unwrap();
      setStep("success");
    } catch {
      toast.error("Failed to add account. Please try again.");
    }
  };

  const handleClose = () => {
    if (step === "success") {
      onSuccess();
    }
    onOpenChange(false);
    setStep("type");
    setSelectedBankCode("");
    setAccountNumber("");
    setVerifiedName("");
    verifiedKeyRef.current = "";
  };

  return (
    <>
      <Modal
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
      </Modal>

      <Modal
        isOpen={isOpen && step === "local"}
        onOpenChange={() => setStep("type")}
        title="Add local account"
        description="Add your local account information"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <FormSelect
            name="bank"
            label="Bank"
            placeholder="Select bank"
            searchable
            searchPlaceholder="Search banks..."
            emptyText="No banks found"
            options={bankOptions}
            value={selectedBankCode}
            onValueChange={setSelectedBankCode}
          />
          <div className="flex flex-col gap-[4px]">
            <FormInput
              name="accountNumber"
              label="Account number"
              placeholder="1234567890"
              hint={isVerifying ? "Verifying account..." : "Enter 10-digit account number"}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>
          <FormInput
            name="accountName"
            label="Account name"
            placeholder="Account name"
            value={accountName}
            readOnly
            isSuccess={!!verifiedName}
          />
          <div className="flex gap-[12px]">
            <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("type")}>
              Cancel
            </Button>
            <Button
              variant="app-primary"
              className="flex-1 h-[44px]"
              onClick={handleSave}
              disabled={!selectedBankCode || !accountNumber || !accountName || isVerifying || isCreating}
              isLoading={isCreating}
            >
              Save account
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpen && step === "mobile"}
        onOpenChange={() => setStep("type")}
        title="Add mobile account"
        description="Add your mobile account information"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          <FormSelect
            name="mobileProvider"
            label="Select provider"
            placeholder="Select provider"
            searchable
            searchPlaceholder="Search providers..."
            emptyText="No providers found"
            options={bankOptions}
            value={selectedBankCode}
            onValueChange={setSelectedBankCode}
          />
          <div className="flex flex-col gap-[4px]">
            <FormInput
              name="mobileAccountNumber"
              label="Account number"
              placeholder="1234567890"
              hint={isVerifying ? "Verifying account..." : "Enter 10-digit account number"}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>
          <FormInput
            name="mobileAccountName"
            label="Account name"
            placeholder="Account name"
            value={accountName}
            readOnly
            isSuccess={!!verifiedName}
          />
          <div className="flex gap-[12px]">
            <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("type")}>
              Cancel
            </Button>
            <Button
              variant="app-primary"
              className="flex-1 h-[44px]"
              onClick={handleSave}
              disabled={!selectedBankCode || !accountNumber || !accountName || isVerifying || isCreating}
              isLoading={isCreating}
            >
              Save account
            </Button>
          </div>
        </div>
      </Modal>

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
            <p className="text-[20px] font-semibold text-[#202020]">Account added</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Your account (<strong className="text-[#202020] font-medium">{accountName} - {accountNumber}</strong>) has been successfully added.
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
