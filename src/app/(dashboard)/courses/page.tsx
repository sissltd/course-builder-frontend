"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BaseTable } from "@/components/shared/BaseTable";
import { AppButton } from "@/components/shared/AppButton";
import { StatCard } from "@/components/shared/StatCard";
import { myCoursesColumns, MyCourse } from "@/modules/dashboard/columns/my-courses";
import {
  Book,
  Eye,
  Danger,
  CloseCircle,
  Edit,
  Add,
  Filter,
  Sort
} from "iconsax-react";


export default function CoursesPage() {
  const [courses] = useState<MyCourse[]>([
    {
      title: "Introduction to Software Development",
      category: "Information technology",
      courseId: "SLD-Rf...3d5",
      qualityScore: 0,
      status: "In Review",
      lastEdited: "23 Mar 2026, 10:34 PM",
    },
    {
      title: "Version Control and Collaboration",
      category: "Artificial intelligence",
      courseId: "SLD-Rf...3d5",
      qualityScore: 0,
      status: "In Review",
      lastEdited: "23 Mar 2026, 10:34 PM",
      isAi: true,
    },
    {
      title: "Fundamentals of Programming Languages",
      category: "Cloud computing",
      courseId: "SLD-Rf...3d5",
      qualityScore: 10,
      status: "Rejected",
      lastEdited: "23 Mar 2026, 10:34 PM",
    },
    {
      title: "Network Infrastructure Maintenance",
      category: "Information technology",
      courseId: "SLD-Rf...3d5",
      qualityScore: 0,
      status: "Needs revision",
      lastEdited: "23 Mar 2026, 10:34 PM",
      isAi: true,
    },
    {
      title: "Debugging and Testing Techniques",
      category: "Information technology",
      courseId: "SLD-Rf...3d5",
      qualityScore: 0,
      status: "In Review",
      lastEdited: "23 Mar 2026, 10:34 PM",
    },
    {
      title: "Version Control and Collaboration",
      category: "Information technology",
      courseId: "SLD-Rf...3d5",
      qualityScore: 0,
      status: "In Review",
      lastEdited: "23 Mar 2026, 10:34 PM",
      isAi: true,
    },
    {
      title: "Deployment and Maintenance Strategies",
      category: "Cybersecurity",
      courseId: "SLD-Rf...3d5",
      qualityScore: 72,
      status: "Approved",
      lastEdited: "23 Mar 2026, 10:34 PM",
    },
  ]);

  return (
    <div className="flex flex-col gap-[24px] pb-[20px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">My courses</h1>
        <Link href="/courses/create">
          <AppButton 
            variant="app-primary" 
            leftIcon={<Add size={20} variant="Linear" color="#FFF" />}
            className="h-[40px] px-[16px] text-[14px] font-medium"
          >
            Create a course
          </AppButton>
        </Link>
      </div>

      {/* Overview stats cards */}
      <div className="flex flex-col gap-[12px] w-full bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] pb-[16px] pt-[20px] px-[16px] shadow-sm">
        <h2 className="text-[18px] font-semibold text-sd-grey-12 leading-[24px]">Overview</h2>
        <div className="flex items-center gap-[12px] w-full flex-wrap">
          <StatCard 
            label="Total courses" 
            value="5" 
            icon={<Book size={24} variant="Bulk" color="#FF5025" />} 
            iconBg="bg-[#FFF0ED]"
          />
          <StatCard 
            label="In Review" 
            value="12" 
            icon={<Eye size={24} variant="Bulk" color="#0063EF" />} 
            iconBg="bg-[#EBF3FF]"
          />
          <StatCard 
            label="Needs Revision" 
            value="8" 
            icon={<Danger size={24} variant="Bulk" color="#F2994A" />} 
            iconBg="bg-[#FFF5ED]"
          />
          <StatCard 
            label="Rejected" 
            value="12" 
            icon={<CloseCircle size={24} variant="Bulk" color="#FF5025" />} 
            iconBg="bg-[#FFF0ED]"
          />
          <StatCard 
            label="Draft/In Progress" 
            value="2" 
            icon={<Edit size={24} variant="Bulk" color="#606060" />} 
            iconBg="bg-[#F5F5F5]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <BaseTable
          title="My courses"
          columns={myCoursesColumns}
          data={courses}
          searchPlaceholder="Search course, ID"
          filters={[
            {
              label: "Category",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              options: [
                { label: "Information technology", value: "Information technology" },
                { label: "Artificial intelligence", value: "Artificial intelligence" },
                { label: "Cloud computing", value: "Cloud computing" },
                { label: "Cybersecurity", value: "Cybersecurity" },
              ],
              onValueChange: (val) => console.log("Category filter", val),
            },
            {
              label: "Status",
              icon: <Sort size={20} variant="Linear" color="#606060" />,
              options: [
                { label: "Approved", value: "Approved" },
                { label: "In Review", value: "In Review" },
                { label: "Rejected", value: "Rejected" },
                { label: "Needs revision", value: "Needs revision" },
              ],
              onValueChange: (val) => console.log("Status filter", val),
            },
            {
              label: "Course type",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              options: [
                { label: "All", value: "All" },
                { label: "AI-assisted", value: "AI-assisted" },
                { label: "Manual", value: "Manual" },
              ],
              onValueChange: (val) => console.log("Course type filter", val),
            },
          ]}
          showDateFilter
          showPagination
          showHeader={false}
        />
      </div>
    </div>
  );
}
