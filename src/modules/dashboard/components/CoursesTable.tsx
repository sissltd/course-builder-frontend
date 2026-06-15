"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { courseColumns, Course } from "../columns/courses";
import { Filter, Sort } from "iconsax-react";

const courses: Course[] = [
  { title: "Introduction to Software Development", category: "Information technology", qualityScore: 0, status: "Draft", lastEdited: "23 Mar 2026, 10:34 PM" },
  { title: "Version Control and Collaboration", category: "Artificial intelligence", qualityScore: 0, status: "In review", lastEdited: "23 Mar 2026, 10:34 PM", isAi: true },
  { title: "Fundamentals of Programming Languages", category: "Cloud computing", qualityScore: 10, status: "Rejected", lastEdited: "23 Mar 2026, 10:34 PM" },
  { title: "Network Infrastructure Maintenance", category: "Information technology", qualityScore: 0, status: "Needs revision", lastEdited: "23 Mar 2026, 10:34 PM", isAi: true },
  { title: "Debugging and Testing Techniques", category: "Information technology", qualityScore: 0, status: "Draft", lastEdited: "23 Mar 2026, 10:34 PM" },
  { title: "Deployment and Maintenance Strategies", category: "Cybersecurity", qualityScore: 72, status: "Approved", lastEdited: "23 Mar 2026, 10:34 PM" },
];

export const CoursesTable = () => {
  return (
    <BaseTable
      title="My courses"
      columns={courseColumns}
      data={courses}
      searchPlaceholder="Search course"
      filters={[
        {
          label: "Category",
          icon: <Filter size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Information technology", value: "Information technology" },
            { label: "Artificial Intelligence", value: "Artificial intelligence" },
            { label: "Cloud computing", value: "Cloud computing" },
            { label: "Cybersecurity", value: "Cybersecurity" },
          ],
          onValueChange: (val) => console.log("Category filter", val),
        },
        {
          label: "Status",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Draft", value: "Draft" },
            { label: "Approved", value: "Approved" },
            { label: "In Review", value: "In review" },
            { label: "Rejected", value: "Rejected" },
            { label: "Needs Revision", value: "Needs revision" },
          ],
          onValueChange: (val) => console.log("Status filter", val),
        },
      ]}
      showDateFilter
    />
  );
};
