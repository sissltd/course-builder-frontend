import type { Metadata } from "next";
import { ReviewerPendingView } from "@/modules/reviewer/pending/ReviewerPendingView";

export const metadata: Metadata = {
  title: "Pending Reviews",
};

export default function ReviewerPendingPage() {
  return <ReviewerPendingView />;
}
