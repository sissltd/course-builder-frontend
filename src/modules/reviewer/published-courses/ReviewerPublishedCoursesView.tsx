"use client";

import React from "react";
import Image from "next/image";
import { Copy, Timer1, ArrowRight2 } from "iconsax-react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { ReviewerPendingFilters } from "@/modules/reviewer/pending/components/ReviewerPendingFilters";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { cn } from "@/lib/utils";

interface PublishedCourse {
  courseTitle: string;
  creator: string;
  courseId: string;
  category: string;
  price: string;
  channel: string;
  approvedBy: string;
}

const publishedCourses: PublishedCourse[] = Array.from({ length: 15 }, () => ({
  courseTitle: "Machine Learning and Design",
  creator: "Osaite Emmanuel",
  courseId: "SLD-e4...3d5",
  category: "Software Engineering",
  price: "$120.00",
  channel: "Soludesk, Udemy & Coursera",
  approvedBy: "Osaite Emmanuel",
}));

const columns = [
  "Course Title",
  "Creator",
  "Course ID",
  "Category",
  "Price",
  "Channel",
  "Approved by",
];

const pages = [1, 2, 3, 4, 5];

const tableGridClassName =
  "grid grid-cols-[minmax(200px,1.4fr)_minmax(140px,1fr)_minmax(160px,1.1fr)_minmax(160px,1.1fr)_minmax(80px,0.6fr)_minmax(240px,1.5fr)_minmax(140px,1fr)]";

export const ReviewerPublishedCoursesView = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(publishedCourses.length / itemsPerPage) || 1;
  const paginatedCourses = publishedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [activeCourseIndex, setActiveCourseIndex] = React.useState<number | null>(null);
  
  const activeCourse = activeCourseIndex !== null ? publishedCourses[activeCourseIndex] : null;

  const copyCourseId = async (courseId: string) => {
    try {
      await navigator.clipboard.writeText(courseId);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Filters and Table */}
      <div className="flex w-full flex-col gap-[16px]">
        <ReviewerPendingFilters
          secondaryLabel="Approved by"
          secondaryOptions={["Osaite Emmanuel", "Ada Johnson", "Micheal Chen"]}
        />

        <div className="flex flex-col gap-[24px]">
          <div className="w-full overflow-x-auto">
            <div className="w-full min-w-[1100px]">
              {/* Table Header */}
              <div className={cn(tableGridClassName, "items-center")}>
                {columns.map((column, index) => (
                  <div
                    key={column}
                    className={cn(
                      "flex h-[40px] items-center border-b border-sd-grey-3 bg-[#F0F0F0CC] p-[10px]",
                      index === 0 && "rounded-l-[4px]",
                      index === columns.length - 1 && "rounded-r-[4px]",
                    )}
                  >
                    <span className="truncate text-[14px] font-normal leading-[20px] text-sd-grey-12">
                      {column}
                    </span>
                  </div>
                ))}
              </div>

              {/* Table Body */}
              <div>
                {paginatedCourses.map((course, index) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + index;
                  return (
                    <div
                      key={`${course.courseId}-${globalIdx}`}
                      onClick={() => setActiveCourseIndex(globalIdx)}
                      role="button"
                      tabIndex={0}
                      className={cn(
                        tableGridClassName,
                        "cursor-pointer items-center transition-colors hover:bg-sd-grey-2",
                      )}
                    >
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.courseTitle}</span>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.creator}</span>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          <span className="truncate">{course.courseId}</span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void copyCourseId(course.courseId);
                            }}
                            className="flex size-[14px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12"
                            aria-label={`Copy ${course.courseId}`}
                          >
                            <Copy size={14} variant="Linear" color="currentColor" />
                          </button>
                        </div>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.category}</span>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.price}</span>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.channel}</span>
                      </div>
                      <div className="flex min-h-[44px] items-center border-b border-sd-grey-3 p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
                        <span className="truncate">{course.approvedBy}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-[12px]">
            <div className="flex h-[36px] items-center justify-center rounded-[20px] border border-sd-grey-3 px-[16px] text-[12px] font-medium leading-[16px] text-[#4B5563]">
              Showing {publishedCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, publishedCourses.length)} of {publishedCourses.length} entries
            </div>

            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={cn(
                  "flex h-[32px] items-center justify-center px-[8px] text-[12px] font-medium leading-[16px] transition-colors cursor-pointer border-0 bg-transparent",
                  currentPage === 1 ? "text-sd-grey-11/40 cursor-not-allowed" : "text-[#4B5563] hover:text-sd-grey-12"
                )}
              >
                Previous
              </button>
              <div className="flex items-center gap-[4px]">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const active = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "flex size-[32px] items-center justify-center rounded-[4px] border transition-colors cursor-pointer",
                        active
                          ? "border-sd-blue bg-sd-blue text-[12px] font-semibold leading-[16px] text-white"
                          : "border-[#E5E7EB] bg-white text-[12px] font-medium leading-[16px] text-[#4B5563] hover:bg-sd-grey-2",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={cn(
                  "flex h-[32px] items-center justify-center px-[8px] text-[12px] font-medium leading-[16px] transition-colors cursor-pointer border-0 bg-transparent",
                  currentPage === totalPages ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-12 hover:text-sd-grey-2"
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <PublishedCourseInfoDrawer
        course={activeCourse}
        isOpen={activeCourseIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCourseIndex(null);
        }}
        onPrevious={() => setActiveCourseIndex((c) => (c === null ? null : Math.max(0, c - 1)))}
        onNext={() => setActiveCourseIndex((c) => (c === null ? null : Math.min(publishedCourses.length - 1, c + 1)))}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < publishedCourses.length - 1}
      />
    </div>
  );
};

