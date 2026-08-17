"use client";

import React from "react";
import { ReviewerPendingTabs } from "./components/ReviewerPendingTabs";
import { ReviewerPendingFilters } from "./components/ReviewerPendingFilters";
import { ReviewerPendingTable } from "./components/ReviewerPendingTable";
import { ReviewerPendingPager } from "./components/ReviewerPendingPager";
import { ReviewerCourseInfoDrawer } from "./components/ReviewerCourseInfoDrawer";
import { pendingCourses } from "./data";

export const ReviewerPendingView = () => {
  const [activeTab, setActiveTab] = React.useState("creators");
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = React.useState(false);
  const [activeCourseIndex, setActiveCourseIndex] = React.useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(pendingCourses.length / itemsPerPage) || 1;
  const paginatedCourses = pendingCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCourse = activeCourseIndex !== null ? pendingCourses[activeCourseIndex] : null;

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
      return Math.min(pendingCourses.length - 1, current + 1);
    });
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <ReviewerPendingTabs activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
      }} />
      <ReviewerPendingFilters />
      <ReviewerPendingTable
        courses={paginatedCourses}
        startIndex={(currentPage - 1) * itemsPerPage}
        onOpenCourse={openCourse}
      />
      <ReviewerPendingPager
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalEntries={pendingCourses.length}
        itemsPerPage={itemsPerPage}
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
        canNext={activeCourseIndex !== null && activeCourseIndex < pendingCourses.length - 1}
      />
    </div>
  );
};
