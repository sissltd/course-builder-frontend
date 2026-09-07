"use client";

import React, { useState } from "react";
import { Book, User, TickCircle, Money, Refresh2 } from "iconsax-react";
import { TimeChipFilter } from "./components/TimeChipFilter";
import { AnalyticsStatCard } from "./components/AnalyticsStatCard";
import { DistributionCard } from "./components/DistributionCard";
import { ProductionApprovalChart } from "./components/ProductionApprovalChart";
import { KpiScoreCard } from "./components/KpiScoreCard";
import { useGetAdminAnalyticsQuery } from "@/redux/slices/adminApi";

export const AnalyticsView = () => {
  const [period, setPeriod] = useState<string>("7d");
  const { data, isLoading, isError, refetch } = useGetAdminAnalyticsQuery({ period });

  const formatCost = (val: string | number | null | undefined) => {
    if (val == null) return "—";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <TimeChipFilter value={period} onChange={setPeriod} />
        {isError && (
          <button
            onClick={() => refetch()}
            className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] text-[#0A60E1] bg-[#EBF3FF] hover:bg-[#D9E9FF] rounded-[6px] cursor-pointer transition-colors"
          >
            <Refresh2 size={16} />
            <span>Retry Loading</span>
          </button>
        )}
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <AnalyticsStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Total Catalog"
          value={
            isLoading
              ? "..."
              : data?.catalog?.total_catalog != null
              ? data.catalog.total_catalog.toLocaleString()
              : "—"
          }
          trend={
            data?.catalog?.created_in_period != null
              ? `+${data.catalog.created_in_period} in period`
              : "—"
          }
          isLoading={isLoading}
        />
        <AnalyticsStatCard
          icon={<User variant="Bold" size={20} color="#202020" />}
          label="Total Enrollment"
          value={
            isLoading
              ? "..."
              : data?.enrollment?.total_enrollment != null
              ? data.enrollment.total_enrollment.toLocaleString()
              : "—"
          }
          trend={
            data?.enrollment?.enrolled_in_period != null
              ? `+${data.enrollment.enrolled_in_period} in period`
              : "—"
          }
          isLoading={isLoading}
        />
        <AnalyticsStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Avg Completion Rate"
          value={
            isLoading
              ? "..."
              : data?.enrollment?.avg_completion_rate != null
              ? `${data.enrollment.avg_completion_rate}%`
              : "—"
          }
          trend={
            data?.enrollment?.completed != null
              ? `${data.enrollment.completed} completed`
              : "—"
          }
          isLoading={isLoading}
        />
        <AnalyticsStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Overall Cost"
          value={isLoading ? "..." : formatCost(data?.cost?.overall_cost)}
          trend={
            data?.cost?.cost_in_period != null
              ? `${formatCost(data.cost.cost_in_period)} in period`
              : data?.cost?.cost_per_course != null
              ? `${formatCost(data.cost.cost_per_course)} avg / course`
              : "—"
          }
          isLoading={isLoading}
        />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 min-w-[280px] h-[150px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
          <div className="flex gap-[8px] items-start">
            <Money variant="Bold" size={20} color="#202020" />
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              Total Earnings
            </span>
          </div>
          <div className="flex flex-col gap-[12px] w-full">
            {isLoading ? (
              <div className="h-[32px] w-[140px] bg-[#EAEAEA] animate-pulse rounded-[6px]" />
            ) : (
              <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
                {data?.earnings?.total_earnings != null ? `$${data.earnings.total_earnings}` : "—"}
              </span>
            )}
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
              Period: {data?.period || period}
            </span>
          </div>
        </div>

        <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex flex-1 min-w-[320px] flex-col p-[16px]">
          <div className="flex gap-[8px] items-start mb-[20px]">
            <TickCircle variant="Bold" size={20} color="#202020" />
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              Distribution
            </span>
          </div>
          <div className="flex gap-[14px] flex-wrap">
            {data?.distribution && data.distribution.length > 0 ? (
              data.distribution.map((item) => (
                <DistributionCard
                  key={item.channel}
                  label={item.label || item.channel}
                  value={item.count.toLocaleString()}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <>
                <DistributionCard label="SoluDesk" value="0" isLoading={isLoading} />
                <DistributionCard label="Udemy" value="0" isLoading={isLoading} />
                <DistributionCard label="Coursera" value="0" isLoading={isLoading} />
              </>
            )}
          </div>
        </div>
      </div>

      <ProductionApprovalChart
        productionVsApproval={data?.production_vs_approval}
        daily={data?.cost?.daily}
        isLoading={isLoading}
      />

      <KpiScoreCard kpis={data?.kpis} isLoading={isLoading} />
    </div>
  );
};