const DrawerDetailRow = ({
  label,
  value,
  canCopy,
  onCopy,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  onCopy?: () => void;
}) => (
  <div className="flex items-center justify-between gap-[16px]">
    <span className="text-[14px] font-normal leading-[20px] text-sd-reviewer-muted">
      {label}
    </span>
    <div className="flex min-w-0 items-center gap-[8px]">
      <span className="truncate text-[14px] font-medium leading-[20px] text-sd-grey-12">
        {value}
      </span>
      {canCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex size-[20px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12"
          aria-label={`Copy ${label}`}
        >
          <Copy size={16} variant="Linear" color="currentColor" />
        </button>
      )}
    </div>
  </div>
);

const PublishedCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  course: PublishedCourse | null;
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

  const fullCourseId = "Td4fJcvnJ88-04924945"; // Match the mockup's long ID

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      showCloseButton={false}
      className="!w-full !max-w-full shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] md:!w-[420px] md:!max-w-[420px]"
      headerClassName="border-b border-sd-grey-6 px-[20px]"
      contentClassName="px-[24px] pb-[40px] pt-[24px]"
      title={
        <div className="flex w-full items-center justify-between gap-[16px]">
          <span className="truncate text-[20px] font-semibold leading-[28px] text-sd-grey-12">
            Course Information
          </span>

          <div className="flex items-center gap-[12px]">
            <div className="flex h-[32px] items-center rounded-[8px] border border-sd-grey-3 bg-white">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canPrevious}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11 transition-colors hover:bg-sd-grey-2",
                  !canPrevious && "cursor-not-allowed opacity-40 hover:bg-transparent",
                )}
                aria-label="Previous course"
              >
                <ArrowRight2 size={16} className="rotate-180" variant="Linear" color="currentColor" />
              </button>
              <div className="h-[16px] w-px bg-sd-grey-3" />
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11 transition-colors hover:bg-sd-grey-2",
                  !canNext && "cursor-not-allowed opacity-40 hover:bg-transparent",
                )}
                aria-label="Next course"
              >
                <ArrowRight2 size={16} variant="Linear" color="currentColor" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white text-sd-grey-11 transition-colors hover:bg-sd-grey-2"
              aria-label="Close course information"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex min-h-full flex-col gap-[32px]">
        {/* COURSE INFORMATION */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            COURSE INFORMATION
          </h2>
          <DrawerDetailRow label="Course Title" value={course.courseTitle} />
          <DrawerDetailRow label="Category" value={course.category} />
          <DrawerDetailRow label="Difficulty Level" value="Advanced" />
          <DrawerDetailRow
            label="Course ID"
            value={fullCourseId}
            canCopy
            onCopy={() => void copyText(fullCourseId)}
          />
          <DrawerDetailRow label="Source" value="AI Created" />
        </section>

        {/* OWNER'S INFORMATION */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            OWNER'S INFORMATION
          </h2>
          <DrawerDetailRow label="Creator" value={course.creator} />
          <DrawerDetailRow
            label="User ID"
            value={fullCourseId}
            canCopy
            onCopy={() => void copyText(fullCourseId)}
          />
          <DrawerDetailRow label="Date Created" value="17 May 2026, 08:45PM" />
        </section>

        <div className="flex flex-col gap-[4px]">
          <div className="h-px w-full bg-[#F0F0F0]" />
          <div className="h-px w-full bg-[#F0F0F0]" />
        </div>

        {/* PRICE INFORMATION */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            PRICE INFORMATION
          </h2>
          
          <div className="flex flex-col gap-[12px]">
            {/* SoluDesk Card */}
            <div className="flex items-center gap-[16px] rounded-[12px] border border-sd-grey-3 p-[16px]">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white">
                <Image src="/assets/badges/book.svg" alt="SoluDesk" width={24} height={24} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">SoluDesk</span>
                <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12">$250.98</span>
              </div>
            </div>

            {/* Coursera Card */}
            <div className="flex items-center gap-[16px] rounded-[12px] border border-sd-grey-3 p-[16px]">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white">
                <Image src="/assets/badges/coursera.svg" alt="Coursera" width={24} height={24} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">Coursera Marketplace</span>
                <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12">$250.00</span>
              </div>
            </div>

            {/* Udemy Card */}
            <div className="flex items-center gap-[16px] rounded-[12px] border border-sd-grey-3 p-[16px]">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white">
                <Image src="/assets/badges/udemy.svg" alt="Udemy" width={24} height={24} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">Udemy Marketplace</span>
                <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12">$250.00</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SideDrawer>
  );
};
