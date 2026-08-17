"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Copy, CloseCircle } from "iconsax-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { ReviewerInReviewFilters } from "./components/ReviewerInReviewFilters";

interface InReviewCourse {
  creator: string;
  courseTitle: string;
  courseId: string;
  fullCourseId: string;
  category: string;
  difficultyLevel: string;
  reviewer: string;
  dateApproved: string;
}

const mockInReviewCourses: InReviewCourse[] = Array.from({ length: 13 }, (_, idx) => ({
  creator: "Osaite Emmanuel",
  courseTitle: "Machine Learning and Design",
  courseId: "SLD-e4...3d5",
  fullCourseId: `SLD-e4453-de73s-a3d5-${idx}`,
  category: "Software Engineering",
  difficultyLevel: idx % 3 === 0 ? "Advanced" : "Intermediate",
  reviewer: "Osaite Emmanuel",
  dateApproved: "15 May 2026, 03:40PM",
}));

const tableGridClassName =
  "grid grid-cols-[minmax(140px,1.1fr)_minmax(180px,1.3fr)_minmax(130px,1fr)_minmax(140px,1.1fr)_minmax(120px,0.9fr)_minmax(140px,1.1fr)_minmax(160px,1.2fr)] gap-[16px] items-center px-[20px] py-[12px]";

const ArrowRight3Icon = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14.4302 5.92969L20.5002 11.9997L14.4302 18.0697"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 12H20.33"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DrawerDetailRow = ({
  label,
  value,
  canCopy = false,
  onCopy,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  onCopy?: () => void;
}) => (
  <div className="flex items-start justify-between gap-[16px]">
    <span className="shrink-0 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
      {label}
    </span>
    <div className="flex min-w-0 items-center gap-[8px] text-right">
      <span className="truncate text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
        {value}
      </span>
      {canCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex size-[20px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12 cursor-pointer"
          aria-label={`Copy ${label}`}
        >
          <Copy size={20} variant="Linear" color="currentColor" />
        </button>
      )}
    </div>
  </div>
);

const InReviewCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  course: InReviewCourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) => {
  if (!course) return null;

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      showCloseButton={false}
      className="!w-full !max-w-full shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] md:!w-[420px] md:!max-w-[420px]"
      headerClassName="border-sd-grey-6 px-[20px]"
      contentClassName="px-[20px] pb-[24px] pt-[24px]"
      title={
        <div className="flex w-full items-center justify-between gap-[16px]">
          <span className="truncate text-[20px] font-semibold leading-[28px] text-sd-grey-12">
            Course Information
          </span>

          <div className="flex items-center gap-[12px]">
            <div className="flex h-[32px] items-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canPrevious}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11",
                  !canPrevious && "cursor-not-allowed opacity-40",
                )}
                aria-label="Previous course"
              >
                <ArrowRight3Icon size={20} className="rotate-180" />
              </button>
              <div className="h-[16px] w-px bg-sd-grey-3" />
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11",
                  !canNext && "cursor-not-allowed opacity-40",
                )}
                aria-label="Next course"
              >
                <ArrowRight3Icon size={20} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-11 transition-colors hover:bg-sd-grey-2 cursor-pointer"
              aria-label="Close course information"
            >
              <CloseCircle size={20} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-[32px]">
        {/* Reviewer Information */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            REVIEWER INFORMATION
          </h2>
          <DrawerDetailRow label="Reviewer" value={course.reviewer} />
          <DrawerDetailRow
            label="Reviewer ID"
            value="Td4fJcvnJ88-04924945"
            canCopy
            onCopy={() => void copyText("Td4fJcvnJ88-04924945")}
          />
          <DrawerDetailRow label="Last reviewed" value="15 August 2026, 07:32PM" />
        </section>

        <div className="h-px w-full bg-sd-grey-3" />

        {/* Course Information */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            COURSE INFORMATION
          </h2>
          <DrawerDetailRow label="Course Title" value={course.courseTitle} />
          <DrawerDetailRow label="Category" value={course.category} />
          <DrawerDetailRow label="Difficulty Level" value={course.difficultyLevel} />
          <DrawerDetailRow
            label="Course ID"
            value="Td4fJcvnJ88-04924945"
            canCopy
            onCopy={() => void copyText("Td4fJcvnJ88-04924945")}
          />
        </section>
      </div>
    </SideDrawer>
  );
};

