import type { Metadata } from "next";
import { ReviewerCoursesView } from "@/modules/reviewer/courses/ReviewerCoursesView";

export const metadata: Metadata = {
  title: "Reviewer Courses",
};

export default function ReviewerCoursesPage() {
  return <ReviewerCoursesView />;
}
