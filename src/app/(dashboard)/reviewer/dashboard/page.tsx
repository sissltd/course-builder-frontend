import type { Metadata } from "next";
import { ReviewerDashboardView } from "@/modules/reviewer/dashboard/ReviewerDashboardView";

export const metadata: Metadata = {
  title: "Reviewer Dashboard",
};

export default function ReviewerDashboardPage() {
  return <ReviewerDashboardView />;
}
