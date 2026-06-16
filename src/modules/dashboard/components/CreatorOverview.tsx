import React from "react";
import { Money, Wallet, Book, Eye } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";

export const CreatorOverview = () => {
  return (
    <div className="flex flex-col gap-[10px] w-full bg-sd-grey-1 border-[1.5px] border-sd-grey-3 rounded-[20px] pb-[16px] pt-[20px] px-[16px] shadow-sm">
      <h2 className="text-[20px] font-semibold text-sd-grey-12 leading-[28px]">Creator&apos;s overview</h2>
      <div className="flex items-center gap-[11px] w-full">
        <StatCard
          label="Total amount earned"
          value="$456,000.03"
          icon={<Money size={28} variant="Bulk" color="#0A60E1" />}
        />
        <StatCard
          label="Wallet Balance"
          value="$456,000"
          icon={<Wallet size={28} variant="Bulk" color="#0A60E1" />}
        />
        <StatCard
          label="Total courses"
          value="32"
          icon={<Book size={28} variant="Bulk" color="#FF5025" />}
        />
        <StatCard
          label="In review"
          value="12"
          icon={<Eye size={28} variant="Bulk" color="#F2994A" />}
        />
      </div>
    </div>
  );
};
