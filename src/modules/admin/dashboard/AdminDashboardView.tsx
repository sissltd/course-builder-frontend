"use client";

import React from "react";
import Image from "next/image";
import { Book, TickCircle, Money } from "iconsax-react";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { AdminStatCard } from "./components/AdminStatCard";
import { ProductionTrendChart } from "./components/ProductionTrendChart";
import { AverageProductionCost } from "./components/AverageProductionCost";
import { ApePipeline } from "./components/ApePipeline";
import { ApePipelineOverview } from "./components/ApePipelineOverview";
import { AddStaffModal } from "./components/AddStaffModal";

export const AdminDashboardView = () => {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-[24px]">
      <WelcomeHeader onInviteClick={() => setIsInviteOpen(true)} />
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />

      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Courses Created Today"
          value="203"
          trend="12% since yesterday"
          trendIcon={
            <Image src="/assets/dashboard/arrow-up-regular.svg" alt="" width={18} height={18} className="size-[18px]" />
          }
        />
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Published Courses"
          value="156"
          trend="Last 24hrs"
          trendIcon={
            <Image src="/assets/dashboard/arrow-up-regular.svg" alt="" width={18} height={18} className="size-[18px]" />
          }
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Daily cost"
          value="$1,500"
          trend="+2.4% this week"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Daily cost"
          value="$1,500"
          trend="Avg $5 per course"
        />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <ProductionTrendChart />
        <AverageProductionCost />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <ApePipeline />
        <ApePipelineOverview />
      </div>
    </div>
  );
};
