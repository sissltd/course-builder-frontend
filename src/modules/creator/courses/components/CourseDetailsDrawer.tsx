"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import type { CourseSummary } from "@/modules/creator/courses/types";
import { CourseStatus } from "@/modules/creator/courses/types";
import { getCourseStatusDisplay } from "@/modules/creator/courses/utils/status";
import { cn } from "@/lib/utils";
import { ArrowRight } from "iconsax-react";
import { Button } from "@/components/shared/Button";

interface CourseDetailsDrawerProps {
  course: CourseSummary | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResolveIssues?: (course: CourseSummary) => void;
}

const DetailRow = ({
  label,
  value,
  chip,
}: {
  label: string;
  value?: string;
  chip?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-[8px]">
    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#606060]">
      {label}
    </span>
    {chip ? (
      <div className="w-fit">{chip}</div>
    ) : (
      <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#202020]">
        {value}
      </span>
    )}
  </div>
);

export const CourseDetailsDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onResolveIssues,
}: CourseDetailsDrawerProps) => {
  if (!course) return null;

  const statusDisplay = getCourseStatusDisplay(course.status);
  const showReviewerNote =
    course.status === CourseStatus.REJECTED ||
    course.status === CourseStatus.NEEDS_REVISION;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Course details"
      footer={
        showReviewerNote ? (
          <Button
            variant="app-primary"
            className="h-[44px] w-full"
            onClick={() => onResolveIssues?.(course)}
            rightIcon={<ArrowRight size={20} variant="Linear" color="#FFF" />}
          >
            {course.status === CourseStatus.REJECTED
              ? "Review changes"
              : "Resolve issues"}
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col gap-[32px]">
        {/* Status + Note */}
        <div className="flex flex-col gap-[16px]">
          <DetailRow
            label="Status"
            chip={
              <span
                className={cn(
                  "whitespace-nowrap rounded-[6px] px-[12px] py-[6px] text-[14px] font-medium tracking-[-0.28px]",
                  statusDisplay.bg,
                  statusDisplay.text,
                )}
              >
                {statusDisplay.label}
              </span>
            }
          />
          {showReviewerNote && (
            <div className="rounded-[10px] border border-[#8C8C8C] bg-[#FDFDFD] p-[16px] flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[4px] text-[12px] font-medium text-[#592D18]">
                  <span>R1 Lesson 2</span>
                  <span>-</span>
                  <span>Script Length</span>
                </div>
                <p className="text-[14px] tracking-[-0.28px] text-[#202020]">
                  300/500 words below minimum
                </p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[14px] tracking-[-0.28px] text-[#202020]">
                  Reviewer&apos;s note
                </span>
                <div className="rounded-[8px] border border-[#D9D9D9] p-[12px]">
                  <p className="text-[14px] tracking-[-0.28px] text-[#606060]">
                    Extend the lesson script to resolve this issue
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-[32px]">
          <DetailRow label="Topic" value={course.title} />
          <DetailRow label="Course category" value={course.category.name} />
        </div>

        <div className="h-px bg-[#F0F0F0]" />

        {/* Date */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#606060]">
            Date created
          </span>
          <span className="text-[16px] leading-[24px] tracking-[-0.32px] text-[#202020]">
            {new Date(course.created_datetime).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </SideDrawer>
  );
};
