import type { Metadata } from "next";
import { ReviewerInReviewView } from "@/modules/reviewer/in-review/ReviewerInReviewView";

export const metadata: Metadata = {
  title: "In Review",
};

export default function ReviewerInReviewPage() {
  return <ReviewerInReviewView />;
}
