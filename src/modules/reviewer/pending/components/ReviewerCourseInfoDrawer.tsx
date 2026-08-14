"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, ArrowRight2, CloseCircle, Copy } from "iconsax-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import type { PendingCourseRow } from "../types";

interface ReviewerCourseInfoDrawerProps {
  course: PendingCourseRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}

const DetailRow = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="flex items-start justify-between gap-[16px]">
    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
      {label}
    </span>
    <div className={cn("flex items-center gap-[8px] text-right", valueClassName)}>
      {value}
    </div>
  </div>
);

export const ReviewerCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious = false,
  canNext = false,
}: ReviewerCourseInfoDrawerProps) => {
  const router = useRouter();

  if (!course) return null;

  const copyCourseId = async () => {
    try {
      await navigator.clipboard.writeText(course.courseId);
    } catch {
      // clipboard errors are non-blocking here
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      showCloseButton={false}
      className="!w-full md:!w-[392px] md:!max-w-[392px]"
      title={
        <div className="flex items-center justify-between gap-[16px]">
          <span className="min-w-0 truncate text-[20px] font-semibold leading-[28px] tracking-[-0.4px] text-sd-grey-12">
            Course Information
          </span>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canPrevious}
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-10 transition-colors",
                canPrevious ? "hover:bg-sd-grey-2" : "cursor-not-allowed opacity-40",
              )}
              aria-label="Previous course"
            >
              <ArrowLeft2 size={18} variant="Linear" color="currentColor" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-10 transition-colors",
                canNext ? "hover:bg-sd-grey-2" : "cursor-not-allowed opacity-40",
              )}
              aria-label="Next course"
            >
              <ArrowRight2 size={18} variant="Linear" color="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-10 transition-colors hover:bg-sd-grey-2"
              aria-label="Close course information"
            >
              <CloseCircle size={18} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-[24px]">
        <button
          type="button"
          onClick={() =>
            router.push(`${ReviewerRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.courseId)}`)
          }
          className="flex h-[46px] w-fit items-center gap-[12px] rounded-[8px] border border-sd-blue bg-sd-grey-1 px-[20px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-12 transition-colors hover:bg-sd-blue-light"
        >
          <span>Preview course</span>
          <ArrowRight2 size={18} variant="Linear" color="currentColor" />
        </button>

        <section className="flex flex-col gap-[16px] border-b border-sd-grey-3 pb-[20px]">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            COURSE INFORMATION
          </span>

          <DetailRow
            label="Course Title"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.courseTitle}
              </span>
            }
          />
          <DetailRow
            label="Category"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.category}
              </span>
            }
          />
          <DetailRow
            label="Difficulty Level"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.difficultyLevel}
              </span>
            }
          />
          <DetailRow
            label="Course ID"
            value={
              <>
                <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  {course.courseId}
                </span>
                <button
                  type="button"
                  onClick={copyCourseId}
                  className="shrink-0 text-sd-grey-10 transition-colors hover:text-sd-grey-12"
                  aria-label={`Copy ${course.courseId}`}
                >
                  <Copy size={18} variant="Linear" color="currentColor" />
                </button>
              </>
            }
          />
          <DetailRow
            label="Date Created"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.dateCreated}
              </span>
            }
          />
        </section>

        <section className="flex flex-col gap-[16px]">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            APPROVER INFORMATION
          </span>

          <DetailRow
            label="Approved by"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.approvedBy}
              </span>
            }
          />
          <DetailRow
            label="Date approved"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.dateApproved}
              </span>
            }
          />
        </section>
      </div>
    </SideDrawer>
  );
};
