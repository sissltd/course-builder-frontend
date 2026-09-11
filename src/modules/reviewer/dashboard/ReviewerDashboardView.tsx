"use client";

import React from "react";
import { ReviewerActivityOverview } from "./components/ReviewerActivityOverview";
import { ReviewerEmptyPanel } from "./components/ReviewerEmptyPanel";
import { ReviewerMetricCard } from "./components/ReviewerMetricCard";
import { useGetReviewerOverviewQuery } from "./hooks";

export const ReviewerDashboardView = () => {
  const { data: overview, isLoading } = useGetReviewerOverviewQuery();

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="grid grid-cols-1 gap-[16px] xl:grid-cols-[minmax(320px,447px)_minmax(0,691px)]">
        <div className="flex flex-col gap-[16px]">
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/book-reviewed.svg"
            value={overview?.courses_reviewed ?? 0}
            label="Courses Reviewed"
            isLoading={isLoading}
          />
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/book-queue.svg"
            value={overview?.courses_in_queue ?? 0}
            label="Courses in Queue"
            isLoading={isLoading}
          />
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/escalation-resolved.svg"
            value={overview?.escalations_resolved ?? 0}
            label="Escalation resolved"
            isLoading={isLoading}
          />
        </div>

        <ReviewerActivityOverview />
      </div>

      <ReviewerEmptyPanel />
    </div>
  );
};

