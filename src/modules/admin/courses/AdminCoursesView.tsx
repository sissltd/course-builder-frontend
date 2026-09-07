"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  More,
  UserAdd,
  CloseCircle,
  SearchNormal1,
  TickCircle,
} from "iconsax-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { AdminCoursesFilters, type AdminCoursesTab } from "./components/AdminCoursesFilters";
import { AdminCoursesGrid } from "./components/AdminCoursesGrid";
import type { CourseViewMode } from "./components/CourseViewToggle";
import { initialsFor, type CourseRow } from "./data/mockData";
import {
  useGetAdminCoursesQuery,
  useApproveAdminCourseMutation,
  useRejectAdminCourseMutation,
} from "@/redux/slices/adminApi";
import type { AdminCourseItem, AdminCoursesListParams } from "@/redux/slices/adminApi";
import { useDebouncedValue } from "@/modules/admin/mie-recommendation/hooks/useDebouncedValue";
import { CourseRejectModal } from "./components/CourseRejectModal";

const isPendingStatus = (status: string) => {
  const s = (status || "").toUpperCase();
  return s === "PENDING" || s === "SUBMITTED" || s === "IN_REVIEW";
};

const STATUS_PILL: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-sd-warning-bg text-sd-warning-text",
  },
  approved: {
    label: "Approved",
    className: "bg-sd-success-bg text-sd-success-text",
  },
  rejected: {
    label: "Rejected",
    className: "bg-sd-danger-soft text-sd-danger",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-sd-warning-bg text-sd-warning-text",
  },
  IN_REVIEW: {
    label: "In Review",
    className: "bg-blue-50 text-blue-600",
  },
  QA_VERIFICATION: {
    label: "QA Verification",
    className: "bg-purple-50 text-purple-600",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-sd-grey-3 text-sd-grey-11",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-sd-success-bg text-sd-success-text",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-600",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-sd-danger-soft text-sd-danger",
  },
};

const getStatusPillInfo = (status: string) => {
  const normalized = (status || "").toUpperCase();
  if (STATUS_PILL[status]) return STATUS_PILL[status];
  if (STATUS_PILL[normalized]) return STATUS_PILL[normalized];
  if (normalized.includes("REJECT")) return STATUS_PILL.REJECTED;
  if (normalized.includes("APPROV") || normalized.includes("PUBLISH")) return STATUS_PILL.APPROVED;
  if (normalized.includes("SUBMIT") || normalized.includes("PENDING")) return STATUS_PILL.SUBMITTED;
  return { label: status || "Unknown", className: "bg-sd-grey-3 text-sd-grey-11" };
};

const StatusPill = ({ status }: { status: string }) => {
  const pill = getStatusPillInfo(status);
  return (
    <span
      className={cn(
        "flex w-fit items-center rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[16px]",
        pill.className,
      )}
    >
      {pill.label}
    </span>
  );
};

/** Grid fits a 3-row board; the table keeps its original page size. */
const PAGE_SIZE: Record<CourseViewMode, number> = { table: 8, grid: 12 };

const tableGridClassName =
  "grid grid-cols-[40px_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(160px,1.3fr)_minmax(140px,1.2fr)_minmax(120px,0.9fr)_minmax(160px,1.3fr)_minmax(110px,0.8fr)_60px] gap-[16px] items-center px-[20px] py-[12px]";

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

const AdminCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  onApprove,
  onReject,
}: {
  course: CourseRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
  onApprove: (course: CourseRow) => void;
  onReject: (course: CourseRow) => void;
}) => {
  const router = useRouter();

  if (!course) return null;

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="rotate-180"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
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
        {/* Preview Button */}
        <button
          type="button"
          onClick={() =>
            router.push(`${AdminRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.id)}`)
          }
          className="flex h-[44px] w-fit items-center justify-center gap-[8px] rounded-[8px] border border-sd-blue bg-white px-[24px] py-[12px] text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span>Preview course</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
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
        </button>

        {/* Course Information */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-sd-grey-12 uppercase">
            Course Information
          </h2>
          <DrawerDetailRow label="Course Title" value={course.courseTitle} />
          <DrawerDetailRow label="Category" value={course.category} />
          <DrawerDetailRow label="Difficulty Level" value={course.difficultyLevel} />
          <DrawerDetailRow
            label="Course ID"
            value={course.id}
            canCopy
            onCopy={() => void copyText(course.id)}
          />
          <DrawerDetailRow label="Date Created" value={course.dateCreated || course.dateApproved} />
          <div className="flex items-center justify-between gap-[16px]">
            <span className="shrink-0 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Status
            </span>
            <StatusPill status={course.status} />
          </div>
        </section>

        {/* Decision */}
        {isPendingStatus(course.status) && (
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={() => onReject(course)}
              className="flex h-[44px] flex-1 items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-4 bg-white text-[14px] font-medium text-sd-grey-12 transition-colors hover:bg-sd-grey-2 cursor-pointer"
            >
              <CloseCircle size={18} variant="Linear" color="#D54800" />
              Reject course
            </button>
            <button
              type="button"
              onClick={() => onApprove(course)}
              className="flex h-[44px] flex-1 items-center justify-center gap-[8px] rounded-[8px] bg-sd-blue text-[14px] font-medium text-white transition-colors hover:bg-sd-blue-hover cursor-pointer"
            >
              <TickCircle size={18} variant="Linear" color="#FFFFFF" />
              Approve course
            </button>
          </div>
        )}
      </div>
    </SideDrawer>
  );
};

