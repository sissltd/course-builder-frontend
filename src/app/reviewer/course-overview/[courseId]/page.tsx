import type { Metadata } from "next";
import { ReviewerCourseOverviewView } from "@/modules/reviewer/course-overview/ReviewerCourseOverviewView";

export const metadata: Metadata = {
  title: "Course Overview",
};

export default async function ReviewerCourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <ReviewerCourseOverviewView courseId={decodeURIComponent(courseId)} />;
}
