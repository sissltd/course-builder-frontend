import { CourseStatus } from "../types";

export interface StatusDisplay {
  label: string;
  bg: string;
  text: string;
}

const STATUS_DISPLAY_MAP: Record<CourseStatus, StatusDisplay> = {
  [CourseStatus.DRAFT]: {
    label: "Draft",
    bg: "bg-[#F5F5F5]",
    text: "text-[#606060]",
  },
  [CourseStatus.SUBMITTED]: {
    label: "Submitted",
    bg: "bg-[#EBF3FF]",
    text: "text-[#0063EF]",
  },
  [CourseStatus.IN_REVIEW]: {
    label: "In Review",
    bg: "bg-[#EBF3FF]",
    text: "text-[#0063EF]",
  },
  [CourseStatus.NEEDS_REVISION]: {
    label: "Needs Revision",
    bg: "bg-[#FFF5ED]",
    text: "text-[#F2994A]",
  },
  [CourseStatus.QA_VERIFICATION]: {
    label: "QA Verification",
    bg: "bg-[#EBF3FF]",
    text: "text-[#0063EF]",
  },
  [CourseStatus.APPROVED]: {
    label: "Approved",
    bg: "bg-[#EBF7EE]",
    text: "text-[#27AE60]",
  },
  [CourseStatus.PUBLISHED]: {
    label: "Published",
    bg: "bg-[#EBF7EE]",
    text: "text-[#27AE60]",
  },
  [CourseStatus.ARCHIVED]: {
    label: "Archived",
    bg: "bg-[#F5F5F5]",
    text: "text-[#606060]",
  },
  [CourseStatus.REJECTED]: {
    label: "Rejected",
    bg: "bg-[#FFF0ED]",
    text: "text-[#FF5025]",
  },
};

export function getCourseStatusDisplay(status: CourseStatus): StatusDisplay {
  return STATUS_DISPLAY_MAP[status] ?? STATUS_DISPLAY_MAP[CourseStatus.DRAFT];
}

export function formatCourseId(id: string): string {
  const short = id.slice(0, 8);
  const tail = id.slice(-3);
  return `${short}...${tail}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
