"use client";

import React from "react";
import { Copy } from "iconsax-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/shared/Checkbox";
import { cn } from "@/lib/utils";
import { pendingCourses } from "../data";

const columns = [
  { key: "creator", label: "Creator", width: "minmax(160px, 1.1fr)" },
  { key: "courseTitle", label: "Course Title", width: "minmax(220px, 1.4fr)" },
  { key: "courseId", label: "Course ID", width: "minmax(140px, 0.9fr)" },
  { key: "category", label: "Category", width: "minmax(160px, 1fr)" },
  { key: "difficultyLevel", label: "Difficulty Level", width: "minmax(140px, 0.9fr)" },
  { key: "approvedBy", label: "Approved by", width: "minmax(160px, 1fr)" },
  { key: "dateApproved", label: "Date Approved", width: "minmax(180px, 1.1fr)" },
] as const;

interface ReviewerPendingTableProps {
  courses: typeof pendingCourses;
  startIndex: number;
  onOpenCourse?: (index: number) => void;
}

export const ReviewerPendingTable = ({ courses, startIndex, onOpenCourse }: ReviewerPendingTableProps) => {
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  const allSelected = courses.length > 0 && courses.every((_, index) => selected[startIndex + index]);

  const toggleAll = (checked: boolean) => {
    const next = { ...selected };
    courses.forEach((_, index) => {
      next[startIndex + index] = checked;
    });
    setSelected(next);
  };

  const copyCourseId = async (courseId: string) => {
    try {
      await navigator.clipboard.writeText(courseId);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1180px]">
        <div
          className={cn(
            "grid items-center border-b border-sd-grey-3 bg-sd-grey-2 px-[12px] py-[12px] text-[14px] font-normal text-sd-grey-12",
            "grid-cols-[24px_minmax(160px,1.1fr)_minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(180px,1.1fr)]",
          )}
        >
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(value) => toggleAll(Boolean(value))}
              aria-label="Select all rows"
            />
          </div>
          {columns.map((column) => (
            <div key={column.key} className="truncate px-[8px]">
              {column.label}
            </div>
          ))}
        </div>

        <div className="divide-y divide-sd-grey-3">
          {courses.map((row, index) => {
            const globalIndex = startIndex + index;
            return (
              <div
                key={`${row.courseId}-${globalIndex}`}
                className={cn(
                  "grid items-center px-[12px] py-[10px] text-[14px] font-normal text-sd-grey-11 transition-colors",
                  "grid-cols-[24px_minmax(160px,1.1fr)_minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(180px,1.1fr)]",
                  onOpenCourse ? "cursor-pointer hover:bg-sd-grey-2" : "",
                )}
                role={onOpenCourse ? "button" : undefined}
                tabIndex={onOpenCourse ? 0 : undefined}
                onClick={() => onOpenCourse?.(globalIndex)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenCourse?.(globalIndex);
                  }
                }}
              >
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={Boolean(selected[globalIndex])}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={(value) =>
                      setSelected((current) => ({ ...current, [globalIndex]: Boolean(value) }))
                    }
                    aria-label={`Select row ${globalIndex + 1}`}
                  />
                </div>

                <div className="truncate px-[8px] text-sd-grey-11">{row.creator}</div>
                <div className="truncate px-[8px] text-sd-grey-11">{row.courseTitle}</div>

                <div className="flex items-center gap-[10px] px-[8px] text-sd-grey-11">
                  <span className="truncate">{row.courseId}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void copyCourseId(row.courseId);
                    }}
                    className="shrink-0 text-sd-grey-11 transition-colors hover:text-sd-grey-12"
                    aria-label={`Copy ${row.courseId}`}
                  >
                    <Copy size={16} variant="Linear" color="currentColor" />
                  </button>
                </div>

                <div className="truncate px-[8px] text-sd-grey-11">{row.category}</div>
                <div className="truncate px-[8px] text-sd-grey-11">{row.difficultyLevel}</div>
                <div className="truncate px-[8px] text-sd-grey-11">{row.approvedBy}</div>
                <div className="truncate px-[8px] text-sd-grey-11">{row.dateApproved}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
