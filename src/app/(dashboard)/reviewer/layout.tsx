import React from "react";
import { ReviewerDashboardLayout } from "@/modules/reviewer/dashboard/layouts/ReviewerDashboardLayout";

export default function ReviewerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReviewerDashboardLayout>{children}</ReviewerDashboardLayout>;
}
