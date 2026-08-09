import { CoursesView } from "@/modules/creator/courses/CoursesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return <CoursesView />;
}
