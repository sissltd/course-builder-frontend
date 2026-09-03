"use client";

import React, { useMemo } from "react";
import { FolderOpen } from "iconsax-react";
import { cn } from "@/lib/utils";
import { categoryLegend } from "@/modules/admin/courses/data/categoryColors";
import type { MieSubmission } from "../types";
import { MieSubmissionCard } from "./MieSubmissionCard";
import { getSubmissionCategory } from "../utils/category";

interface MieSubmissionsGridProps {
  submissions: MieSubmission[];
  isLoading?: boolean;
  emptyText?: string;
  onOpen: (submission: MieSubmission) => void;
  onApprove: (submission: MieSubmission) => void;
  onReject: (submission: MieSubmission) => void;
}

export const MieSubmissionsGrid = ({
  submissions,
  isLoading = false,
  emptyText = "No submissions found matching criteria",
  onOpen,
  onApprove,
  onReject,
}: MieSubmissionsGridProps) => {
  const legend = useMemo(() => {
    const categories = submissions.map((s) => getSubmissionCategory(s));
    return categoryLegend(categories);
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[16px]">
        {/* Skeleton Legend */}
        <div className="h-[40px] w-full animate-pulse rounded-[12px] border border-sd-grey-3 bg-sd-grey-1" />

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[230px] flex-col justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-2/50 p-[18px] animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-[22px] w-[90px] rounded-[6px] bg-sd-grey-3" />
                <div className="size-[24px] rounded-full bg-sd-grey-3" />
              </div>
              <div className="space-y-[8px]">
                <div className="h-[18px] w-3/4 rounded bg-sd-grey-3" />
                <div className="h-[14px] w-1/2 rounded bg-sd-grey-3" />
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="h-[24px] w-[80px] rounded bg-sd-grey-3" />
                <div className="h-[24px] w-[90px] rounded bg-sd-grey-3" />
              </div>
              <div className="flex items-center justify-between border-t border-sd-grey-3 pt-[12px]">
                <div className="h-[14px] w-[110px] rounded bg-sd-grey-3" />
                <div className="h-[14px] w-[70px] rounded bg-sd-grey-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-white p-6 text-center">
        <div className="flex size-[48px] items-center justify-center rounded-full bg-sd-grey-2 text-sd-grey-11">
          <FolderOpen size={24} variant="Linear" color="currentColor" />
        </div>
        <span className="text-[14px] font-medium text-sd-grey-11">
          {emptyText}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[16px]">
      {/* Colour legend matching Courses */}
      {legend.length > 0 && (
        <div className="flex flex-wrap items-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[10px]">
          <span className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.3px] text-sd-muted-text">
            Categories
          </span>
          <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
            {legend.map(({ category, palette }) => (
              <span key={category} className="flex items-center gap-[6px]">
                <span className={cn("size-[10px] shrink-0 rounded-full", palette.dot)} />
                <span className="text-[12px] font-normal leading-[16px] text-sd-grey-11">
                  {category}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Coloured Cards */}
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {submissions.map((submission) => (
          <MieSubmissionCard
            key={submission.id}
            submission={submission}
            onOpen={() => onOpen(submission)}
            onApprove={() => onApprove(submission)}
            onReject={() => onReject(submission)}
          />
        ))}
      </div>
    </div>
  );
};
