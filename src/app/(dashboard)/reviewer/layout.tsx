import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { ReviewerDashboardLayout } from "@/modules/reviewer/dashboard/layouts/ReviewerDashboardLayout";
import { UserRole } from "@/modules/auth/types/auth";

export default function ReviewerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.REVIEWER,
        "REVIEWER",
        "STAFF_WRITER",
        "STAFF_VERIFIER",
        "STAFF_APPROVER",
        "CREATOR_REVIEWER",
        "AI_REVIEWER",
        "QA_REVIEWER",
      ]}
    >
      <ReviewerDashboardLayout>{children}</ReviewerDashboardLayout>
    </ProtectedRoute>
  );
}
