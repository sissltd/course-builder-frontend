"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BaseTable } from "@/components/shared/BaseTable";
import { Button } from "@/components/shared/Button";
import { StatCard } from "@/components/shared/StatCard";
import { myCoursesColumns } from "@/modules/creator/dashboard/columns/my-courses";
import {
  Book,
  Eye,
  Danger,
  CloseCircle,
  Edit,
  Add,
  Filter,
  Sort,
} from "iconsax-react";
import { CourseDetailsDrawer } from "./components/CourseDetailsDrawer";
import {
  MoveToDraftModal,
  DeleteCourseModal,
  AppealModal,
  AppealSuccessModal,
} from "./components/CourseActionsModals";
import { toast } from "sonner";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useGetCategoriesQuery,
} from "./hooks";
import type { CourseSummary, CoursesListParams } from "./types";
import {
  CourseStatus,
  SourceType,
} from "./types";
import { CategoryStatus } from "./types/category";
import { CreatorRoute } from "@/lib/routes";
import { normalizeApiError } from "@/lib/api/errors";

export const CoursesView = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceType | "">("");
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);

  const queryParams: CoursesListParams = {
    page,
    size: pageSize,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
    ...(categoryFilter && { category: categoryFilter }),
    ...(sourceTypeFilter && { source_type: sourceTypeFilter }),
    ...(dateFrom && { date_from: dateFrom }),
  };

  const { data: response, isLoading, error } = useGetCoursesQuery(queryParams);
  const [deleteCourse] = useDeleteCourseMutation();

  const { data: categoriesResponse } = useGetCategoriesQuery({
    status: CategoryStatus.ACTIVE,
  });
  const categories = categoriesResponse?.data?.results ?? [];

  const courses = response?.data?.results ?? [];
  const paginator = response?.data?.paginator;

  const [selectedCourse, setSelectedCourse] = useState<CourseSummary | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isMoveToDraftOpen, setIsMoveToDraftOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAppealOpen, setIsAppealOpen] = useState(false);
  const [isAppealSuccessOpen, setIsAppealSuccessOpen] = useState(false);

  const handleViewDetails = (course: CourseSummary) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  };

  const handleEdit = (course: CourseSummary) => {
    router.push(`${CreatorRoute.COURSES_BUILDER}?id=${course.id}`);
  };

  const handleMoveToDraft = (course: CourseSummary) => {
    setSelectedCourse(course);
    setIsMoveToDraftOpen(true);
  };

  const handleAppeal = (course: CourseSummary) => {
    setSelectedCourse(course);
    setIsAppealOpen(true);
  };

  const handleDelete = (course: CourseSummary) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleResolveIssues = (course: CourseSummary) => {
    router.push(`${CreatorRoute.COURSES_BUILDER}?id=${course.id}`);
    setIsDrawerOpen(false);
  };

  const confirmMoveToDraft = () => {
    if (selectedCourse) {
      toast.success("Course moved to draft");
      setIsMoveToDraftOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id).unwrap();
      toast.success("Course deleted successfully");
      setIsDeleteOpen(false);
    } catch (err) {
      const { message } = normalizeApiError(err as Parameters<typeof normalizeApiError>[0]);
      toast.error(message ?? "Failed to delete course");
    }
  };

  const confirmAppeal = () => {
    setIsAppealOpen(false);
    setIsAppealSuccessOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-[#606060]">
          Failed to load courses. Please try again.
        </p>
        <Button
          variant="app-primary"
          onClick={() => window.location.reload()}
          className="h-[40px]"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[24px] pb-[20px]">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[24px] font-semibold leading-[32px] tracking-[-0.48px] text-[#202020]">
          My courses
        </h1>
        <Link href={CreatorRoute.COURSES_CREATE}>
          <Button
            variant="app-primary"
            leftIcon={<Add size={20} variant="Linear" color="#FFF" />}
            className="h-[40px] px-[16px] text-[14px] font-medium"
          >
            Create a course
          </Button>
        </Link>
      </div>

      {/* Overview stats cards */}
      <div className="flex w-full flex-col gap-[12px] rounded-[20px] border border-sd-grey-3 bg-sd-grey-1 px-[16px] pt-[20px] pb-[16px]">
        <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
          Overview
        </h2>
        <div className="flex w-full flex-wrap items-center gap-[12px]">
          <StatCard
            label="Total courses"
            value={String(paginator?.count ?? 0)}
            icon={<Book size={24} variant="Bulk" color="#FF5025" />}
            iconBg="bg-[#FFF0ED]"
          />
          <StatCard
            label="In Review"
            value="—"
            icon={<Eye size={24} variant="Bulk" color="#0063EF" />}
            iconBg="bg-[#EBF3FF]"
          />
          <StatCard
            label="Needs Revision"
            value="—"
            icon={<Danger size={24} variant="Bulk" color="#F2994A" />}
            iconBg="bg-[#FFF5ED]"
          />
          <StatCard
            label="Rejected"
            value="—"
            icon={<CloseCircle size={24} variant="Bulk" color="#FF5025" />}
            iconBg="bg-[#FFF0ED]"
          />
          <StatCard
            label="Draft/In Progress"
            value="—"
            icon={<Edit size={24} variant="Bulk" color="#606060" />}
            iconBg="bg-[#F5F5F5]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
          </div>
        ) : (
          <BaseTable
            title="My courses"
            columns={myCoursesColumns}
            data={courses}
            searchPlaceholder="Search course, ID"
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onRowClick={handleViewDetails}
            tableOptions={{
              manualPagination: true,
              pageCount: paginator?.total_pages ?? 1,
              state: {
                pagination: {
                  pageIndex: page - 1,
                  pageSize,
                },
              },
              onPaginationChange: (updater) => {
                const newPage =
                  typeof updater === "function"
                    ? updater({ pageIndex: page - 1, pageSize }).pageIndex
                    : updater.pageIndex;
                setPage(newPage + 1);
              },
              meta: {
                onViewDetails: handleViewDetails,
                onEdit: handleEdit,
                onMoveToDraft: handleMoveToDraft,
                onAppeal: handleAppeal,
                onDelete: handleDelete,
              },
            }}
            filters={[
              {
                label: "Category",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                searchable: true,
                searchPlaceholder: "Search category...",
                options: categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                })),
                onValueChange: (val) => {
                  setCategoryFilter(val);
                  setPage(1);
                },
              },
              {
                label: "Status",
                icon: <Sort size={20} variant="Linear" color="#606060" />,
                options: [
                  { label: "Draft", value: CourseStatus.DRAFT },
                  { label: "Submitted", value: CourseStatus.SUBMITTED },
                  { label: "In Review", value: CourseStatus.IN_REVIEW },
                  { label: "Needs Revision", value: CourseStatus.NEEDS_REVISION },
                  { label: "Approved", value: CourseStatus.APPROVED },
                  { label: "Published", value: CourseStatus.PUBLISHED },
                  { label: "Rejected", value: CourseStatus.REJECTED },
                  { label: "Archived", value: CourseStatus.ARCHIVED },
                ],
                onValueChange: (val) => {
                  setStatusFilter(val as CourseStatus | "");
                  setPage(1);
                },
              },
              {
                label: "Course type",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                options: [
                  { label: "Creator Uploaded", value: SourceType.CREATOR_UPLOADED },
                  { label: "AI Generated", value: SourceType.AI_GENERATED },
                  { label: "Developer API", value: SourceType.DEVELOPER_API },
                ],
                onValueChange: (val) => {
                  setSourceTypeFilter(val as SourceType | "");
                  setPage(1);
                },
              },
            ]}
            showDateFilter
            selectedDate={dateFrom ? new Date(dateFrom) : undefined}
            onDateChange={(date) => {
              if (date) {
                setDateFrom(date.toISOString().split("T")[0]);
              } else {
                setDateFrom(undefined);
              }
              setPage(1);
            }}
            showPagination
            showHeader={false}
          />
        )}
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
