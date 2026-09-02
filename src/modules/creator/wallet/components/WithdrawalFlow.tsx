"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { Bank, InfoCircle, TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  useGetPayoutAccountsQuery,
  useRequestWithdrawalMutation,
  useConfirmWithdrawalMutation,
} from "@/modules/creator/hooks";
import { toast } from "sonner";

interface WithdrawalFlowProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "amount" | "no-account" | "select-account" | "confirm" | "success";

export const WithdrawalFlow = ({ isOpen, onOpenChange }: WithdrawalFlowProps) => {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [withdrawalRequestId, setWithdrawalRequestId] = useState<string | null>(null);

  const { data: payoutAccounts } = useGetPayoutAccountsQuery();
  const [requestWithdrawal, { isLoading: isRequesting }] = useRequestWithdrawalMutation();
  const [confirmWithdrawal, { isLoading: isConfirming }] = useConfirmWithdrawalMutation();

  const accounts = payoutAccounts ?? [];
  const hasAccount = accounts.length > 0;

  const handleNext = async () => {
    if (step === "amount") {
      if (hasAccount) {
        const defaultAccount = accounts.find((a) => a.is_default);
        if (defaultAccount) {
          setSelectedAccountId(defaultAccount.id);
        }
        setStep("select-account");
      } else {
        setStep("no-account");
      }
    } else if (step === "select-account" && selectedAccountId) {
      try {
        const result = await requestWithdrawal({
          amount,
          payout_account: selectedAccountId,
        }).unwrap();
        setWithdrawalRequestId(result.id);
        setStep("confirm");
      } catch {
        toast.error("Failed to request withdrawal. Please try again.");
      }
    } else if (step === "confirm" && withdrawalRequestId) {
      try {
        await confirmWithdrawal({
          withdrawalRequestId,
          body: { code: (document.querySelector<HTMLInputElement>('[name="otp"]')?.value ?? "") as string },
        }).unwrap();
        setStep("success");
      } catch {
        toast.error("Invalid OTP code. Please try again.");
      }
    }
  };

  const reset = () => {
    setStep("amount");
    setAmount("");
    setSelectedAccountId(null);
    setWithdrawalRequestId(null);
    onOpenChange(false);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      {step === "amount" && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Withdraw Earnings"
          className="sm:max-w-[500px]"
        >
          <div className="flex flex-col gap-[20px]">
            <FormInput
              label="Enter amount"
              placeholder="$0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="withdrawalAmount"
            />
            <div className="flex gap-[12px]">
              <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="app-primary"
                className="flex-1 h-[44px]"
                onClick={handleNext}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {step === "no-account" && (
        <Modal
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
                <Button variant="app-outline" className="w-fit mx-auto h-[40px] px-[20px] text-[#0063EF] border-[#0063EF]">
                   Add bank account
                </Button>
             </div>
             <div className="flex gap-[12px] w-full">
              <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("amount")}>
                Cancel
              </Button>
              <Button variant="app-primary" className="flex-1 h-[44px]" disabled>
                Withdraw
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {step === "select-account" && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Withdraw Earnings"
        >
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] font-medium text-[#202020]">Amount</span>
              <span className="text-[24px] font-semibold text-[#202020]">{formatCurrency(amount)}</span>
            </div>
            <div className="flex flex-col gap-[12px]">
                <p className="text-[14px] font-medium text-[#202020]">Select available account</p>
                <div className="flex flex-col gap-[12px]">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => setSelectedAccountId(account.id)}
                        className={cn(
                          "p-[12px] border rounded-[12px] flex items-center justify-between cursor-pointer transition-colors",
                          selectedAccountId === account.id
                            ? "border-[#0063EF] bg-[#F4F9FF]"
                            : "border-[#F0F0F0] hover:border-[#0063EF] hover:bg-[#F4F9FF]"
                        )}
                      >
                        <div className="flex items-center gap-[12px]">
                            <div className="size-[40px] rounded-full bg-white border border-[#F0F0F0] flex items-center justify-center text-[#606060]">
                                <Bank size={20} variant="Linear" color="#606060" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[14px] font-medium text-[#202020]">{account.account_name}</span>
                                <span className="text-[12px] text-[#606060]">{account.provider} - {account.account_number}</span>
                            </div>
                        </div>
                        {account.is_default && (
                          <span className="px-[8px] py-[2px] bg-[#EBF3FF] text-[#0063EF] rounded-[4px] text-[12px] font-medium">Default</span>
                        )}
                      </button>
                    ))}
                </div>
            </div>
            <div className="flex gap-[12px]">
              <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("amount")}>
                Cancel
              </Button>
              <Button
                variant="app-primary"
                className="flex-1 h-[44px]"
                onClick={handleNext}
                disabled={!selectedAccountId || isRequesting}
                isLoading={isRequesting}
              >
                Withdraw
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {step === "confirm" && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Confirm withdrawal"
        >
          <div className="flex flex-col gap-[20px]">
             <p className="text-[14px] text-[#606060] leading-[20px]">
                A one time confirmation code has been sent to your email. Kindly provide this code to complete the process.
             </p>
             <FormInput
              label="OTP"
              placeholder="Enter code"
              name="otp"
            />
            <div className="flex gap-[12px]">
              <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setStep("select-account")}>
                Cancel
              </Button>
              <Button
                variant="app-primary"
                className="flex-1 h-[44px]"
                onClick={handleNext}
                isLoading={isConfirming}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {step === "success" && (
        <Modal
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
             <Button variant="app-primary" className="w-full h-[44px]" onClick={reset}>
                Close
             </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
