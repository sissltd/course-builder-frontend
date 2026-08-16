import type { Metadata } from "next";
import { AdminCourseOverviewView } from "@/modules/admin/course-overview/AdminCourseOverviewView";

export const metadata: Metadata = {
  title: "Admin Course Overview",
};

export default async function AdminCourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <AdminCourseOverviewView courseId={decodeURIComponent(courseId)} />;
}
