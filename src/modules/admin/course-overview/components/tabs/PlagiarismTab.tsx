"use client";

import React from "react";
import { SearchNormal } from "iconsax-react";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface PlagiarismTabProps {
  course?: AdminCourseDetail;
}

export const PlagiarismTab = ({ course }: PlagiarismTabProps) => {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
        <SearchNormal size={40} variant="Linear" color="var(--sd-grey-11)" />
        <span className="text-[15px] font-semibold text-sd-grey-12">
          No plagiarism report available
        </span>
        <span className="text-[13px] text-sd-reviewer-muted max-w-[440px]">
          Plagiarism scanning has not been performed on &quot;{course?.title || "this course"}&quot; yet or results have not been submitted.
        </span>
      </div>
    </div>
  );
};
