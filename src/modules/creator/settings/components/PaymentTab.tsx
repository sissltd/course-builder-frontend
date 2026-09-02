"use client";

import React, { useState } from "react";
import { Bank } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { AddPayoutAccount } from "./AddPayoutAccount";
import {
  useGetPayoutAccountsQuery,
  useDeletePayoutAccountMutation,
  useSetDefaultPayoutAccountMutation,
} from "@/modules/creator/hooks";
import { toast } from "sonner";

export const PaymentTab = () => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const { data: accounts = [], refetch } = useGetPayoutAccountsQuery();
  const [deleteAccount] = useDeletePayoutAccountMutation();
  const [setDefaultAccount] = useSetDefaultPayoutAccountMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id).unwrap();
      toast.success("Account removed");
      refetch();
    } catch {
      toast.error("Failed to remove account");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAccount(id).unwrap();
      toast.success("Default account updated");
      refetch();
    } catch {
      toast.error("Failed to update default account");
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Payout accounts</h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">Configure and select how you want to receive payments</p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {accounts.map((account) => (
          <div key={account.id} className="flex flex-col gap-[8px]">
            <p className="text-[14px] font-medium text-[#606060]">Local account</p>
            <div
              className={`p-[20px] border rounded-[12px] flex items-center justify-between bg-white ${
                account.is_default ? "border-[#0063EF]" : "border-[#F0F0F0]"
              }`}
            >
              <div className="flex items-center gap-[12px]">
                <div
                  className={`size-[48px] rounded-full flex items-center justify-center text-white shrink-0 ${
                    account.is_default ? "bg-[#0063EF]" : "bg-sd-grey-11"
                  }`}
                >
                  <Bank size={24} variant="Bold" color="#FFFFFF" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">{account.account_name}</span>
                  <span className="text-[14px] text-[#606060] leading-[20px]">{account.bank_name} - {account.account_number}</span>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                {account.is_default && (
                  <span className="px-[8px] py-[2px] bg-[#EBF3FF] text-[#0063EF] rounded-[4px] text-[12px] font-medium">Default</span>
                )}
                {!account.is_default && (
                  <button
                    onClick={() => handleSetDefault(account.id)}
                    className="bg-[#EBF3FF] text-[#0063EF] hover:bg-[#D6EAFF] px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium transition-colors"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(account.id)}
                  className="bg-[#FFF0ED] text-[#FF5025] hover:bg-[#FFE5E0] px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <p className="text-[14px] text-[#606060]">No payout accounts added yet.</p>
        )}
      </div>

      <div>
        <Button 
          variant="app-outline" 
          className="text-[#0063EF] border-[#0063EF] font-medium h-[40px] px-[16px] hover:bg-[#F4F9FF]"
          onClick={() => setIsAddAccountOpen(true)}
        >
          + Add account
        </Button>
      </div>

      <AddPayoutAccount 
        isOpen={isAddAccountOpen} 
        onOpenChange={setIsAddAccountOpen} 
        onSuccess={() => refetch()}
      />
    </div>
  );
};
