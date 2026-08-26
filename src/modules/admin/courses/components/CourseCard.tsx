"use client";

import React from "react";
import { Calendar2, CloseCircle, More, TickCircle } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { colorForCreator, initialsFor, type CourseRow, type CourseStatus } from "../data/mockData";
import { paletteForCategory } from "../data/categoryColors";

const STATUS_LABEL: Record<CourseStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_DOT: Record<CourseStatus, string> = {
  pending: "bg-[#B77815]",
  approved: "bg-[#008500]",
  rejected: "bg-[#FF5025]",
};

interface CourseCardProps {
  course: CourseRow;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const CourseCard = ({
  course,
  selected,
  onToggleSelect,
  onOpen,
  onApprove,
  onReject,
}: CourseCardProps) => {
  const palette = paletteForCategory(course.category);

  // Only the card body opens the drawer — the controls stop the click bubbling.
  const stop = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <div
      onClick={onOpen}
      className={cn(
        "flex cursor-pointer flex-col rounded-[4px] border p-[18px] transition-all hover:shadow-[0px_6px_16px_rgba(0,0,0,0.07)]",
        palette.card,
        selected && cn("ring-2 ring-offset-2 ring-offset-sd-grey-1", palette.ring),
      )}
    >
      {/* Status + kebab */}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px]" onClick={stop}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="size-[15px] shrink-0 rounded-[3px] accent-sd-blue cursor-pointer"
            aria-label={`Select ${course.courseTitle}`}
          />
          <span
            className={cn(
              "flex items-center gap-[6px] text-[13px] font-normal leading-[18px]",
              palette.body,
            )}
          >
            <span className={cn("size-[6px] shrink-0 rounded-full", STATUS_DOT[course.status])} />
            {STATUS_LABEL[course.status]}
          </span>
        </div>

        <div onClick={stop}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex size-[26px] items-center justify-center rounded-[4px] transition-colors hover:bg-white/70 cursor-pointer",
                  palette.body,
                )}
                aria-label="More options"
              >
                <More size={20} variant="Linear" color="currentColor" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[160px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[6px]"
            >
              {course.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={onApprove}
                    className="cursor-pointer gap-[8px] rounded-[6px] p-[8px] text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2"
                  >
                    <TickCircle size={16} variant="Linear" color="#008500" />
                    Approve course
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onReject}
                    className="cursor-pointer gap-[8px] rounded-[6px] p-[8px] text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2"
                  >
                    <CloseCircle size={16} variant="Linear" color="#D54800" />
                    Reject course
                  </DropdownMenuItem>
                  <div className="my-[4px] h-px bg-sd-grey-3" />
                </>
              )}
              <DropdownMenuItem
                onClick={onOpen}
                className="cursor-pointer rounded-[6px] p-[8px] text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2"
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-[6px] p-[8px] text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2">
                Edit course
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-[6px] p-[8px] text-[14px] font-normal text-red-500 hover:bg-red-50">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title + category line */}
      <h3
        className={cn(
          "mt-[20px] line-clamp-2 text-[22px] font-semibold leading-[30px] tracking-[-0.44px]",
          palette.title,
        )}
      >
        {course.courseTitle}
      </h3>
      <span
        className={cn(
          "mt-[4px] text-[14px] font-normal leading-[20px] tracking-[-0.28px]",
          palette.body,
        )}
      >
        {course.category} · {course.difficultyLevel}
      </span>

      {/* Creator + date */}
      <div className="mt-[22px] flex items-center gap-[8px]">
        <span
          className="flex size-[24px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: colorForCreator(course.creator) }}
        >
          {initialsFor(course.creator)}
        </span>
        <span
          className={cn(
            "truncate text-[14px] font-medium leading-[20px] tracking-[-0.28px]",
            palette.title,
          )}
        >
          {course.creator}
        </span>
      </div>

      <div className={cn("mt-[10px] flex items-center gap-[8px]", palette.body)}>
        <Calendar2 size={16} variant="Linear" color="currentColor" className="shrink-0" />
        <span className="text-[13px] font-normal leading-[18px]">{course.dateApproved}</span>
      </div>

      {/* Headline numbers */}
      <span
        className={cn(
          "mt-[18px] text-[18px] font-semibold leading-[24px] tracking-[-0.36px]",
          palette.title,
        )}
      >
        {course.moduleCount} modules
        <span className={cn("text-[13px] font-normal", palette.body)}>
          {" "}
          / {course.lessonCount} lessons
        </span>
      </span>
    </div>
  );
};
