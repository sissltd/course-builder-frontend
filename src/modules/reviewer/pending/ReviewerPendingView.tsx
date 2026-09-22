"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ReviewerPendingTabs } from "./components/ReviewerPendingTabs";
import { ReviewerPendingFilters } from "./components/ReviewerPendingFilters";
import { ReviewerPendingTable } from "./components/ReviewerPendingTable";
import { ReviewerPendingPager } from "./components/ReviewerPendingPager";
import { ReviewerCourseInfoDrawer } from "./components/ReviewerCourseInfoDrawer";
import { useGetReviewQueuePendingQuery } from "./hooks";
import { mapToReviewQueueRows, type ReviewQueueRow } from "./types";

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
  const { data, isLoading, isFetching } = useGetReviewQueuePendingQuery({
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

  const courses: ReviewQueueRow[] = useMemo(() => {
    return mapToReviewQueueRows(rawCourses);
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
