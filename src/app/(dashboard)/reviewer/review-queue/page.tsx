import type { Metadata } from "next";
import { ReviewQueueView } from "@/modules/reviewer/review-queue/ReviewQueueView";

export const metadata: Metadata = {
  title: "Review Queue",
};

export default function ReviewQueuePage() {
  return <ReviewQueueView />;
}
