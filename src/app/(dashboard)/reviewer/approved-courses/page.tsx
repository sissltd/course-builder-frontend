import type { Metadata } from "next";
import { ReviewerApprovedCoursesView } from "@/modules/reviewer/approved-courses/ReviewerApprovedCoursesView";

export const metadata: Metadata = {
  title: "Approved Courses",
};

export default function ReviewerApprovedCoursesPage() {
  return <ReviewerApprovedCoursesView />;
}
