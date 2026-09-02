"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseTable } from "@/components/shared/BaseTable";
import { courseColumns, Course } from "../columns/courses";
import { Filter, Sort } from "iconsax-react";
import { useGetCoursesQuery } from "@/modules/creator/courses/hooks";
import { CourseStatus, CourseSource } from "@/modules/creator/courses/types";
import { useGetCategoriesQuery } from "@/modules/creator/courses/hooks";
import { CategoryStatus } from "@/modules/creator/courses/types/category";
import { format } from "date-fns";
import { CreatorRoute } from "@/lib/routes";

const mapCourseStatusToDisplay = (status: CourseStatus): Course["status"] => {
  const map: Record<CourseStatus, Course["status"]> = {
    [CourseStatus.DRAFT]: "Draft",
    [CourseStatus.SUBMITTED]: "Draft",
    [CourseStatus.IN_REVIEW]: "In review",
    [CourseStatus.NEEDS_REVISION]: "Needs revision",
    [CourseStatus.QA_VERIFICATION]: "In review",
    [CourseStatus.APPROVED]: "Approved",
    [CourseStatus.PUBLISHED]: "Approved",
    [CourseStatus.ARCHIVED]: "Draft",
    [CourseStatus.REJECTED]: "Rejected",
  };
  return map[status] ?? "Draft";
};

export const CoursesTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: response } = useGetCoursesQuery({
    page,
    size: 6,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
    ...(categoryFilter && { category: categoryFilter }),
  });

  const { data: categoriesResponse } = useGetCategoriesQuery({
    status: CategoryStatus.ACTIVE,
  });
  const categories = categoriesResponse?.data?.results ?? [];

  const courses: Course[] = (response?.data?.results ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category?.name ?? "—",
    qualityScore: 0,
    status: mapCourseStatusToDisplay(c.status),
    lastEdited: format(new Date(c.updated_datetime), "d MMM yyyy, hh:mm a"),
    isAi: c.source === CourseSource.AI_GENERATED,
  }));

  const handleViewDetails = (course: Course) => {
    router.push(`${CreatorRoute.COURSES}?highlight=${course.id}`);
  };

  const handleEdit = (course: Course) => {
    router.push(`${CreatorRoute.COURSES_BUILDER}?id=${course.id}`);
  };

  const handleDelete = (course: Course) => {
    console.log("Delete course", course.id);
  };

  return (
    <BaseTable
      title="My courses"
      columns={courseColumns}
      data={courses}
      searchPlaceholder="Search course"
      onSearchChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      tableOptions={{
        manualPagination: true,
        pageCount: response?.data?.paginator?.total_pages ?? 1,
        state: {
          pagination: {
            pageIndex: page - 1,
            pageSize: 6,
          },
        },
        onPaginationChange: (updater) => {
          const newPage =
            typeof updater === "function"
              ? updater({ pageIndex: page - 1, pageSize: 6 }).pageIndex
              : updater.pageIndex;
          setPage(newPage + 1);
        },
        meta: {
          onViewDetails: handleViewDetails,
          onEdit: handleEdit,
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
            { label: "In Review", value: CourseStatus.IN_REVIEW },
            { label: "Approved", value: CourseStatus.APPROVED },
            { label: "Rejected", value: CourseStatus.REJECTED },
            { label: "Needs Revision", value: CourseStatus.NEEDS_REVISION },
          ],
          onValueChange: (val) => {
            setStatusFilter(val as CourseStatus | "");
            setPage(1);
          },
        },
      ]}
      showDateFilter
    />
  );
};
