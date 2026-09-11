"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CloseCircle, Copy, More, Edit } from "iconsax-react";
import { XIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api/errors";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button } from "@/components/shared/Button";
import { ReviewerPendingFilters } from "@/modules/reviewer/pending/components/ReviewerPendingFilters";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import {
  useGetApprovedCoursesQuery,
  useGetCourseReviewPricesQuery,
  useSaveCoursePricesMutation,
  usePublishCourseMutation,
} from "@/redux/slices/adminApi";
import type {
  DistributionChannelPayload,
  CoursePriceReviewItem,
  AdminCourseItem,
} from "@/redux/slices/adminApi";
import { useGetStaffQuery } from "@/modules/admin/teams/api/staffApi";

interface ApprovedCourse {
  creator: string;
  courseTitle: string;
  courseId: string;
  fullCourseId: string;
  category: string;
  difficultyLevel: string;
  reviewer: string;
  reviewerId: string;
  dateReviewed: string;
  drawerDateReviewed: string;
  reviewNote: string;
  raw?: AdminCourseItem;
}

const columns = [
  "Creator",
  "Course Title",
  "Course ID",
  "Category",
  "Reviewer",
  "Date Reviewed",
  "Action",
];

const tableGridClassName =
  "grid grid-cols-[40px_minmax(150px,1fr)_minmax(230px,1.45fr)_minmax(138px,0.8fr)_minmax(170px,1.1fr)_minmax(155px,1fr)_minmax(205px,1.2fr)_73px]";
const selectionCheckboxClassName =
  "size-[16px] rounded-[4px] border-sd-grey-8 data-checked:border-sd-blue data-checked:bg-sd-blue data-checked:text-sd-grey-1";

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

const TableCheckbox = ({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) => (
  <Checkbox
    checked={checked}
    onCheckedChange={(value) => onCheckedChange(Boolean(value))}
    aria-label={label}
    className={selectionCheckboxClassName}
  />
);

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

function mapToApprovedCourse(item: AdminCourseItem): ApprovedCourse {
  let creatorName = "—";
  if (typeof item.creator === "object" && item.creator !== null) {
    creatorName =
      `${item.creator.first_name || ""} ${item.creator.last_name || ""}`.trim() ||
      item.creator.name ||
      item.creator.email ||
      "—";
  } else if (typeof item.creator === "string" && item.creator.trim()) {
    creatorName = item.creator;
  }

  let reviewerName = "—";
  let reviewerId = item.id;
  const anyItem = item as any;
  if (anyItem.reviewer && typeof anyItem.reviewer === "object") {
    const r = anyItem.reviewer;
    reviewerName = `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.name || r.email || "—";
    reviewerId = r.id || item.id;
  } else if (typeof anyItem.reviewer === "string" && anyItem.reviewer.trim()) {
    reviewerName = anyItem.reviewer;
    reviewerId = anyItem.reviewer_id || item.id;
  }

  const shortId =
    item.id.length > 14 ? `SLD-${item.id.slice(0, 6)}...` : item.id;

  const dateReviewedFormatted = formatDisplayDate(
    anyItem.date_reviewed || item.date_approved || item.updated_datetime
  );

  return {
    creator: creatorName,
    courseTitle: item.title || "Untitled Course",
    courseId: shortId,
    fullCourseId: item.id,
    category: item.category?.name || "General",
    difficultyLevel: item.difficulty_level
      ? item.difficulty_level.charAt(0).toUpperCase() + item.difficulty_level.slice(1).toLowerCase()
      : "Intermediate",
    reviewer: reviewerName,
    reviewerId,
    dateReviewed: dateReviewedFormatted,
    drawerDateReviewed: dateReviewedFormatted,
    reviewNote: anyItem.review_note || anyItem.reviewer_note || "Approved without notes",
    raw: item,
  };
}

function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export const ReviewerApprovedCoursesView = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Staff for Verifier dropdown
  const { data: staffData } = useGetStaffQuery();
  const staffList = staffData ?? [];

  const verifierList = useMemo(() => {
    return staffList.map((s) => ({
      id: s.id,
      name: `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.email,
    }));
  }, [staffList]);

  const verifierNames = useMemo(() => {
    return verifierList.map((v) => v.name);
  }, [verifierList]);

  // Query Approved Courses
  const { data: approvedData, isLoading, isFetching } = useGetApprovedCoursesQuery({
    search: debouncedSearch.trim() || undefined,
    category: category || undefined,
    reviewer: reviewer || undefined,
    date_from: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
    date_to: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    page: currentPage,
    size: itemsPerPage,
  });

  const rawCourses = approvedData?.data?.results ?? [];
  const paginator = approvedData?.data?.paginator;

  const courses: ApprovedCourse[] = useMemo(() => {
    return rawCourses.map(mapToApprovedCourse);
  }, [rawCourses]);

  const totalCount = paginator?.count ?? courses.length;
  const totalPages = paginator?.total_pages ?? Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const activeCourse =
    activeCourseIndex !== null && activeCourseIndex < courses.length
      ? courses[activeCourseIndex]
      : null;

  const allSelected =
    courses.length > 0 && courses.every((c) => selected[c.fullCourseId]);

  const toggleAll = (checked: boolean) => {
    const next = { ...selected };
    courses.forEach((c) => {
      next[c.fullCourseId] = checked;
    });
    setSelected(next);
  };

  const copyCourseId = async (courseId: string) => {
    try {
      await navigator.clipboard.writeText(courseId);
      toast.success("Course ID copied");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not copy course ID");
    }
  };

  const openCourse = (index: number) => {
    setActiveCourseIndex(index);
  };

  const closeCourse = () => {
    setActiveCourseIndex(null);
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

  const startEntry = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalCount);
  const visiblePages = getVisiblePages(currentPage, Math.max(1, totalPages));

  return (
    <>
      <div className="flex w-full flex-col gap-[16px]">
        <ReviewerPendingFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={(catId) => {
            setCategory(catId);
            setCurrentPage(1);
          }}
          secondaryLabel="Verifier"
          secondaryOptions={verifierNames}
          onSecondaryChange={(verifierName) => {
            if (!verifierName || verifierName === "All") {
              setReviewer("");
            } else {
              const matched = verifierList.find((v) => v.name === verifierName);
              setReviewer(matched ? matched.id : verifierName);
            }
            setCurrentPage(1);
          }}
          fromDate={fromDate}
          onFromDateChange={(d) => {
            setFromDate(d);
            setCurrentPage(1);
          }}
          toDate={toDate}
          onToDateChange={(d) => {
            setToDate(d);
            setCurrentPage(1);
          }}
        />

        <div className="flex flex-col gap-[24px]">
          <div className="w-full overflow-x-auto rounded-[10px] border border-sd-grey-3 bg-sd-grey-1">
            <div className="w-full min-w-[1163px]">
              {/* Table Header */}
              <div className={cn(tableGridClassName, "items-center border-b border-sd-grey-3 bg-[#F0F0F0CC]")}>
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-l-[4px]">
                  <TableCheckbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    label="Select all approved courses"
                  />
                </div>
                {columns.map((column, index) => (
                  <div
                    key={column}
                    className={cn(
                      "flex h-[40px] items-center p-[10px]",
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
              {isLoading || isFetching ? (
                <div className="divide-y divide-sd-grey-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className={cn(tableGridClassName, "items-center px-[12px] py-[14px] animate-pulse")}
                    >
                      <div className="size-[16px] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[80%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[85%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[70%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[75%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[70%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[75%] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[40%] rounded bg-sd-grey-3" />
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[64px] text-center">
                  <p className="text-[16px] font-medium text-sd-grey-12">
                    No approved courses found
                  </p>
                  <p className="mt-[6px] text-[14px] text-sd-muted-text">
                    There are no courses matching your selected filters.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-sd-grey-3">
                  {courses.map((course, index) => {
                    return (
                      <div
                        key={`${course.fullCourseId}-${index}`}
                        className={cn(
                          tableGridClassName,
                          "items-center transition-colors hover:bg-sd-grey-2 cursor-pointer",
                        )}
                        role="button"
                        tabIndex={0}
                        onClick={() => openCourse(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openCourse(index);
                          }
                        }}
                      >
                        <div className="flex h-[44px] w-[40px] items-center justify-center">
                          <div onClick={(event) => event.stopPropagation()}>
                            <TableCheckbox
                              checked={Boolean(selected[course.fullCourseId])}
                              onCheckedChange={(checked) =>
                                setSelected((current) => ({
                                  ...current,
                                  [course.fullCourseId]: checked,
                                }))
                              }
                              label={`Select approved course row ${course.courseTitle}`}
                            />
                          </div>
                        </div>
                        <TableCell>{course.creator}</TableCell>
                        <TableCell className="font-medium text-sd-grey-12">
                          {course.courseTitle}
                        </TableCell>
                        <TableCell>
                          <div className="flex min-w-0 items-center gap-[10px]">
                            <span className="truncate">{course.courseId}</span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                void copyCourseId(course.fullCourseId || course.courseId);
                              }}
                              className="flex size-[14px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12 cursor-pointer"
                              aria-label={`Copy ${course.courseId}`}
                            >
                              <Copy size={14} variant="Linear" color="currentColor" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.reviewer}</TableCell>
                        <TableCell allowWrap>{course.dateReviewed}</TableCell>
                        <div className="flex h-[44px] items-center justify-center p-[10px]">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openCourse(index);
                            }}
                            className="flex size-[24px] items-center justify-center text-sd-grey-12 cursor-pointer"
                            aria-label={`Open actions for ${course.courseTitle}`}
                          >
                            <More size={24} variant="Linear" color="currentColor" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex min-h-[40px] flex-col gap-[16px] md:flex-row md:items-center md:justify-between">
            <div className="flex h-[40px] w-fit items-center justify-center rounded-full border border-sd-grey-4 px-[20px] py-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
              Showing {startEntry} to {endEntry} of {totalCount} entries
            </div>

            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={cn(
                  "flex h-[32px] items-center justify-center px-[12px] py-[6px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
                  currentPage <= 1
                    ? "text-sd-grey-11/40 cursor-not-allowed"
                    : "text-sd-grey-11 hover:text-sd-grey-12",
                )}
              >
                Previous
              </button>
              <div className="flex items-center gap-[4px]">
                {visiblePages.map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex size-[32px] items-center justify-center text-[14px] text-sd-grey-11"
                      >
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const active = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "flex size-[32px] items-center justify-center rounded-[6px] border text-[14px] font-normal transition-colors cursor-pointer",
                        active
                          ? "border-sd-blue bg-sd-blue text-sd-grey-1"
                          : "border-sd-grey-6 bg-sd-grey-1 text-sd-grey-11 hover:bg-sd-grey-2",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={cn(
                  "flex h-[32px] items-center justify-center px-[12px] py-[6px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
                  currentPage >= totalPages
                    ? "text-sd-grey-11/40 cursor-not-allowed"
                    : "text-sd-grey-11 hover:text-sd-grey-12",
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApprovedCourseInfoDrawer
        course={activeCourse}
        isOpen={activeCourse !== null}
        onOpenChange={(open) => {
          if (!open) closeCourse();
        }}
        onPrevious={goToPreviousCourse}
        onNext={goToNextCourse}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < courses.length - 1}
      />
    </>
  );
};

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

const ApprovedCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  course: ApprovedCourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) => {
  const router = useRouter();
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [reviewPricesModalOpen, setReviewPricesModalOpen] = useState(false);
  const [reviewAndPublishModalOpen, setReviewAndPublishModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedPublishChannels, setSelectedPublishChannels] = useState<Record<string, boolean>>({});
  const [savedPrices, setSavedPrices] = useState<Record<string, string>>({
    SoluDesk: "149.00",
    Coursera: "160.00",
    Udemy: "190.00",
  });
  const [savedModels, setSavedModels] = useState<Record<string, string>>({
    SoluDesk: "ONE_TIME",
    Coursera: "ONE_TIME",
    Udemy: "ONE_TIME",
  });

  if (!course) return null;

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not copy");
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
      contentClassName="px-[20px] pb-[10px] pt-[24px]"
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
                  "flex size-[31px] items-center justify-center text-sd-grey-11 cursor-pointer",
                  !canPrevious && "cursor-not-allowed opacity-40",
                )}
                aria-label="Previous approved course"
              >
                <ArrowRight3Icon size={20} className="rotate-180" />
              </button>
              <div className="h-[16px] w-px bg-sd-grey-3" />
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11 cursor-pointer",
                  !canNext && "cursor-not-allowed opacity-40",
                )}
                aria-label="Next approved course"
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
      <div className="flex min-h-full flex-col justify-between gap-[40px]">
        <div className="flex flex-col gap-[32px]">
          <button
            type="button"
            onClick={() =>
              router.push(`${ReviewerRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.fullCourseId || course.courseId)}`)
            }
            className="flex h-[44px] w-fit items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[24px] py-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2 cursor-pointer"
          >
            <span>Preview course</span>
            <ArrowRight3Icon size={24} />
          </button>

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              REVIEW INFORMATION
            </h2>
            <DrawerDetailRow label="Reviewer" value={course.reviewer} />
            <DrawerDetailRow
              label="Reviewer ID"
              value={course.reviewerId}
              canCopy
              onCopy={() => void copyText(course.reviewerId)}
            />
            <DrawerDetailRow label="Date reviewed" value={course.drawerDateReviewed} />
          </section>

          <div className="h-px w-full bg-sd-grey-3" />

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              COURSE INFORMATION
            </h2>
            <DrawerDetailRow label="Course Title" value={course.courseTitle} />
            <DrawerDetailRow label="Category" value={course.category} />
            <DrawerDetailRow label="Difficulty Level" value={course.difficultyLevel} />
            <DrawerDetailRow
              label="Course ID"
              value={course.fullCourseId}
              canCopy
              onCopy={() => void copyText(course.fullCourseId)}
            />
          </section>

          <div className="h-px w-full bg-sd-grey-3" />

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              REVIEWER&apos;S NOTE
            </h2>
            <div className="min-h-[78px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 p-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              {course.reviewNote}
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => setPublishModalOpen(true)}
          className="flex h-[44px] w-full items-center justify-center gap-[8px] rounded-[8px] border border-sd-blue bg-sd-grey-1 px-[24px] py-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-blue transition-colors hover:bg-sd-blue-hover hover:text-white cursor-pointer"
        >
          <span>Review Prices</span>
          <ArrowRight3Icon size={24} />
        </button>
      </div>

      <PublishChannelModal
        isOpen={publishModalOpen}
        onOpenChange={setPublishModalOpen}
        onContinue={(channels) => {
          setSelectedPublishChannels(channels);
          setPublishModalOpen(false);
          setReviewPricesModalOpen(true);
        }}
      />
      <ReviewPricesModal
        isOpen={reviewPricesModalOpen}
        onOpenChange={setReviewPricesModalOpen}
        selectedChannels={selectedPublishChannels}
        courseId={course.fullCourseId || course.courseId}
        onContinue={(prices, models) => {
          setSavedPrices(prices);
          setSavedModels(models);
          setReviewPricesModalOpen(false);
          setReviewAndPublishModalOpen(true);
        }}
      />
      <ReviewAndPublishModal
        isOpen={reviewAndPublishModalOpen}
        onOpenChange={setReviewAndPublishModalOpen}
        selectedChannels={selectedPublishChannels}
        learnerPrices={savedPrices}
        channelModels={savedModels}
        courseId={course.fullCourseId || course.courseId}
        onEdit={() => {
          setReviewAndPublishModalOpen(false);
          setReviewPricesModalOpen(true);
        }}
        onPublish={() => {
          setReviewAndPublishModalOpen(false);
          setSuccessModalOpen(true);
        }}
      />
      <PublishSuccessModal
        isOpen={successModalOpen}
        onOpenChange={(open) => {
          setSuccessModalOpen(open);
          if (!open) {
            onOpenChange(false);
          }
        }}
      />
    </SideDrawer>
  );
};

