"use client";

import React from "react";
import Image from "next/image";
import { Book, TickCircle, Money, Profile2User } from "iconsax-react";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { AdminStatCard } from "./components/AdminStatCard";
import { ProductionTrendChart } from "./components/ProductionTrendChart";
import { AverageProductionCost } from "./components/AverageProductionCost";
import { ApePipeline } from "./components/ApePipeline";
import { ApePipelineOverview } from "./components/ApePipelineOverview";
import { AddStaffModal } from "./components/AddStaffModal";
import { useGetAdminOverviewQuery } from "@/redux/slices/adminApi";

export const AdminDashboardView = () => {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  
  const { data, isLoading } = useGetAdminOverviewQuery();

  return (
    <div className="flex flex-col gap-[24px]">
      <WelcomeHeader onInviteClick={() => setIsInviteOpen(true)} />
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />

      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Courses In Review"
          value={isLoading ? "..." : data?.courses.IN_REVIEW.toString() || "0"}
          trend="Needs Attention"
        />
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Published Courses"
          value={isLoading ? "..." : data?.courses.PUBLISHED.toString() || "0"}
          trend="Live Courses"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Total Credited"
          value={isLoading ? "..." : `$${data?.wallet_totals.total_credited || "0.00"}`}
          trend="Platform-wide"
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Awaiting Payout"
          value={isLoading ? "..." : `$${data?.wallet_totals.awaiting_payout || "0.00"}`}
          trend="Pending settlement"
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
