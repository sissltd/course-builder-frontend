"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReviewerPendingTable } from "@/modules/reviewer/pending/components/ReviewerPendingTable";
import { ReviewerPendingFilters } from "@/modules/reviewer/pending/components/ReviewerPendingFilters";
import { ReviewerPendingPager } from "@/modules/reviewer/pending/components/ReviewerPendingPager";
import { ReviewerCourseInfoDrawer } from "@/modules/reviewer/pending/components/ReviewerCourseInfoDrawer";
import { useGetReviewQueueAllQuery } from "@/modules/reviewer/api/reviewQueueApi";
import { mapToReviewQueueRows, type ReviewQueueRow } from "@/modules/reviewer/types/reviewQueue";

/** The queue spans every review status; each tab narrows to one. */
const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "SUBMITTED", label: "Submitted" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "QA_VERIFICATION", label: "QA Verification" },
  { key: "APPROVED", label: "Approved" },
  { key: "PUBLISHED", label: "Published" },
] as const;

export const ReviewQueueView = () => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching } = useGetReviewQueueAllQuery({
    status: activeTab === "ALL" ? undefined : activeTab,
    search: debouncedSearch.trim() || undefined,
    category: category || undefined,
    date_from: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
    date_to: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    page: currentPage,
    size: pageSize,
  });

  const courses: ReviewQueueRow[] = useMemo(
    () => mapToReviewQueueRows(data?.data?.results),
    [data?.data?.results],
  );

  const paginator = data?.data?.paginator;
  const totalEntries = paginator?.count ?? 0;
  const totalPages =
    paginator?.total_pages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  const activeCourse =
    activeCourseIndex !== null && activeCourseIndex < courses.length
      ? courses[activeCourseIndex]
      : null;

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Status tabs */}
      <div className="border-b border-sd-grey-3">
        <div className="flex items-center gap-[24px] overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                  setActiveCourseIndex(null);
                }}
                className={cn(
                  "relative shrink-0 pb-[12px] text-[16px] font-normal leading-[24px] transition-colors",
                  active ? "text-sd-grey-12" : "text-sd-muted-text",
                )}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-sd-grey-12" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ReviewerPendingFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={(value) => {
          setCategory(value);
          setCurrentPage(1);
        }}
        fromDate={fromDate}
        onFromDateChange={(date) => {
          setFromDate(date);
          setCurrentPage(1);
        }}
        toDate={toDate}
        onToDateChange={(date) => {
          setToDate(date);
          setCurrentPage(1);
        }}
      />

      <ReviewerPendingTable
        courses={courses}
        startIndex={(currentPage - 1) * pageSize}
        isLoading={isLoading || isFetching}
        onOpenCourse={(index) => {
          setActiveCourseIndex(index);
          setIsCourseDrawerOpen(true);
        }}
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
          if (!open) setActiveCourseIndex(null);
        }}
        onPrevious={() =>
          setActiveCourseIndex((current) =>
            current === null ? current : Math.max(0, current - 1),
          )
        }
        onNext={() =>
          setActiveCourseIndex((current) =>
            current === null ? current : Math.min(courses.length - 1, current + 1),
          )
        }
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < courses.length - 1}
      />
    </div>
  );
};