const publishChannels = [
  {
    name: "SoluDesk",
    description: "Publish to soludesk learning hub",
  },
  {
    name: "Udemy",
    description: "Publish to Udemy store",
  },
  {
    name: "Coursera",
    description: "Publish to Coursera store",
  },
];

const PublishChannelModal = ({
  isOpen,
  onOpenChange,
  onContinue,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (channels: Record<string, boolean>) => void;
}) => {
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>({
    SoluDesk: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[8px] border-none bg-sd-grey-1 p-[16px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[600px]"
      >
        <div className="flex items-start justify-between gap-[20px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Publish channel
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-sd-grey-3 text-sd-grey-9 transition-colors hover:bg-sd-grey-2 cursor-pointer"
              aria-label="Close publish channel"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        <div className="mt-[48px] flex flex-col gap-[20px] pl-[16px]">
          {publishChannels.map((channel) => (
            <label key={channel.name} className="flex w-fit cursor-pointer items-start gap-[16px]">
              <Checkbox
                checked={Boolean(selectedChannels[channel.name])}
                onCheckedChange={(checked) =>
                  setSelectedChannels((current) => ({
                    ...current,
                    [channel.name]: Boolean(checked),
                  }))
                }
                className="mt-[4px] size-[16px] rounded-[4px] border-sd-grey-8 data-checked:border-sd-blue data-checked:bg-sd-blue data-checked:text-sd-grey-1"
                aria-label={`Select ${channel.name}`}
              />
              <span className="flex flex-col gap-[8px]">
                <span className="text-[20px] font-semibold leading-[24px] text-sd-grey-12">
                  {channel.name}
                </span>
                <span className="text-[16px] font-normal leading-[20px] text-sd-reviewer-muted">
                  {channel.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-[48px] flex items-center justify-end gap-[12px]">
          <Button
            type="button"
            variant="outline"
            size="app"
            onClick={() => onOpenChange(false)}
            className="w-[116px] font-normal cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="app-primary"
            size="app"
            onClick={() => onContinue(selectedChannels)}
            className="w-[116px] font-normal cursor-pointer"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PRICING_MODELS = [
  { label: "One-time", value: "ONE_TIME" },
  { label: "Subscription", value: "SUBSCRIPTION" },
  { label: "Promotional", value: "PROMOTIONAL" },
  { label: "B2B only", value: "B2B_ONLY" },
];

const ReviewPricesModal = ({
  isOpen,
  onOpenChange,
  selectedChannels,
  courseId,
  onContinue,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChannels: Record<string, boolean>;
  courseId?: string;
  onContinue: (prices: Record<string, string>, models: Record<string, string>) => void;
}) => {
  const activeChannelNames = useMemo(
    () =>
      Object.entries(selectedChannels)
        .filter(([_, isSelected]) => isSelected)
        .map(([name]) => name),
    [selectedChannels],
  );

  const [activeTab, setActiveTab] = useState<string>("SoluDesk");

  useEffect(() => {
    if (activeChannelNames.length > 0 && !activeChannelNames.includes(activeTab)) {
      setActiveTab(activeChannelNames[0]);
    }
  }, [activeChannelNames, activeTab]);

  const [learnerPrices, setLearnerPrices] = useState<Record<string, string>>({
    SoluDesk: "149.00",
    Coursera: "160.00",
    Udemy: "190.00",
  });

  const [channelModels, setChannelModels] = useState<Record<string, string>>({
    SoluDesk: "ONE_TIME",
    Coursera: "ONE_TIME",
    Udemy: "ONE_TIME",
  });

  const { data: serverPricesData, isLoading: isLoadingPrices } = useGetCourseReviewPricesQuery(courseId!, {
    skip: !isOpen || !courseId,
  });

  const [savePricesMutation, { isLoading: isSaving }] = useSaveCoursePricesMutation();

  const serverResults: CoursePriceReviewItem[] = useMemo(() => {
    if (!serverPricesData?.data?.results) return [];
    return Array.isArray(serverPricesData.data.results)
      ? (serverPricesData.data.results as any[]).flat()
      : [];
  }, [serverPricesData]);

  useEffect(() => {
    if (serverResults.length > 0) {
      const newPrices: Record<string, string> = { ...learnerPrices };
      const newModels: Record<string, string> = { ...channelModels };
      serverResults.forEach((item: CoursePriceReviewItem) => {
        const chKey = (item.channel || "").toUpperCase();
        const channelName = chKey.includes("SOLU")
          ? "SoluDesk"
          : chKey.includes("COUR")
          ? "Coursera"
          : "Udemy";
        if (item.learner_price) {
          newPrices[channelName] = item.learner_price;
        }
        if (item.model) {
          const m = item.model.toUpperCase().replace(/[\s-]/g, "_");
          if (m.includes("SUBSCRIPTION")) newModels[channelName] = "SUBSCRIPTION";
          else if (m.includes("PROMOTIONAL")) newModels[channelName] = "PROMOTIONAL";
          else if (m.includes("B2B")) newModels[channelName] = "B2B_ONLY";
          else newModels[channelName] = "ONE_TIME";
        }
      });
      setLearnerPrices(newPrices);
      setChannelModels(newModels);
    }
  }, [serverResults]);

  const currentServerItem = useMemo(() => {
    const chKey = activeTab.toUpperCase();
    return serverResults.find((r: CoursePriceReviewItem) =>
      r.channel?.toUpperCase().includes(chKey.includes("SOLU") ? "SOLU" : chKey.includes("COUR") ? "COUR" : "UDEM")
    );
  }, [serverResults, activeTab]);

  const getModelLabel = (modelVal?: string) => {
    const m = (modelVal || "").toUpperCase().replace(/[\s-]/g, "_");
    if (m.includes("SUBSCRIPTION")) return "Subscription";
    if (m.includes("PROMOTIONAL")) return "Promotional";
    if (m.includes("B2B")) return "B2B only";
    return "One-time purchase";
  };

  const handleSaveAndContinue = async () => {
    if (courseId) {
      try {
        const payloadChannels: DistributionChannelPayload[] = activeChannelNames.map((ch) => {
          const chKey = ch.toUpperCase();
          const channelUpper = chKey.includes("SOLU")
            ? "SOLUDESK"
            : chKey.includes("COUR")
            ? "COURSERA"
            : "UDEMY";
          const match = serverResults.find(
            (r) => r.channel?.toUpperCase() === channelUpper,
          );
          return {
            channel: channelUpper,
            learner_price: learnerPrices[ch] || "149.00",
            approval_rate:
              match?.approval_rate ||
              (ch === "SoluDesk" ? "Published within 60 seconds" : "Published within 10 - 15 minutes"),
            mie_suggestion: match?.mie_suggestion || (ch === "SoluDesk" ? "140.00" : "100.00"),
            model: channelModels[ch] || match?.model || "ONE_TIME",
            platform_revenue_per_enrollment:
              match?.platform_revenue_per_enrollment || learnerPrices[ch] || "149.00",
            mie_explanation:
              match?.mie_explanation ||
              `$${learnerPrices[ch] || "149"} is the MIE-suggested price based on competitor analysis.`,
            course_fee_percent: match?.course_fee_percent,
            promotional_pricing: match?.promotional_pricing,
            comparable_courses: match?.comparable_courses || [],
          };
        });
        await savePricesMutation({ id: courseId, body: { distribution_channels: payloadChannels } }).unwrap();
        toast.success("Pricing saved successfully");
      } catch (err) {
        const { message } = normalizeApiError(err as never);
        toast.error(message ?? "Could not save prices");
      }
    }
    onContinue(learnerPrices, channelModels);
  };

  const channelData = {
    SoluDesk: {
      channelTitle: "Channel A (SoluDesks LMS)",
      approvalRate: currentServerItem?.approval_rate
        ? `Approval Rate: ${currentServerItem.approval_rate}`
        : "Approval Rate: Published within 60 seconds",
      mieSuggestion: currentServerItem?.mie_suggestion
        ? `MIE Suggestion: ₦${currentServerItem.mie_suggestion}`
        : "MIE Suggestion: ₦140",
      showInfoBox: true,
      feesTitle: "COURSE FEES",
      fees: [
        { label: "Learner fee", value: `₦${currentServerItem?.learner_fee || learnerPrices.SoluDesk || "149.00"}` },
        { label: "Creator payout (Fixed)", value: `₦${currentServerItem?.creator_payout_fixed || "150.00"}` },
        { label: "Platform revenue per enrolment", value: `₦${currentServerItem?.platform_revenue_per_enrollment || learnerPrices.SoluDesk || "149.00"}` },
        { label: "Model", value: getModelLabel(channelModels.SoluDesk || currentServerItem?.model) },
      ],
      comparableTitle: "RELATED COURSES",
      relatedCourses: currentServerItem?.comparable_courses?.length
        ? currentServerItem.comparable_courses.map((c) => ({
            name: c.course_title,
            level: c.difficulty_level,
            price: `₦${c.learner_price}`,
          }))
        : [
            { name: "Modern computing language", level: "Beginner", price: "₦150" },
            { name: "Introduction to computing", level: "Advanced", price: "₦190" },
            { name: "Computer Essentials", level: "Intermediate", price: "₦160" },
          ],
    },
    Coursera: {
      channelTitle: "Channel C (Coursera Marketplace)",
      approvalRate: currentServerItem?.approval_rate
        ? `Approval Rate: ${currentServerItem.approval_rate}`
        : "Approval Rate: Published within 10 - 15 minuites",
      mieSuggestion: currentServerItem?.mie_suggestion
        ? `MIE Suggestion: ₦${currentServerItem.mie_suggestion}`
        : "MIE Suggestion: ₦100",
      showInfoBox: false,
      feesTitle: "COURSE FEES ON COURSERA",
      fees: [
        { label: "Course fee", value: currentServerItem?.course_fee_percent ? `${currentServerItem.course_fee_percent}% of net revenue` : "32% of net revenue" },
        { label: "Promotional pricing", value: `₦${currentServerItem?.promotional_pricing || "150.00"}` },
        { label: "Platform revenue per enrolment", value: `₦${currentServerItem?.platform_revenue_per_enrollment || learnerPrices.Coursera || "149.00"}` },
        { label: "Model", value: getModelLabel(channelModels.Coursera || currentServerItem?.model) },
      ],
      comparableTitle: "COMPARABLE COURSES ON COURSERA",
      relatedCourses: currentServerItem?.comparable_courses?.length
        ? currentServerItem.comparable_courses.map((c) => ({
            name: c.course_title,
            level: c.difficulty_level,
            price: `₦${c.learner_price}`,
          }))
        : [
            { name: "Modern computing language", level: "Beginner", price: "₦100" },
            { name: "Introduction to computing", level: "Advanced", price: "₦190" },
            { name: "Computer Essentials", level: "Intermediate", price: "₦160" },
          ],
    },
    Udemy: {
      channelTitle: "Channel B (Udemy Marketplace)",
      approvalRate: currentServerItem?.approval_rate
        ? `Approval Rate: ${currentServerItem.approval_rate}`
        : "Approval Rate: Published within 10 - 15 minuites",
      mieSuggestion: currentServerItem?.mie_suggestion
        ? `MIE Suggestion: ₦${currentServerItem.mie_suggestion}`
        : "MIE Suggestion: ₦100",
      showInfoBox: false,
      feesTitle: "COURSE FEES ON UDEMY",
      fees: [
        { label: "Course fee", value: currentServerItem?.course_fee_percent ? `${currentServerItem.course_fee_percent}% of net revenue` : "32% of net revenue" },
        { label: "Promotional pricing", value: `₦${currentServerItem?.promotional_pricing || "150.00"}` },
        { label: "Platform revenue per enrolment", value: `₦${currentServerItem?.platform_revenue_per_enrollment || learnerPrices.Udemy || "149.00"}` },
        { label: "Model", value: getModelLabel(channelModels.Udemy || currentServerItem?.model) },
      ],
      comparableTitle: "COMPARABLE COURSES ON UDEMY",
      relatedCourses: currentServerItem?.comparable_courses?.length
        ? currentServerItem.comparable_courses.map((c) => ({
            name: c.course_title,
            level: c.difficulty_level,
            price: `₦${c.learner_price}`,
          }))
        : [
            { name: "Modern computing language", level: "Beginner", price: "₦100" },
            { name: "Introduction to computing", level: "Advanced", price: "₦190" },
            { name: "Computer Essentials", level: "Intermediate", price: "₦160" },
          ],
    },
  };

  const currentData = channelData[activeTab as keyof typeof channelData] || channelData.SoluDesk;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-32px)] flex-col gap-0 rounded-[8px] border-none bg-sd-grey-1 p-0 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[600px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-[20px] p-[24px] pb-[16px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Review
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9D9D9] text-[#888888] transition-colors hover:bg-sd-grey-2 cursor-pointer"
              aria-label="Close review prices"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 items-center gap-[24px] border-b border-[#D9D9D9] px-[24px]">
          {activeChannelNames.length === 0 ? (
            <span className="pb-[12px] pt-[8px] text-[14px] font-medium leading-[20px] text-sd-reviewer-muted">
              No channels selected
            </span>
          ) : (
            activeChannelNames.map((name) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveTab(name)}
                  className={cn(
                    "border-b-[2px] pb-[12px] pt-[8px] text-[14px] font-medium leading-[20px] transition-colors cursor-pointer",
                    isActive
                      ? "border-sd-grey-12 text-sd-grey-12"
                      : "border-transparent text-sd-reviewer-muted hover:text-sd-grey-11",
                  )}
                >
                  {name}
                </button>
              );
            })
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">
          {isLoadingPrices ? (
            <div className="flex flex-col gap-[16px] py-[32px] animate-pulse">
              <div className="h-[20px] w-[200px] rounded bg-sd-grey-3" />
              <div className="h-[44px] w-full rounded bg-sd-grey-3" />
            </div>
          ) : (
            <>
              {/* Header context */}
              <div className="flex flex-col gap-[8px]">
                <span className="text-[14px] font-medium leading-[20px] text-sd-grey-12">
                  {currentData.channelTitle}
                </span>
                <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
                  {currentData.approvalRate}
                </span>
              </div>

              {/* Form */}
              <div className="mt-[24px] flex flex-col">
                <label className="mb-[8px] text-[14px] font-normal leading-[20px] text-sd-grey-12">
                  Learner price
                </label>
                <div className="relative">
                  <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] text-sd-grey-12">
                    ₦
                  </span>
                  <input
                    type="text"
                    value={learnerPrices[activeTab] ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setLearnerPrices((prev) => ({ ...prev, [activeTab]: val }));
                    }}
                    placeholder="0.00"
                    className="flex h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-white pl-[28px] pr-[12px] text-[14px] font-normal leading-[20px] text-sd-grey-12 outline-none focus:border-sd-blue"
                  />
                </div>
                <span className="mt-[8px] text-[12px] font-normal leading-[16px] text-[#888888]">
                  {currentData.mieSuggestion}
                </span>
              </div>

              {/* Pricing Model Pills */}
              <div className="mt-[24px] flex flex-wrap gap-[12px]">
                {PRICING_MODELS.map((model) => {
                  const currentModel = channelModels[activeTab] || "ONE_TIME";
                  const isActive = currentModel === model.value;
                  return (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() =>
                        setChannelModels((prev) => ({ ...prev, [activeTab]: model.value }))
                      }
                      className={cn(
                        "flex h-[36px] items-center justify-center rounded-[8px] px-[16px] text-[14px] font-normal leading-[20px] transition-colors cursor-pointer",
                        isActive
                          ? "bg-sd-blue text-white"
                          : "border border-[#D9D9D9] bg-white text-sd-grey-11 hover:bg-sd-grey-2",
                      )}
                    >
                      {model.label}
                    </button>
                  );
                })}
              </div>

              {/* Info Box */}
              {currentData.showInfoBox && (
                <div className="mt-[24px] flex items-start gap-[12px] rounded-[8px] bg-sd-blue-light p-[12px]">
                  <span className="text-[14px] font-normal leading-[20px] text-sd-blue">
                    This course is being reviewed by a human reviewer. Once approved, it will be published to the SoluDesk learning hub within 60 seconds.
                  </span>
                </div>
              )}

              {/* Course Fees Section */}
              <div className="mt-[32px] flex flex-col">
                <h3 className="mb-[16px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
                  {currentData.feesTitle}
                </h3>
                <div className="flex flex-col">
                  {currentData.fees.map((fee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-[#F0F0F0] py-[16px] last:border-b-0"
                    >
                      <span className="text-[14px] font-normal text-[#4B5563]">{fee.label}</span>
                      <span className="text-[14px] font-normal text-sd-grey-12">{fee.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparable / Related Courses */}
              <div className="mt-[32px] flex flex-col">
                <h3 className="mb-[16px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
                  {currentData.comparableTitle}
                </h3>
                <div className="flex flex-col">
                  {currentData.relatedCourses.map((courseItem, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-[#F0F0F0] py-[16px] last:border-b-0"
                    >
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[14px] font-normal text-sd-grey-12">{courseItem.name}</span>
                        <span className="text-[12px] font-normal text-[#888888]">{courseItem.level}</span>
                      </div>
                      <span className="text-[14px] font-normal text-sd-grey-12">{courseItem.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex shrink-0 items-center gap-[12px] border-t border-[#D9D9D9] p-[24px] pt-[16px]">
          <Button
            type="button"
            variant="outline"
            size="app"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="w-[116px] font-normal cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="app-primary"
            size="app"
            disabled={isSaving}
            onClick={handleSaveAndContinue}
            className="w-[132px] font-normal cursor-pointer"
          >
            {isSaving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReviewAndPublishModal = ({
  isOpen,
  onOpenChange,
  selectedChannels,
  learnerPrices,
  channelModels,
  courseId,
  onEdit,
  onPublish,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChannels: Record<string, boolean>;
  learnerPrices?: Record<string, string>;
  channelModels?: Record<string, string>;
  courseId?: string;
  onEdit: () => void;
  onPublish: () => void;
}) => {
  const activeChannelNames = useMemo(
    () =>
      Object.entries(selectedChannels)
        .filter(([_, isSelected]) => isSelected)
        .map(([name]) => name),
    [selectedChannels],
  );

  const [publishMutation, { isLoading: isPublishing }] = usePublishCourseMutation();

  const handlePublish = async () => {
    if (courseId) {
      try {
        const payloadChannels: DistributionChannelPayload[] = activeChannelNames.map((ch) => {
          const chKey = ch.toUpperCase();
          const channelUpper = chKey.includes("SOLU")
            ? "SOLUDESK"
            : chKey.includes("COUR")
            ? "COURSERA"
            : "UDEMY";
          return {
            channel: channelUpper,
            learner_price: learnerPrices?.[ch] || (ch === "SoluDesk" ? "149.00" : ch === "Udemy" ? "190.00" : "160.00"),
            model: channelModels?.[ch] || "ONE_TIME",
            approval_rate:
              ch === "SoluDesk"
                ? "Published within 60 seconds"
                : "Published within 10 - 15 minutes",
          };
        });
        await publishMutation({
          id: courseId,
          body: { distribution_channels: payloadChannels },
        }).unwrap();
        toast.success("Course published successfully!");
      } catch (err) {
        const { message } = normalizeApiError(err as never);
        toast.error(message ?? "Failed to publish course");
      }
    }
    onPublish();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[8px] border-none bg-sd-grey-1 p-[24px] pb-[24px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[480px]"
      >
        <div className="flex items-start justify-between gap-[20px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Review and publish
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              disabled={isPublishing}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9D9D9] text-[#888888] transition-colors hover:bg-sd-grey-2 cursor-pointer"
              aria-label="Close review and publish"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        <div className="mt-[32px] flex flex-col">
          <h3 className="mb-[16px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
            Overview
          </h3>
          <div className="flex flex-col">
            {activeChannelNames.length === 0 ? (
              <span className="text-[14px] text-sd-reviewer-muted">No channels selected</span>
            ) : (
              activeChannelNames.map((channel) => {
                const price = learnerPrices?.[channel]
                  ? `₦${learnerPrices[channel]}`
                  : channel === "SoluDesk"
                  ? "₦149.00"
                  : channel === "Udemy"
                  ? "₦190.00"
                  : "₦160.00";

                return (
                  <div
                    key={channel}
                    className="flex items-center justify-between border-b border-[#F0F0F0] py-[16px] last:border-b-0"
                  >
                    <span className="text-[14px] font-normal text-[#4B5563]">{channel}</span>
                    <div className="flex items-center gap-[40px]">
                      <span className="text-[14px] font-normal text-sd-grey-12">{price}</span>
                      <button
                        type="button"
                        onClick={onEdit}
                        disabled={isPublishing}
                        className="flex items-center gap-[8px] text-[14px] font-normal text-[#4B5563] hover:text-sd-blue cursor-pointer"
                      >
                        <span>Edit</span>
                        <Edit size={16} variant="Linear" color="var(--sd-blue)" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-[32px] flex items-center gap-[12px]">
          <Button
            type="button"
            variant="outline"
            size="app"
            disabled={isPublishing}
            onClick={() => onOpenChange(false)}
            className="w-[116px] font-normal cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="app-primary"
            size="app"
            disabled={isPublishing}
            onClick={handlePublish}
            className="w-[132px] font-normal cursor-pointer"
          >
            {isPublishing ? "Publishing..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PublishSuccessModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[12px] border-none bg-white p-[24px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[400px]"
      >
        <div className="flex flex-col">
          <div className="flex size-[64px] items-center justify-center rounded-full bg-[#EAFBF3] text-[#16A34A]">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="mt-[20px] text-[20px] font-bold leading-[28px] text-sd-grey-12">
            Published!
          </h2>
          <p className="mt-[12px] text-[14px] font-normal leading-[20px] text-[#4B5563]">
            You have successfully approved this course for distribution.
          </p>
          <Button
            type="button"
            variant="app-primary"
            size="app"
            onClick={() => onOpenChange(false)}
            className="mt-[24px] w-full font-normal cursor-pointer"
          >
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TableCell = ({
  children,
  className,
  allowWrap = false,
}: {
  children: React.ReactNode;
  className?: string;
  allowWrap?: boolean;
}) => (
  <div
    className={cn(
      "flex h-[44px] items-center p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11",
      className,
    )}
  >
    <span className={cn(!allowWrap && "truncate")}>{children}</span>
  </div>
);

export default ReviewerApprovedCoursesView;
