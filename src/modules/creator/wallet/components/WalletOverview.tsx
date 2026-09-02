"use client";

import React, { useState } from "react";
import { Money, Wallet, Moneys, ArrowUp } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/shared/Button";
import { WithdrawalFlow } from "./WithdrawalFlow";
import { useGetWalletQuery } from "@/modules/creator/hooks";

export const WalletOverview = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { data: wallet, isLoading } = useGetWalletQuery();

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] px-[20px] pt-[20px] pb-[20px] flex flex-col gap-[16px] ">
      <h2 className="text-[20px] font-semibold text-sd-grey-12 leading-[28px]">Creator&apos;s overview</h2>

      <div className="flex items-center gap-[16px] w-full flex-wrap">
        {isLoading ? (
          <>
            <div className="h-[100px] flex-1 min-w-[200px] bg-sd-grey-2 animate-pulse rounded-[16px]" />
            <div className="h-[100px] flex-1 min-w-[200px] bg-sd-grey-2 animate-pulse rounded-[16px]" />
            <div className="h-[100px] flex-1 min-w-[200px] bg-sd-grey-2 animate-pulse rounded-[16px]" />
          </>
        ) : (
          <>
            <StatCard
              label="Total amount earned"
              value={formatCurrency(wallet?.total_earned ?? "0")}
              icon={<Money size={24} variant="Bulk" color="#0063EF" />}
              iconBg="bg-[#EBF3FF]"
            />
            <StatCard
              label="Wallet Balance"
              value={formatCurrency(wallet?.balance ?? "0")}
              icon={<Wallet size={24} variant="Bulk" color="#0063EF" />}
              iconBg="bg-[#EBF3FF]"
            />
            <StatCard
              label="Pending payments"
              value={formatCurrency(wallet?.pending_balance ?? "0")}
              icon={<Moneys size={24} variant="Bulk" color="#F05A25" />}
              iconBg="bg-[#FFF0ED]"
            />
          </>
        )}
      </div>

      <div>
        <Button
          variant="app-outline"
          leftIcon={<ArrowUp size={18} variant="Linear" color="#0063EF" />}
          className="h-[40px] px-[20px] text-[14px] font-normal"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          Withdraw earnings
        </Button>
      </div>

      <WithdrawalFlow 
        isOpen={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
      />
    </div>
  );
};
