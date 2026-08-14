import type { Metadata } from "next";
import { ReviewerNotificationsView } from "@/modules/reviewer/notifications/ReviewerNotificationsView";

export const metadata: Metadata = {
  title: "Reviewer Notifications",
};

export default function ReviewerNotificationsPage() {
  return <ReviewerNotificationsView />;
}