export const ReviewerInReviewView = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockInReviewCourses.length / itemsPerPage) || 1;
  const paginatedCourses = mockInReviewCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [activeCourseIndex, setActiveCourseIndex] = React.useState<number | null>(null);

  const activeCourse = activeCourseIndex !== null ? mockInReviewCourses[activeCourseIndex] : null;

  const copyCourseId = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[16px]">
      {/* Search & filters row */}
      <ReviewerInReviewFilters />

      {/* Main Table Content Container */}
      <div className="flex flex-col gap-[20px] w-full">
        <div className="w-full overflow-x-auto rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
          <div className="w-full min-w-[1000px]">
            {/* Table Header Row */}
            <div className={cn(tableGridClassName, "bg-[#F0F0F0CC] border-b border-sd-grey-3")}>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Creator
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Course Title
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Course ID
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Category
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Difficulty Level
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Reviewed by
              </span>
              <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                Date Approved
              </span>
            </div>

            {/* Table Body Rows */}
            <div className="flex flex-col">
              {paginatedCourses.map((course, idx) => {
                const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                return (
                  <div
                    key={course.fullCourseId}
                    onClick={() => setActiveCourseIndex(globalIdx)}
                    className={cn(
                      tableGridClassName,
                      "border-b border-sd-grey-3/70 transition-colors hover:bg-sd-grey-2 cursor-pointer",
                      idx === paginatedCourses.length - 1 && "border-b-0"
                    )}
                  >
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.creator}
                  </span>
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.courseTitle}
                  </span>
                  <div className="flex items-center gap-[6px] min-w-0">
                    <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                      {course.courseId}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => copyCourseId(e, course.fullCourseId)}
                      className="text-sd-grey-11 hover:text-sd-blue transition-colors cursor-pointer shrink-0 p-1 rounded-md hover:bg-sd-grey-3/50"
                      aria-label="Copy course ID"
                    >
                      <Copy size={16} variant="Linear" color="currentColor" />
                    </button>
                  </div>
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.category}
                  </span>
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.difficultyLevel}
                  </span>
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.reviewer}
                  </span>
                  <span className="text-[14px] font-normal leading-[20px] text-sd-grey-11 truncate">
                    {course.dateApproved}
                  </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table Footer: Entries & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] w-full px-[4px] mt-[4px]">
          {/* Entries Indicator Pill */}
          <div className="flex h-[36px] items-center justify-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] shadow-[0px_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
              Showing {mockInReviewCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, mockInReviewCourses.length)} of {mockInReviewCourses.length} entries
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={cn(
                "text-[14px] font-medium leading-[20px] px-[8px] py-[6px] transition-colors cursor-pointer border-0 bg-transparent",
                currentPage === 1 ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-11 hover:text-sd-grey-12"
              )}
            >
              Previous
            </button>
            <div className="flex items-center gap-[4px]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const active = p === currentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "flex size-[32px] items-center justify-center rounded-[8px] text-[14px] font-semibold leading-[20px] transition-colors cursor-pointer border-0",
                      active
                        ? "bg-sd-blue text-white"
                        : "bg-transparent hover:bg-sd-grey-2 text-sd-grey-11 hover:text-sd-grey-12"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className={cn(
                "text-[14px] font-medium leading-[20px] px-[8px] py-[6px] transition-colors cursor-pointer border-0 bg-transparent",
                currentPage === totalPages ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-11 hover:text-sd-grey-12"
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <InReviewCourseInfoDrawer
        course={activeCourse}
        isOpen={activeCourseIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCourseIndex(null);
        }}
        onPrevious={() => {
          setActiveCourseIndex((current) => (current !== null ? Math.max(0, current - 1) : null));
        }}
        onNext={() => {
          setActiveCourseIndex((current) => (current !== null ? Math.min(mockInReviewCourses.length - 1, current + 1) : null));
        }}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < mockInReviewCourses.length - 1}
      />
    </div>
  );
};
