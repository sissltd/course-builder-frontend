import AiCourseGenerationView from "@/modules/creator/courses/AiCourseGenerationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Course with AI",
};

export default function AiCourseCreationPage() {
  return <AiCourseGenerationView />;
}
