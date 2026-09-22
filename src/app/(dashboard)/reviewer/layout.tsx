import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { ReviewerDashboardLayout } from "@/modules/reviewer/dashboard/layouts/ReviewerDashboardLayout";
import { Workspace } from "@/modules/auth/types/auth";
import { seatsForWorkspace } from "@/modules/auth/utils/workspace";

/** Creator Reviewer, Verifier, Approver and QA Reviewer — per `SEAT_WORKSPACE`. */
const reviewerSeats = seatsForWorkspace(Workspace.REVIEWER_STUDIO);

export default function ReviewerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={reviewerSeats}>
      <ReviewerDashboardLayout>{children}</ReviewerDashboardLayout>
    </ProtectedRoute>
  );
}
