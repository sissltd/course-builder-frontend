import type { Metadata } from "next";
import { ReviewerActivityLogView } from "@/modules/reviewer/activity-log/ReviewerActivityLogView";

export const metadata: Metadata = {
  title: "Reviewer Activity Log",
};

export default function ReviewerActivityLogPage() {
  return <ReviewerActivityLogView />;
}
