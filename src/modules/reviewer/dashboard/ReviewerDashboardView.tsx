import React from "react";
import { ReviewerActivityOverview } from "./components/ReviewerActivityOverview";
import { ReviewerEmptyPanel } from "./components/ReviewerEmptyPanel";
import { ReviewerMetricCard } from "./components/ReviewerMetricCard";

export const ReviewerDashboardView = () => {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="grid grid-cols-1 gap-[16px] xl:grid-cols-[minmax(320px,447px)_minmax(0,691px)]">
        <div className="flex flex-col gap-[16px]">
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/book-reviewed.svg"
            value="245"
            label="Courses Reviewed"
          />
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/book-queue.svg"
            value="245"
            label="Courses in Queue"
          />
          <ReviewerMetricCard
            iconSrc="/assets/reviewer/escalation-resolved.svg"
            value="245"
            label="Escalation resolved"
          />
        </div>

        <ReviewerActivityOverview />
      </div>

      <ReviewerEmptyPanel />
    </div>
  );
};
