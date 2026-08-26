"use client";

import React from "react";
import { FolderOpen } from "iconsax-react";
import { cn } from "@/lib/utils";
import type { CourseRow } from "../data/mockData";
import { categoryLegend } from "../data/categoryColors";
import { CourseCard } from "./CourseCard";

interface AdminCoursesGridProps {
  courses: CourseRow[];
  /** Every course matching the current filters — drives the colour legend. */
  legendSource: CourseRow[];
  selectedIds: Set<string>;
  allOnPageSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onOpen: (course: CourseRow) => void;
  onApprove: (course: CourseRow) => void;
  onReject: (course: CourseRow) => void;
}

export const AdminCoursesGrid = ({
  courses,
  legendSource,
  selectedIds,
  allOnPageSelected,
  onToggleSelectAll,
  onToggleSelect,
  onOpen,
  onApprove,
  onReject,
}: AdminCoursesGridProps) => {
  const legend = React.useMemo(
    () => categoryLegend(legendSource.map((course) => course.category)),
    [legendSource],
  );

  return (
    <div className="flex w-full flex-col gap-[16px]">
      {/* Colour legend + page-level select all */}
      <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[10px]">
        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
          <span className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.3px] text-sd-muted-text">
            Categories
          </span>
          {legend.map(({ category, palette }) => (
            <span key={category} className="flex items-center gap-[6px]">
              <span className={cn("size-[10px] shrink-0 rounded-full", palette.dot)} />
              <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
                {category}
              </span>
            </span>
          ))}
        </div>

        <label className="flex shrink-0 items-center gap-[8px] cursor-pointer">
          <input
            type="checkbox"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            disabled={courses.length === 0}
            className="size-[16px] rounded-[4px] accent-sd-blue cursor-pointer"
          />
          <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
            Select all on page
          </span>
        </label>
      </div>

      {courses.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[4px] border border-sd-grey-3 bg-sd-grey-1">
          <div className="flex size-[48px] items-center justify-center rounded-full bg-sd-grey-2 text-sd-grey-11">
            <FolderOpen size={24} variant="Linear" color="currentColor" />
          </div>
          <span className="text-[14px] font-medium tracking-[-0.28px] text-sd-grey-11">
            No courses found matching filters.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              selected={selectedIds.has(course.id)}
              onToggleSelect={() => onToggleSelect(course.id)}
              onOpen={() => onOpen(course)}
              onApprove={() => onApprove(course)}
              onReject={() => onReject(course)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
