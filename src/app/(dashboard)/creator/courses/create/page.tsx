import type { Metadata } from "next";
import CreateCourseView from "@/modules/creator/courses/CreateCourseView";

export const metadata: Metadata = {
  title: "Create Course",
};

export default function CreateCoursePage() {
  return <CreateCourseView />;
}
