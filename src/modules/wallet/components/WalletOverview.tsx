import React from "react";
import { Money, Wallet, Moneys } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { AppButton } from "@/components/shared/AppButton";
import { ArrowUp } from "iconsax-react";

export const WalletOverview = () => {
  return (
    <div className="w-full bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] px-[20px] pt-[20px] pb-[20px] flex flex-col gap-[16px] shadow-sm">
      <h2 className="text-[20px] font-semibold text-sd-grey-12 leading-[28px]">Creator&apos;s overview</h2>

      <div className="flex items-center gap-[16px] w-full flex-wrap">
        <StatCard
          label="Total amount earned"
          value="$456,000.03"
          icon={<Money size={24} variant="Bulk" color="#0063EF" />}
          iconBg="bg-[#EBF3FF]"
        />
        <StatCard
          label="Wallet Balance"
          value="$456,000"
          icon={<Wallet size={24} variant="Bulk" color="#0063EF" />}
          iconBg="bg-[#EBF3FF]"
        />
        <StatCard
          label="Pending payments"
          value="$34,000"
          icon={<Moneys size={24} variant="Bulk" color="#F05A25" />}
          iconBg="bg-[#FFF0ED]"
        />
      </div>

      <div>
        <AppButton
          variant="app-outline"
          leftIcon={<ArrowUp size={18} variant="Linear" color="#0063EF" />}
          className="h-[40px] px-[20px] text-[14px] font-normal"
        >
          Withdraw earnings
        </AppButton>
      </div>
    </div>
  );
};
