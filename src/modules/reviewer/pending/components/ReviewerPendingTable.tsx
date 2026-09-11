"use client";

import React from "react";
import { Copy } from "iconsax-react";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api/errors";
import { Checkbox } from "@/components/shared/Checkbox";
import { cn } from "@/lib/utils";
import type { PendingCourseRow } from "../types";

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
  courses: PendingCourseRow[];
  startIndex: number;
  isLoading?: boolean;
  onOpenCourse?: (index: number) => void;
}

export const ReviewerPendingTable = ({
  courses,
  startIndex,
  isLoading,
  onOpenCourse,
}: ReviewerPendingTableProps) => {
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  const allSelected =
    courses.length > 0 &&
    courses.every((_, index) => selected[startIndex + index]);

  const toggleAll = (checked: boolean) => {
    const next = { ...selected };
    courses.forEach((_, index) => {
      next[startIndex + index] = checked;
    });
    setSelected(next);
  };

  const copyCourseId = async (idToCopy: string) => {
    try {
      await navigator.clipboard.writeText(idToCopy);
      toast.success("Course ID copied");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not copy course ID");
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-[10px] border border-sd-grey-3 bg-sd-grey-1">
      <div className="min-w-[1180px]">
        {/* Table Header */}
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

        {/* Loading State */}
        {isLoading ? (
          <div className="divide-y divide-sd-grey-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className={cn(
                  "grid items-center px-[12px] py-[14px] animate-pulse",
                  "grid-cols-[24px_minmax(160px,1.1fr)_minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(180px,1.1fr)]",
                )}
              >
                <div className="size-[16px] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[80%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[85%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[70%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[75%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[60%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[65%] rounded bg-sd-grey-3" />
                <div className="mx-[8px] h-[16px] w-[75%] rounded bg-sd-grey-3" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-[64px] text-center">
            <p className="text-[16px] font-medium text-sd-grey-12">
              No pending courses found
            </p>
            <p className="mt-[6px] text-[14px] text-sd-muted-text">
              There are no courses matching the selected filters or waiting in this tab.
            </p>
          </div>
        ) : (
          /* Table Rows */
          <div className="divide-y divide-sd-grey-3">
            {courses.map((row, index) => {
              const globalIndex = startIndex + index;
              return (
                <div
                  key={`${row.id}-${globalIndex}`}
                  className={cn(
                    "grid items-center px-[12px] py-[12px] text-[14px] font-normal text-sd-grey-11 transition-colors",
                    "grid-cols-[24px_minmax(160px,1.1fr)_minmax(220px,1.4fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(140px,0.9fr)_minmax(160px,1fr)_minmax(180px,1.1fr)]",
                    onOpenCourse ? "cursor-pointer hover:bg-sd-grey-2" : "",
                  )}
                  role={onOpenCourse ? "button" : undefined}
                  tabIndex={onOpenCourse ? 0 : undefined}
                  onClick={() => onOpenCourse?.(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpenCourse?.(index);
                    }
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={Boolean(selected[globalIndex])}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={(value) =>
                        setSelected((current) => ({
                          ...current,
                          [globalIndex]: Boolean(value),
                        }))
                      }
                      aria-label={`Select row ${globalIndex + 1}`}
                    />
                  </div>

                  <div className="truncate px-[8px] text-sd-grey-11">{row.creator}</div>
                  <div className="truncate px-[8px] font-medium text-sd-grey-12">
                    {row.courseTitle}
                  </div>

                  <div className="flex items-center gap-[10px] px-[8px] text-sd-grey-11">
                    <span className="truncate">{row.courseId}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copyCourseId(row.id || row.courseId);
                      }}
                      className="shrink-0 text-sd-grey-11 transition-colors hover:text-sd-grey-12 cursor-pointer"
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
        )}
      </div>
    </div>
  );
};