export const AdminCoursesView = () => {
  const [viewMode, setViewMode] = useState<CourseViewMode>("table");
  const [activeTab, setActiveTab] = useState<AdminCoursesTab>("creators");
  const [videoFilter, setVideoFilter] = useState<"with" | "without" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [difficulty, setDifficulty] = useState("Difficulty level");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Active course for drawer (tracked by course ID for robustness)
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // User assignment popover state
  const [assignOpen, setAssignOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const mockReviewers = [
    "Osaite Emmanuel",
    "James Nathaniel John",
    "Osaite Emmanuel",
    "Nathan James",
    "Matin Jones",
    "John Nathan",
  ];

  const filteredReviewers = mockReviewers.filter((name) =>
    name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const getAvatarBg = (name: string) => {
    if (name.startsWith("O")) return "bg-[#16A34A]"; // Green
    if (name.startsWith("J")) return "bg-[#2563EB]"; // Blue
    if (name.startsWith("N")) return "bg-[#9333EA]"; // Purple
    return "bg-[#2563EB]";
  };

  // Checkbox multi-selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGE_SIZE[viewMode];

  // Debounced search query
  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  // Build query parameters for API call
  const queryParams = useMemo(() => {
    const params: AdminCoursesListParams = {
      page: currentPage,
      size: itemsPerPage,
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (activeTab === "creators") {
      params.source_type = "CREATOR_UPLOADED";
    } else if (activeTab === "ai") {
      params.source_type = "AI_GENERATED";
    } else if (activeTab === "developer") {
      params.source_type = "DEVELOPER_API";
    }

    if (category && category !== "Category" && category !== "All") {
      params.category = category;
    }

    if (difficulty && difficulty !== "Difficulty level" && difficulty !== "All") {
      params.difficulty_level = difficulty.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    }

    if (fromDate) {
      params.date_from = format(fromDate, "yyyy-MM-dd");
    }

    if (toDate) {
      params.date_to = format(toDate, "yyyy-MM-dd");
    }

    return params;
  }, [currentPage, itemsPerPage, debouncedSearch, activeTab, category, difficulty, fromDate, toDate]);

  const { data, isLoading, isFetching, error, refetch } = useGetAdminCoursesQuery(queryParams);

  const paginator = data?.data?.paginator;
  const rawResults: AdminCourseItem[] = useMemo(() => data?.data?.results ?? [], [data]);

  const formatApiDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : format(d, "dd MMM yyyy, hh:mma");
    } catch {
      return dateStr;
    }
  };

  const formatShortCourseId = (id: string): string => {
    if (!id) return "";
    if (id.length <= 16) return id;
    return `SLD-${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  const formatCreatorName = (creator: AdminCourseItem["creator"]): string => {
    if (!creator) return "Creator";
    if (typeof creator === "string") return creator;
    if (creator.name) return creator.name;
    const full = `${creator.first_name ?? ""} ${creator.last_name ?? ""}`.trim();
    return full || creator.email || "Creator";
  };

  const formatDifficulty = (diff: string | null | undefined): string => {
    if (!diff) return "Beginner";
    const lower = diff.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // Convert raw API courses to CourseRow format
  const courses: CourseRow[] = useMemo(() => {
    return rawResults.map((item) => {
      const isAi = item.source === "AI" || item.source === "AI_GENERATED";
      return {
        id: item.id,
        creator: formatCreatorName(item.creator),
        courseTitle: item.title || "Untitled Course",
        courseId: formatShortCourseId(item.id),
        category: item.category?.name || "General",
        difficultyLevel: formatDifficulty(item.difficulty_level),
        dateApproved: formatApiDate(item.submitted_at || item.created_datetime),
        dateCreated: formatApiDate(item.created_datetime),
        hasVideo: Boolean(item.has_video ?? true),
        isAi,
        status: item.status,
        moduleCount: item.modules_count ?? 0,
        lessonCount: item.lessons_count ?? 0,
      };
    });
  }, [rawResults]);

  // Client-side video filter (if backend doesn't filter directly)
  const displayCourses = useMemo(() => {
    if (!videoFilter) return courses;
    return courses.filter((c) => (videoFilter === "with" ? c.hasVideo : !c.hasVideo));
  }, [courses, videoFilter]);

  const totalCount = paginator?.count ?? displayCourses.length;
  const totalPages = paginator?.total_pages ?? Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const activeCourseIndex = useMemo(() => {
    if (!activeCourseId) return null;
    const idx = displayCourses.findIndex((c) => c.id === activeCourseId);
    return idx >= 0 ? idx : null;
  }, [activeCourseId, displayCourses]);

  const activeCourse = activeCourseIndex !== null ? displayCourses[activeCourseIndex] : null;

  const allOnPageSelected =
    displayCourses.length > 0 && displayCourses.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    const pageIds = displayCourses.map((c) => c.id);
    const next = new Set(selectedIds);
    if (allOnPageSelected) {
      pageIds.forEach((id) => next.delete(id));
    } else {
      pageIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  const handleAssignUser = (userName: string) => {
    toast.success(`Assigned ${selectedIds.size} courses to ${userName}`);
    setSelectedIds(new Set());
    setAssignOpen(false);
  };

  const [approveCourseMutation] = useApproveAdminCourseMutation();

  const handleApprove = async (course: CourseRow) => {
    try {
      await approveCourseMutation({ id: course.id }).unwrap();
      toast.success(`Approved "${course.courseTitle}" successfully`);
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        `Failed to approve "${course.courseTitle}"`
      );
    }
  };

  const [rejectCourseMutation, { isLoading: isRejecting }] = useRejectAdminCourseMutation();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [courseToReject, setCourseToReject] = useState<CourseRow | null>(null);
  const [isBulkReject, setIsBulkReject] = useState(false);

  const handleReject = (course: CourseRow) => {
    setCourseToReject(course);
    setIsBulkReject(false);
    setRejectModalOpen(true);
  };

  const openCourse = (course: CourseRow) => {
    setActiveCourseId(course.id);
  };

  const handleApproveSelected = async () => {
    const ids = Array.from(selectedIds);
    let successCount = 0;
    for (const id of ids) {
      try {
        await approveCourseMutation({ id }).unwrap();
        successCount++;
      } catch {
        // continue
      }
    }
    if (successCount > 0) {
      toast.success(`Approved ${successCount} ${successCount === 1 ? "course" : "courses"} successfully`);
    } else {
      toast.error("Could not approve selected courses");
    }
    setSelectedIds(new Set());
  };

  const handleRejectSelected = () => {
    setCourseToReject(null);
    setIsBulkReject(true);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (summary: string) => {
    if (isBulkReject) {
      const ids = Array.from(selectedIds);
      let successCount = 0;
      for (const id of ids) {
        try {
          await rejectCourseMutation({
            id,
            feedback: { summary },
          }).unwrap();
          successCount++;
        } catch {
          // continue
        }
      }
      if (successCount > 0) {
        toast.success(`Rejected ${successCount} ${successCount === 1 ? "course" : "courses"} and returned to Draft`);
      } else {
        toast.error("Failed to reject selected courses");
      }
      setSelectedIds(new Set());
    } else if (courseToReject) {
      try {
        await rejectCourseMutation({
          id: courseToReject.id,
          feedback: { summary },
        }).unwrap();
        toast.success(`Rejected "${courseToReject.courseTitle}" and returned to Draft`);
        if (activeCourseId === courseToReject.id) {
          setActiveCourseId(null);
        }
      } catch (err: any) {
        toast.error(
          err?.data?.message ||
          err?.data?.errors?.[0]?.message ||
          `Failed to reject "${courseToReject.courseTitle}"`
        );
      }
    }
    setRejectModalOpen(false);
    setCourseToReject(null);
    setIsBulkReject(false);
  };

  return (
    <div className="flex w-full flex-col gap-[20px] relative pb-[80px]">
      {/* Search & filters row */}
      <AdminCoursesFilters
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedIds(new Set());
          setActiveCourseId(null);
          setCurrentPage(1);
        }}
        videoFilter={videoFilter}
        setVideoFilter={(filter) => {
          setVideoFilter(filter);
          setSelectedIds(new Set());
          setActiveCourseId(null);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        category={category}
        setCategory={(cat) => {
          setCategory(cat);
          setCurrentPage(1);
        }}
        difficulty={difficulty}
        setDifficulty={(diff) => {
          setDifficulty(diff);
          setCurrentPage(1);
        }}
        fromDate={fromDate}
        setFromDate={(d) => {
          setFromDate(d);
          setCurrentPage(1);
        }}
        toDate={toDate}
        setToDate={(d) => {
          setToDate(d);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          setCurrentPage(1);
          setActiveCourseId(null);
        }}
      />

      {/* Main Table Content Container */}
      <div className="flex flex-col gap-[20px] w-full">
        {selectedIds.size > 0 ? (
          <div className="text-[14px] font-semibold text-sd-grey-12 px-[4px]">
            {selectedIds.size} courses selected
          </div>
        ) : (
          <div className="h-[20px] px-[4px]" />
        )}

        {error ? (
          <div className="flex h-[200px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <p className="text-[14px] font-medium text-sd-danger">Failed to load courses from the server.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-[8px] bg-sd-blue px-[16px] py-[8px] text-[14px] font-medium text-white transition-colors hover:bg-sd-blue-hover cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : viewMode === "grid" ? (
          isLoading ? (
            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-[220px] flex-col justify-between rounded-[4px] border border-sd-grey-3 bg-sd-grey-2/50 p-[18px] animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-[14px] w-[90px] rounded bg-sd-grey-3" />
                    <div className="size-[20px] rounded bg-sd-grey-3" />
                  </div>
                  <div className="space-y-[8px]">
                    <div className="h-[18px] w-3/4 rounded bg-sd-grey-3" />
                    <div className="h-[14px] w-1/2 rounded bg-sd-grey-3" />
                  </div>
                  <div className="flex items-center justify-between border-t border-sd-grey-3 pt-[12px]">
                    <div className="h-[14px] w-[70px] rounded bg-sd-grey-3" />
                    <div className="h-[14px] w-[50px] rounded bg-sd-grey-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminCoursesGrid
              courses={displayCourses}
              legendSource={displayCourses}
              selectedIds={selectedIds}
              allOnPageSelected={allOnPageSelected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleSelectRow}
              onOpen={openCourse}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )
        ) : (
          <>
            {/* Mobile View: Dedicated clean cards when on mobile devices (< sm) */}
            <div className="flex flex-col gap-[12px] sm:hidden w-full">
              {/* Mobile Select All Header */}
              <div className="flex items-center justify-between rounded-[10px] border border-sd-grey-3 bg-[#F0F0F0CC] px-[14px] py-[10px]">
                <label
                  className="flex items-center gap-[8px] cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={
                      displayCourses.length > 0 &&
                      displayCourses.every((c) => selectedIds.has(c.id))
                    }
                    onChange={toggleSelectAll}
                    disabled={displayCourses.length === 0}
                    className="size-[16px] rounded-[4px] accent-sd-blue cursor-pointer"
                    aria-label="Select all courses"
                  />
                  <span className="text-[12px] font-semibold uppercase text-sd-grey-12 tracking-wide">
                    Select all ({displayCourses.length})
                  </span>
                </label>
                {selectedIds.size > 0 && (
                  <span className="text-[12px] font-medium text-sd-blue">
                    {selectedIds.size} selected
                  </span>
                )}
              </div>

              {/* Mobile Cards List */}
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px] animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[8px]">
                        <div className="size-[28px] rounded-full bg-sd-grey-3" />
                        <div className="h-[14px] w-[90px] rounded bg-sd-grey-3" />
                      </div>
                      <div className="h-[22px] w-[80px] rounded-full bg-sd-grey-3" />
                    </div>
                    <div className="h-[18px] w-[70%] rounded bg-sd-grey-3" />
                    <div className="flex gap-[8px]">
                      <div className="h-[16px] w-[60px] rounded bg-sd-grey-3" />
                      <div className="h-[16px] w-[80px] rounded bg-sd-grey-3" />
                    </div>
                  </div>
                ))
              ) : displayCourses.length === 0 ? (
                <div className="flex h-[120px] items-center justify-center rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-11 text-[14px]">
                  No courses found matching filters.
                </div>
              ) : (
                displayCourses.map((course) => {
                  const isChecked = selectedIds.has(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseId(course.id)}
                      className={cn(
                        "flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[14px] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] transition-all cursor-pointer hover:border-sd-grey-4",
                        isChecked && "border-sd-blue/60 bg-sd-blue/[0.02]"
                      )}
                    >
                      {/* Top Row: Checkbox + Creator + Status + Kebab */}
                      <div className="flex items-center justify-between gap-[8px]">
                        <div
                          className="flex items-center gap-[8px] min-w-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(course.id)}
                            className="size-[16px] rounded-[4px] accent-sd-blue cursor-pointer shrink-0"
                            aria-label={`Select ${course.courseTitle}`}
                          />
                          <div className="flex items-center gap-[6px] min-w-0">
                            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-sd-blue/10 text-[11px] font-semibold text-sd-blue">
                              {initialsFor(course.creator)}
                            </div>
                            <span className="text-[13px] font-medium text-sd-grey-12 truncate">
                              {course.creator}
                            </span>
                          </div>
                        </div>

                        <div
                          className="flex items-center gap-[6px] shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatusPill status={course.status} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="text-sd-grey-11 hover:text-sd-grey-12 p-1 rounded-md hover:bg-sd-grey-3/50 cursor-pointer"
                                aria-label="More options"
                              >
                                <More size={18} variant="Linear" color="currentColor" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-sd-grey-1 border border-sd-grey-3 rounded-[12px] p-[6px] w-[160px]"
                            >
                              {isPendingStatus(course.status) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(course)}
                                    className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                                  >
                                    <TickCircle size={16} variant="Linear" color="#008500" />
                                    Approve course
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReject(course)}
                                    className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                                  >
                                    <CloseCircle size={16} variant="Linear" color="#D54800" />
                                    Reject course
                                  </DropdownMenuItem>
                                  <div className="my-[4px] h-px bg-sd-grey-3" />
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => setActiveCourseId(course.id)}
                                className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                              >
                                View details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-[14px] font-semibold text-sd-grey-12 leading-[20px] line-clamp-2">
                        {course.courseTitle}
                      </h3>

                      {/* Metadata Chips: Course ID, Category, Difficulty */}
                      <div className="flex flex-wrap items-center gap-[6px] text-[12px]">
                        <div
                          className="flex items-center gap-[4px] rounded bg-sd-grey-2 px-[6px] py-[2px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-mono text-sd-grey-12">{course.courseId}</span>
                          <button
                            type="button"
                            onClick={() => void copyText(course.id)}
                            className="text-sd-grey-11 hover:text-sd-blue p-0.5 cursor-pointer"
                            aria-label="Copy course ID"
                          >
                            <Copy size={12} variant="Linear" color="currentColor" />
                          </button>
                        </div>

                        <span className="rounded bg-sd-blue/10 px-[7px] py-[2px] font-medium text-sd-blue">
                          {course.category}
                        </span>

                        <span className="rounded bg-sd-grey-2 px-[7px] py-[2px] text-sd-grey-11">
                          {course.difficultyLevel}
                        </span>

                        {course.hasVideo && (
                          <span className="rounded bg-emerald-50 px-[6px] py-[2px] text-emerald-600 font-medium text-[11px]">
                            Video
                          </span>
                        )}
                      </div>

                      {/* Footer Row: Date */}
                      <div className="flex items-center justify-between border-t border-sd-grey-3/50 pt-[8px] text-[11px] text-sd-grey-11">
                        <span>Submitted</span>
                        <span className="font-medium text-sd-grey-12">{course.dateApproved}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View (Hidden on mobile < sm) */}
            <div className="hidden sm:block w-full overflow-x-auto rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
              <div className="w-full min-w-[1240px]">
                {/* Table Header Row */}
                <div className={cn(tableGridClassName, "bg-[#F0F0F0CC] border-b border-sd-grey-3")}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={displayCourses.length > 0 && displayCourses.every((c) => selectedIds.has(c.id))}
                      onChange={toggleSelectAll}
                      disabled={displayCourses.length === 0}
                      className="size-[16px] rounded-[4px] accent-sd-blue cursor-pointer"
                      aria-label="Select all courses"
                    />
                  </div>
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
                    Date Approved
                  </span>
                  <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12">
                    Status
                  </span>
                  <span className="text-[12px] font-semibold uppercase leading-[16px] text-sd-grey-12 text-center">
                    Action
                  </span>
                </div>

                {/* Table Body Rows */}
                <div className="flex flex-col">
                  {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(tableGridClassName, "border-b border-sd-grey-3/70 animate-pulse")}
                      >
                        <div className="flex items-center justify-center">
                          <div className="size-[16px] rounded-[4px] bg-sd-grey-3" />
                        </div>
                        <div className="h-[14px] w-[100px] rounded bg-sd-grey-3" />
                        <div className="h-[14px] w-[160px] rounded bg-sd-grey-3" />
                        <div className="h-[14px] w-[90px] rounded bg-sd-grey-3" />
                        <div className="h-[14px] w-[110px] rounded bg-sd-grey-3" />
                        <div className="h-[14px] w-[80px] rounded bg-sd-grey-3" />
                        <div className="h-[14px] w-[110px] rounded bg-sd-grey-3" />
                        <div className="h-[22px] w-[80px] rounded-full bg-sd-grey-3" />
                        <div className="flex justify-center">
                          <div className="size-[20px] rounded bg-sd-grey-3" />
                        </div>
                      </div>
                    ))
                  ) : displayCourses.length === 0 ? (
                    <div className="flex h-[120px] items-center justify-center text-sd-grey-11 text-[14px]">
                      No courses found matching filters.
                    </div>
                  ) : (
                    displayCourses.map((course, idx) => {
                      const isChecked = selectedIds.has(course.id);
                      return (
                        <div
                          key={course.id}
                          onClick={() => setActiveCourseId(course.id)}
                          className={cn(
                            tableGridClassName,
                            "border-b border-sd-grey-3/70 transition-colors hover:bg-sd-grey-2/50 cursor-pointer",
                            isChecked && "bg-sd-blue/5",
                            idx === displayCourses.length - 1 && "border-b-0"
                          )}
                        >
                          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectRow(course.id)}
                              className="size-[16px] rounded-[4px] accent-sd-blue cursor-pointer"
                              aria-label={`Select ${course.courseTitle}`}
                            />
                          </div>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                void copyText(course.id);
                              }}
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
                            {course.dateApproved}
                          </span>
                          <StatusPill status={course.status} />
                          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className="text-sd-grey-11 hover:text-sd-grey-12 p-1 rounded-md hover:bg-sd-grey-3/50 cursor-pointer"
                                  aria-label="More options"
                                >
                                  <More size={20} variant="Linear" color="currentColor" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-sd-grey-1 border border-sd-grey-3 rounded-[12px] p-[6px] w-[160px]"
                              >
                                {isPendingStatus(course.status) && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApprove(course)}
                                      className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                                    >
                                      <TickCircle size={16} variant="Linear" color="#008500" />
                                      Approve course
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleReject(course)}
                                      className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                                    >
                                      <CloseCircle size={16} variant="Linear" color="#D54800" />
                                      Reject course
                                    </DropdownMenuItem>
                                    <div className="my-[4px] h-px bg-sd-grey-3" />
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={() => setActiveCourseId(course.id)}
                                  className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer gap-[8px]"
                                >
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer">
                                  Edit course
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[14px] font-normal text-red-500 hover:bg-red-50 p-[8px] rounded-[8px] cursor-pointer">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Table Footer: Entries & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[12px] sm:gap-[16px] w-full px-[4px] mt-[4px]">
          {/* Entries Indicator Pill */}
          <div className="flex h-[36px] items-center justify-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] shadow-[0px_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
              Showing {totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} submissions
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
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className={cn(
                "text-[14px] font-medium leading-[20px] px-[8px] py-[6px] transition-colors cursor-pointer border-0 bg-transparent",
                currentPage >= totalPages ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-11 hover:text-sd-grey-12"
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Menu Bar at bottom center */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-40 bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] p-[8px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] flex items-center gap-[12px] animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={handleRejectSelected}
            className="flex h-[40px] items-center gap-[8px] px-[16px] text-[16px] font-normal text-sd-grey-11 hover:text-sd-grey-12 transition-colors cursor-pointer bg-transparent border-0"
          >
            <CloseCircle size={20} variant="Linear" color="#EA580C" className="shrink-0" />
            <span>Reject course</span>
          </button>

          <button
            type="button"
            onClick={handleApproveSelected}
            className="flex h-[40px] items-center gap-[8px] px-[16px] text-[16px] font-normal text-sd-grey-11 hover:text-sd-grey-12 transition-colors cursor-pointer bg-transparent border-0"
          >
            <TickCircle size={20} variant="Linear" color="#008500" className="shrink-0" />
            <span>Approve course</span>
          </button>

          <Popover open={assignOpen} onOpenChange={setAssignOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-[40px] items-center gap-[8px] rounded-[12px] bg-[#EAECEF] hover:bg-[#DFE2E6] px-[20px] text-[16px] font-medium text-[#202020] transition-colors cursor-pointer border-0"
              >
                <UserAdd size={20} variant="Linear" color="#0063EF" className="shrink-0" />
                <span>Assign course</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              side="top"
              sideOffset={12}
              className="w-[280px] bg-sd-grey-1 border border-sd-grey-3 rounded-[16px] p-[12px] shadow-[0px_8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="flex flex-col gap-[8px]">
                {/* Search user */}
                <label className="flex h-[36px] items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px] mb-[4px]">
                  <SearchNormal1 size={16} variant="Linear" color="var(--sd-grey-11)" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search user"
                    className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
                  />
                </label>

                {/* Scrollable List */}
                <div className="flex flex-col max-h-[220px] overflow-y-auto gap-[4px] pr-[4px]">
                  {filteredReviewers.length === 0 ? (
                    <div className="text-[12px] text-sd-grey-11 text-center py-4">
                      No users found.
                    </div>
                  ) : (
                    filteredReviewers.map((name, idx) => (
                      <button
                        key={`${name}-${idx}`}
                        type="button"
                        onClick={() => handleAssignUser(name)}
                        className="flex items-center gap-[12px] rounded-[8px] p-[8px] text-left hover:bg-sd-grey-2 cursor-pointer w-full transition-colors"
                      >
                        <div
                          className={cn(
                            "flex size-[32px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white",
                            getAvatarBg(name)
                          )}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12 truncate">
                            {name}
                          </span>
                          <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
                            Reviewer (Verifier)
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Sidebar Course Information Drawer */}
      <AdminCourseInfoDrawer
        course={activeCourse}
        isOpen={activeCourseId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCourseId(null);
        }}
        onPrevious={() => {
          if (activeCourseIndex !== null && activeCourseIndex > 0) {
            setActiveCourseId(displayCourses[activeCourseIndex - 1].id);
          }
        }}
        onNext={() => {
          if (activeCourseIndex !== null && activeCourseIndex < displayCourses.length - 1) {
            setActiveCourseId(displayCourses[activeCourseIndex + 1].id);
          }
        }}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < displayCourses.length - 1}
        onApprove={(course) => {
          handleApprove(course);
          setActiveCourseId(null);
        }}
        onReject={(course) => {
          handleReject(course);
          setActiveCourseId(null);
        }}
      />

      {/* Rejection Feedback Modal Dialog */}
      <CourseRejectModal
        isOpen={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        courseTitle={courseToReject?.courseTitle}
        courseCount={isBulkReject ? selectedIds.size : undefined}
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};
