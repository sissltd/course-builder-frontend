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
import { CourseDetailsDrawer } from "./components/CourseDetailsDrawer";
import { 
  MoveToDraftModal, 
  DeleteCourseModal, 
  AppealModal, 
  AppealSuccessModal 
} from "./components/CourseActionsModals";
import { toast } from "sonner";

export const CoursesView = () => {
  const [courses, setCourses] = useState<MyCourse[]>([
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

  const [selectedCourse, setSelectedCourse] = useState<MyCourse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isMoveToDraftOpen, setIsMoveToDraftOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAppealOpen, setIsAppealOpen] = useState(false);
  const [isAppealSuccessOpen, setIsAppealSuccessOpen] = useState(false);

  const handleViewDetails = (course: MyCourse) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  const handleEdit = (course: MyCourse) => {
    console.log("Edit course", course.courseId);
    toast.info(`Editing course: ${course.title}`);
  };

  const handleMoveToDraft = (course: MyCourse) => {
    setSelectedCourse(course);
    setIsMoveToDraftOpen(true);
  };

  const handleAppeal = (course: MyCourse) => {
    setSelectedCourse(course);
    setIsAppealOpen(true);
  };

  const handleDelete = (course: MyCourse) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleResolveIssues = (course: MyCourse) => {
    console.log("Resolve issues for", course.courseId);
    toast.info(`Resolving issues for: ${course.title}`);
    setIsDrawerOpen(false);
  };

  const confirmMoveToDraft = () => {
    if (selectedCourse) {
      setCourses(prev => prev.map(c => 
        c.courseId === selectedCourse.courseId ? { ...c, status: "Draft" } : c
      ));
      toast.success("Course moved to draft");
      setIsMoveToDraftOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      setCourses(prev => prev.filter(c => c.courseId !== selectedCourse.courseId));
      toast.success("Course deleted successfully");
      setIsDeleteOpen(false);
    }
  };

  const confirmAppeal = () => {
    setIsAppealOpen(false);
    setIsAppealSuccessOpen(true);
  };

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
      <div className="flex flex-col gap-[12px] w-full bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] pb-[16px] pt-[20px] px-[16px]">
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
          onRowClick={handleViewDetails}
          tableOptions={{
            meta: {
              onViewDetails: handleViewDetails,
              onEdit: handleEdit,
              onMoveToDraft: handleMoveToDraft,
              onAppeal: handleAppeal,
              onDelete: handleDelete,
            }
          }}
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

      {/* Side Drawer */}
      <CourseDetailsDrawer 
        course={selectedCourse}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onResolveIssues={handleResolveIssues}
      />

      {/* Action Modals */}
      <MoveToDraftModal 
        course={selectedCourse}
        isOpen={isMoveToDraftOpen}
        onOpenChange={setIsMoveToDraftOpen}
        onConfirm={confirmMoveToDraft}
      />
      <DeleteCourseModal 
        course={selectedCourse}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
      />
      <AppealModal 
        course={selectedCourse}
        isOpen={isAppealOpen}
        onOpenChange={setIsAppealOpen}
        onConfirm={confirmAppeal}
      />
      <AppealSuccessModal 
        isOpen={isAppealSuccessOpen}
        onOpenChange={setIsAppealSuccessOpen}
      />
    </div>
  );
};
