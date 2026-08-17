import React from "react";
import { ReviewerPlaceholderView } from "@/modules/reviewer/dashboard/components/ReviewerPlaceholderView";

export const ReviewQueueView = () => {
  return (
    <ReviewerPlaceholderView
      title="Review Queue"
      description="Courses waiting for reviewer approval will live here."
    />
  );
};
