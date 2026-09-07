"use client";

import React from "react";
import { Book, TickCircle, Money } from "iconsax-react";
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

  const coursesInReview = data?.courses?.IN_REVIEW ?? 0;

  return (
    <div className="flex flex-col gap-[24px]">
      <WelcomeHeader onInviteClick={() => setIsInviteOpen(true)} />
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />

      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Courses In Review"
          value={isLoading ? "..." : coursesInReview.toString()}
          trend={coursesInReview > 0 ? "Needs review" : "Queue clear"}
        />
        <AdminStatCard
          icon={<Book variant="Linear" size={20} color="#202020" />}
          label="Published Courses"
          value={
            isLoading
              ? "..."
              : (data?.today?.published_total != null
                  ? data.today.published_total.toString()
                  : data?.courses?.PUBLISHED != null
                  ? data.courses.PUBLISHED.toString()
                  : "0")
          }
          trend={
            data?.today?.published_last_24h != null
              ? `+${data.today.published_last_24h} in 24h`
              : "Live platform courses"
          }
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Total Credited"
          value={isLoading ? "..." : `$${data?.wallet_totals?.total_credited || "0.00"}`}
          trend="Platform-wide"
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Awaiting Payout"
          value={isLoading ? "..." : `$${data?.wallet_totals?.awaiting_payout || "0.00"}`}
          trend="Deducted, pending settlement"
        />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <ProductionTrendChart
          productionTrend={data?.production_trend}
          todayCount={data?.today?.courses_created_today}
          changePercent={data?.today?.courses_created_change_percent}
          isLoading={isLoading}
        />
        <AverageProductionCost
          costTrend={data?.cost_trend}
          avgCost={data?.today?.avg_cost_per_course}
          dailyCost={data?.today?.daily_cost}
          changePercent={data?.today?.daily_cost_change_percent}
          isLoading={isLoading}
        />
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <ApePipeline />
        <ApePipelineOverview />
      </div>
    </div>
  );
};
