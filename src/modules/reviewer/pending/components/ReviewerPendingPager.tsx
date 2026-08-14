import React from "react";
import { cn } from "@/lib/utils";

const pages = [1, 2, 3, 4, 5];

export const ReviewerPendingPager = () => {
  return (
    <div className="flex flex-col gap-[16px] pt-[10px] md:flex-row md:items-center md:justify-between">
      <div className="inline-flex h-[40px] items-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] text-[16px] font-normal text-sd-grey-6 leading-[24px]">
        Showing 50 entries
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          className="px-[14px] py-[8px] text-[14px] font-normal text-sd-grey-11 transition-colors hover:text-sd-grey-12"
        >
          Previous
        </button>

        {pages.map((page) => {
          const active = page === 3;
          return (
            <button
              key={page}
              type="button"
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[6px] border text-[14px] font-normal transition-colors",
                active
                  ? "border-sd-blue bg-sd-blue text-sd-grey-1"
                  : "border-sd-grey-4 bg-sd-grey-1 text-sd-grey-11 hover:bg-sd-grey-2",
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="px-[14px] py-[8px] text-[14px] font-normal text-sd-grey-11 transition-colors hover:text-sd-grey-12"
        >
          Next
        </button>
      </div>
    </div>
  );
};
