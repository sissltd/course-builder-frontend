import React from "react";
import { JourneyCard } from "@/modules/dashboard/components/JourneyCard";
import { CreatorOverview } from "@/modules/dashboard/components/CreatorOverview";
import { CoursesTable } from "@/modules/dashboard/components/CoursesTable";
import { TransactionsTable } from "@/modules/dashboard/components/TransactionsTable";
import { TopCreatorIcon } from "@/modules/dashboard/components/icons/TopCreatorIcon";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[24px] pb-[20px]">
      {/* Welcome Section */}
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Welcome, emmanuel!</h1>
            <p className="text-[16px] text-[#636363] leading-[24px]">Lets help you create something good today</p>
          </div>
          <div className="bg-[#FDFDFD] border border-[#C3DEF3] flex gap-[8px] items-center justify-center pl-[8px] pr-[12px] py-[8px] relative rounded-[8px] w-fit">
             <TopCreatorIcon size={24} />
             <span className="text-[16px] font-normal tracking-[-0.32px] bg-clip-text text-transparent bg-gradient-to-r from-[#606060] to-[#C6C6C6] leading-[24px]">Top creator</span>
          </div>
        </div>
      </div>

      {/* Journey Card */}
      <div className="w-full">
        <JourneyCard />
      </div>

      {/* Overview */}
      <div className="w-full">
        <CreatorOverview />
      </div>

      {/* Tables */}
      <div className="flex flex-col gap-[24px] w-full">
        <div className="w-full">
          <CoursesTable />
        </div>
        <div className="w-full">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
}
