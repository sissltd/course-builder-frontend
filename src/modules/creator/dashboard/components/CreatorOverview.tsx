"use client";

import React from "react";
import { Money, Wallet, Book, Eye } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { useGetCreatorOverviewQuery } from "@/modules/creator/hooks";

export const CreatorOverview = () => {
  const { data: overview, isLoading } = useGetCreatorOverviewQuery();

  const totalCourses = overview
    ? Object.values(overview.courses).reduce((sum, count) => sum + count, 0)
    : 0;
  const inReviewCount = overview?.courses.IN_REVIEW ?? 0;
  const totalEarned = overview?.wallet.total_earned ?? "0.00";
  const walletBalance = overview?.wallet.balance ?? "0.00";
  const currency = overview?.wallet.currency ?? "USD";

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `$0.00`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="flex flex-col gap-[10px] w-full bg-sd-grey-1 border-[1.5px] border-sd-grey-3 rounded-[20px] pb-[16px] pt-[20px] px-[16px] ">
      <h2 className="text-[20px] font-semibold text-sd-grey-12 leading-[28px]">Creator&apos;s overview</h2>
      <div className="flex items-center gap-[11px] w-full flex-wrap">
        {isLoading ? (
          <>
            <StatCard label="Total amount earned" value="—" icon={<Money size={28} variant="Bulk" color="#0A60E1" />} />
            <StatCard label="Wallet Balance" value="—" icon={<Wallet size={28} variant="Bulk" color="#0A60E1" />} />
            <StatCard label="Total courses" value="—" icon={<Book size={28} variant="Bulk" color="#FF5025" />} />
            <StatCard label="In review" value="—" icon={<Eye size={28} variant="Bulk" color="#F2994A" />} />
          </>
        ) : (
          <>
            <StatCard
              label="Total amount earned"
              value={formatCurrency(totalEarned)}
              icon={<Money size={28} variant="Bulk" color="#0A60E1" />}
            />
            <StatCard
              label="Wallet Balance"
              value={formatCurrency(walletBalance)}
              icon={<Wallet size={28} variant="Bulk" color="#0A60E1" />}
            />
            <StatCard
              label="Total courses"
              value={String(totalCourses)}
              icon={<Book size={28} variant="Bulk" color="#FF5025" />}
            />
            <StatCard
              label="In review"
              value={String(inReviewCount)}
              icon={<Eye size={28} variant="Bulk" color="#F2994A" />}
            />
          </>
        )}
      </div>
    </div>
  );
};
