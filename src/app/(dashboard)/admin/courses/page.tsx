import React from "react";
import { AdminCoursesView } from "@/modules/admin/courses/AdminCoursesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

export default function AdminCoursesPage() {
  return <AdminCoursesView />;
}
