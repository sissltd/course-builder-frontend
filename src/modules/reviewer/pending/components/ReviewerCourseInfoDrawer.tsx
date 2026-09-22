"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, ArrowRight2, CloseCircle, Copy } from "iconsax-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import { useGetReviewQueueDetailQuery } from "@/modules/reviewer/api/reviewQueueApi";
import type { ReviewQueueRow } from "../types";

interface ReviewerCourseInfoDrawerProps {
  course: ReviewQueueRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}

/** Humanises a snake_case API key into a label ("course_title" -> "Course Title"). */
const humanizeKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Renders an arbitrary detail group (`review_information`, `owner_information`,
 * `price_information`). The group contents are rendered defensively rather than
 * against a fixed field list so an added backend field shows up instead of
 * being silently dropped.
 */
const DetailGroup = ({
  title,
  group,
}: {
  title: string;
  group: Record<string, unknown> | null | undefined;
}) => {
  const entries = Object.entries(group ?? {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-[16px] border-b border-sd-grey-3 pb-[20px]">
      <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
        {title}
      </span>

      {entries.map(([key, value]) => (
        <DetailRow
          key={key}
          label={humanizeKey(key)}
          value={
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </span>
          }
        />
      ))}
    </section>
  );
};

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

  // The row already carries enough to paint the drawer; the detail call fills in
  // the review/owner/price groups. Hook must run before the null guard below.
  const { data: detail, isLoading: isLoadingDetail } = useGetReviewQueueDetailQuery(
    course?.id ?? "",
    { skip: !isOpen || !course?.id },
  );

  if (!course) return null;

  const reviewInformation = detail?.review_information as
    | Record<string, unknown>
    | undefined;
  const ownerInformation = detail?.owner_information as
    | Record<string, unknown>
    | undefined;
  const priceInformation = detail?.price_information as
    | Record<string, unknown>
    | undefined;

  const copyCourseId = async () => {
    try {
      await navigator.clipboard.writeText(course.id || course.courseId);
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
            router.push(`${ReviewerRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.id || course.courseId)}`)
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
                {course.dateReviewed}
              </span>
            }
          />
          <DetailRow
            label="Reviewer"
            value={
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {course.reviewer}
              </span>
            }
          />
        </section>

        {isLoadingDetail && !reviewInformation && (
          <div className="flex flex-col gap-[12px]" aria-label="Loading course detail">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[20px] w-full animate-pulse rounded bg-sd-grey-3" />
            ))}
          </div>
        )}

        <DetailGroup title="REVIEW INFORMATION" group={reviewInformation} />
        <DetailGroup title="OWNER INFORMATION" group={ownerInformation} />
        <DetailGroup title="PRICE INFORMATION" group={priceInformation} />
      </div>
    </SideDrawer>
  );
};
