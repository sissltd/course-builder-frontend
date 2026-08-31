"use client";

import React, { useState } from "react";
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
import { AdminCoursesFilters } from "./components/AdminCoursesFilters";
import { AdminCoursesGrid } from "./components/AdminCoursesGrid";
import type { CourseViewMode } from "./components/CourseViewToggle";
import { mockCourses, type CourseRow, type CourseStatus } from "./data/mockData";

const STATUS_PILL: Record<CourseStatus, { label: string; className: string }> = {
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
};

const StatusPill = ({ status }: { status: CourseStatus }) => {
  const pill = STATUS_PILL[status];
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
            router.push(`${AdminRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.courseId)}`)
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
            value="Td4fJcvnJ88-04924945"
            canCopy
            onCopy={() => void copyText("Td4fJcvnJ88-04924945")}
          />
          <DrawerDetailRow label="Date Created" value="21 May 2026, 08:43PM" />
          <div className="flex items-center justify-between gap-[16px]">
            <span className="shrink-0 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Status
            </span>
            <StatusPill status={course.status} />
          </div>
        </section>

        {/* Decision */}
        {course.status === "pending" && (
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
  const [courses, setCourses] = useState<CourseRow[]>(mockCourses);
  const [viewMode, setViewMode] = useState<CourseViewMode>("table");
  const [activeTab, setActiveTab] = useState<"creators" | "ai">("creators");
  const [videoFilter, setVideoFilter] = useState<"with" | "without" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [difficulty, setDifficulty] = useState("Difficulty level");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Sidebar info drawer state
  const [activeCourseIndex, setActiveCourseIndex] = useState<number | null>(null);

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

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    // Tab filter
    if (activeTab === "creators" && course.isAi) return false;
    if (activeTab === "ai" && !course.isAi) return false;

    // Video filter
    if (videoFilter === "with" && !course.hasVideo) return false;
    if (videoFilter === "without" && course.hasVideo) return false;

    // Category filter
    if (category !== "Category" && category !== "All" && course.category !== category) return false;

    // Difficulty filter
    if (difficulty !== "Difficulty level" && difficulty !== "All" && course.difficultyLevel !== difficulty) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.courseTitle.toLowerCase().includes(q);
      const matchId = course.courseId.toLowerCase().includes(q);
      const matchCreator = course.creator.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchCreator) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCourse = activeCourseIndex !== null ? filteredCourses[activeCourseIndex] : null;

  const allOnPageSelected =
    paginatedCourses.length > 0 && paginatedCourses.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    const pageIds = paginatedCourses.map((c) => c.id);

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

  /** Table, grid and drawer all funnel their decisions through here. */
  const applyStatus = (ids: string[], status: CourseStatus) => {
    const target = new Set(ids);
    setCourses((current) =>
      current.map((course) => (target.has(course.id) ? { ...course, status } : course)),
    );
  };

  const handleApprove = (course: CourseRow) => {
    applyStatus([course.id], "approved");
    toast.success(`Approved "${course.courseTitle}"`);
  };

  const handleReject = (course: CourseRow) => {
    applyStatus([course.id], "rejected");
    toast.success(`Rejected "${course.courseTitle}"`);
  };

  const openCourse = (course: CourseRow) => {
    setActiveCourseIndex(filteredCourses.findIndex((entry) => entry.id === course.id));
  };

  const handleApproveSelected = () => {
    const count = selectedIds.size;
    applyStatus([...selectedIds], "approved");
    toast.success(`Approved ${count} ${count === 1 ? "course" : "courses"} successfully`);
    setSelectedIds(new Set());
  };

  const handleRejectSelected = () => {
    const count = selectedIds.size;
    applyStatus([...selectedIds], "rejected");
    toast.success(`Rejected ${count} ${count === 1 ? "course" : "courses"} successfully`);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex w-full flex-col gap-[20px] relative pb-[80px]">
      {/* Search & filters row */}
      <AdminCoursesFilters
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedIds(new Set());
          setActiveCourseIndex(null);
          setCurrentPage(1);
        }}
        videoFilter={videoFilter}
        setVideoFilter={(filter) => {
          setVideoFilter(filter);
          setSelectedIds(new Set());
          setActiveCourseIndex(null);
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
          // Page size differs between the two views, so the current page index
          // would otherwise point at a different slice of the list.
          setCurrentPage(1);
          setActiveCourseIndex(null);
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
        
        {viewMode === "grid" ? (
          <AdminCoursesGrid
            courses={paginatedCourses}
            legendSource={filteredCourses}
            selectedIds={selectedIds}
            allOnPageSelected={allOnPageSelected}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelect={toggleSelectRow}
            onOpen={openCourse}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
        <div className="w-full overflow-x-auto rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
          <div className="w-full min-w-[1240px]">
            {/* Table Header Row */}
            <div className={cn(tableGridClassName, "bg-[#F0F0F0CC] border-b border-sd-grey-3")}>
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={paginatedCourses.length > 0 && paginatedCourses.every((c) => selectedIds.has(c.id))}
                  onChange={toggleSelectAll}
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
              {paginatedCourses.length === 0 ? (
                <div className="flex h-[120px] items-center justify-center text-sd-grey-11 text-[14px]">
                  No courses found matching filters.
                </div>
              ) : (
                paginatedCourses.map((course, idx) => {
                  const isChecked = selectedIds.has(course.id);
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseIndex(globalIdx)}
                      className={cn(
                        tableGridClassName,
                        "border-b border-sd-grey-3/70 transition-colors hover:bg-sd-grey-2/50 cursor-pointer",
                        isChecked && "bg-sd-blue/5",
                        idx === paginatedCourses.length - 1 && "border-b-0"
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
                            {course.status === "pending" && (
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
                              onClick={() => setActiveCourseIndex(globalIdx)}
                              className="text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 p-[8px] rounded-[8px] cursor-pointer"
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
        )}

        {/* Table Footer: Entries & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] w-full px-[4px] mt-[4px]">
          {/* Entries Indicator Pill */}
          <div className="flex h-[36px] items-center justify-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] shadow-[0px_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
              Showing {filteredCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} submissions
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
        isOpen={activeCourseIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCourseIndex(null);
        }}
        onPrevious={() => {
          setActiveCourseIndex((current) => (current !== null ? Math.max(0, current - 1) : null));
        }}
        onNext={() => {
          setActiveCourseIndex((current) => (current !== null ? Math.min(filteredCourses.length - 1, current + 1) : null));
        }}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < filteredCourses.length - 1}
        onApprove={(course) => {
          handleApprove(course);
          setActiveCourseIndex(null);
        }}
        onReject={(course) => {
          handleReject(course);
          setActiveCourseIndex(null);
        }}
      />
    </div>
  );
};
