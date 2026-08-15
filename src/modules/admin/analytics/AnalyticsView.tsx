"use client";

import React from "react";
import { Book, User, TickCircle, Money, TickCircle as TickCircleBold } from "iconsax-react";
import { TimeChipFilter } from "./components/TimeChipFilter";
import { AnalyticsStatCard } from "./components/AnalyticsStatCard";
import { DistributionCard } from "./components/DistributionCard";
import { ProductionApprovalChart } from "./components/ProductionApprovalChart";
import { KpiScoreCard } from "./components/KpiScoreCard";

export const AnalyticsView = () => {
  return (
    <div className="flex flex-col gap-[24px]">
      <TimeChipFilter />

      <div className="flex gap-[16px] flex-wrap">
        <AnalyticsStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Total Catalog"
          value="2,503"
          trend="+24 since 7 days"
        />
        <AnalyticsStatCard
          icon={<User variant="Bold" size={20} color="#202020" />}
          label="Total Enrollment"
          value="12.4k"
          trend="+24 since 7 days"
        />
        <AnalyticsStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Avg Completion Rate"
          value="65.6%"
          trendValue="4.5%"
        />
        <AnalyticsStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Overall Cost"
          value="$23.5k"
          trend="Avg $1,455 daily"
        />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[150px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
          <div className="flex gap-[8px] items-start">
            <Money variant="Bold" size={20} color="#202020" />
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              Total Earnings
            </span>
          </div>
          <div className="flex flex-col gap-[12px] w-full">
            <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
              $5,000
            </span>
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
              + $360 (2.3%) this month
            </span>
          </div>
        </div>

        <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex flex-1 flex-col p-[16px]">
          <div className="flex gap-[8px] items-start mb-[20px]">
            <TickCircleBold variant="Bold" size={20} color="#202020" />
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              Distribution
            </span>
          </div>
          <div className="flex gap-[14px] flex-wrap">
            <DistributionCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2Z" fill="#202020"/>
                  <path d="M7.75 12.5L10.25 15L16.25 9" stroke="#FDFDFD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              label="SoluDesks"
              value="235"
            />
            <DistributionCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="#202020"/>
                  <path d="M12 6V18M6 12H18" stroke="#FDFDFD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              label="Udemy"
              value="400"
            />
            <DistributionCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5L12 3L21 5V19L12 21L3 19V5Z" fill="#202020"/>
                  <path d="M12 3V21" stroke="#FDFDFD" strokeWidth="1.5"/>
                  <path d="M3 5L21 19" stroke="#FDFDFD" strokeWidth="1.5"/>
                  <path d="M21 5L3 19" stroke="#FDFDFD" strokeWidth="1.5"/>
                </svg>
              }
              label="Coursera"
              value="234"
            />
          </div>
        </div>
      </div>

      <ProductionApprovalChart />

      <KpiScoreCard />
    </div>
  );
};
