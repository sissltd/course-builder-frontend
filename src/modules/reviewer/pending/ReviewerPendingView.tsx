"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ReviewerPendingTabs } from "./components/ReviewerPendingTabs";
import { ReviewerPendingFilters } from "./components/ReviewerPendingFilters";
import { ReviewerPendingTable } from "./components/ReviewerPendingTable";
import { ReviewerPendingPager } from "./components/ReviewerPendingPager";
import { ReviewerCourseInfoDrawer } from "./components/ReviewerCourseInfoDrawer";
import { useGetPendingCoursesQuery } from "./hooks";
import type { PendingCourseRow } from "./types";
import type { AdminCourseItem } from "@/redux/slices/adminApi";

function formatDifficulty(diff?: string | null): string {
  if (!diff) return "—";
  const lower = diff.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return format(d, "dd MMM yyyy, hh:mma");
  } catch {
    return dateStr;
  }
}

function mapToPendingRow(item: AdminCourseItem): PendingCourseRow {
  let creatorName = "—";
  if (typeof item.creator === "object" && item.creator !== null) {
    const fullName = `${item.creator.first_name || ""} ${item.creator.last_name || ""}`.trim();
    creatorName = fullName || item.creator.name || item.creator.email || "—";
  } else if (typeof item.creator === "string" && item.creator.trim()) {
    creatorName = item.creator;
  }

  const displayId =
    item.id.length > 14
      ? `SLD-${item.id.slice(0, 6)}...`
      : item.id;

  return {
    id: item.id,
    creator: creatorName,
    courseTitle: item.title || "Untitled Course",
    courseId: displayId,
    category: item.category?.name || "General",
    difficultyLevel: formatDifficulty(item.difficulty_level),
    approvedBy: (item as any).approved_by || "Pending assignment",
    dateApproved: item.date_approved
      ? formatDisplayDate(item.date_approved)
      : item.submitted_at
        ? formatDisplayDate(item.submitted_at)
        : "Pending approval",
    dateCreated: formatDisplayDate(item.created_datetime),
    raw: item,
  };
}

export const ReviewerPendingView = () => {
  const [activeTab, setActiveTab] = useState("creators");
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Tab or filter changes reset page
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setActiveCourseIndex(null);
  };

  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff);
    setCurrentPage(1);
  };

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    setCurrentPage(1);
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    setCurrentPage(1);
  };

  // API Call
  const { data, isLoading, isFetching } = useGetPendingCoursesQuery({
    source_type: activeTab === "ai" ? "AI_GENERATED" : "CREATOR_UPLOADED",
    search: debouncedSearch.trim() || undefined,
    category: category || undefined,
    difficulty_level: difficulty || undefined,
    date_from: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
    date_to: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    page: currentPage,
    size: pageSize,
  });

  const rawCourses = data?.data?.results ?? [];
  const paginator = data?.data?.paginator;

  const courses: PendingCourseRow[] = useMemo(() => {
    return rawCourses.map(mapToPendingRow);
  }, [rawCourses]);

  const totalEntries = paginator?.count ?? 0;
  const totalPages = paginator?.total_pages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  const activeCourse =
    activeCourseIndex !== null && activeCourseIndex < courses.length
      ? courses[activeCourseIndex]
      : null;

  const openCourse = (index: number) => {
    setActiveCourseIndex(index);
    setIsCourseDrawerOpen(true);
  };

  const goToPreviousCourse = () => {
    setActiveCourseIndex((current) => {
      if (current === null) return current;
      return Math.max(0, current - 1);
    });
  };

  const goToNextCourse = () => {
    setActiveCourseIndex((current) => {
      if (current === null) return current;
      return Math.min(courses.length - 1, current + 1);
    });
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <ReviewerPendingTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <ReviewerPendingFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={handleCategoryChange}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        fromDate={fromDate}
        onFromDateChange={handleFromDateChange}
        toDate={toDate}
        onToDateChange={handleToDateChange}
      />

      <ReviewerPendingTable
        courses={courses}
        startIndex={(currentPage - 1) * pageSize}
        isLoading={isLoading || isFetching}
        onOpenCourse={openCourse}
      />

      <ReviewerPendingPager
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={totalEntries}
        itemsPerPage={pageSize}
      />

      <ReviewerCourseInfoDrawer
        course={activeCourse}
        isOpen={isCourseDrawerOpen}
        onOpenChange={(open) => {
          setIsCourseDrawerOpen(open);
          if (!open) {
            setActiveCourseIndex(null);
          }
        }}
        onPrevious={goToPreviousCourse}
        onNext={goToNextCourse}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < courses.length - 1}
      />
    </div>
  );
};
