import type { Metadata } from "next";
import { ReviewerFeedbackView } from "@/modules/reviewer/feedback/ReviewerFeedbackView";

export const metadata: Metadata = {
  title: "Reviewer Feedback",
};

export default function ReviewerFeedbackPage() {
  return <ReviewerFeedbackView />;
}
