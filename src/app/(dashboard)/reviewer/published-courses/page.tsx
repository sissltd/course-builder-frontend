import type { Metadata } from "next";
import { ReviewerPublishedCoursesView } from "@/modules/reviewer/published-courses/ReviewerPublishedCoursesView";

export const metadata: Metadata = {
  title: "Published Courses",
};

export default function ReviewerPublishedCoursesPage() {
  return <ReviewerPublishedCoursesView />;
}
