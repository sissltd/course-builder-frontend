import React from "react";
import { cn } from "@/lib/utils";

interface ReviewerPendingPagerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalEntries: number;
  itemsPerPage: number;
}

export const ReviewerPendingPager = ({
  currentPage,
  totalPages,
  onPageChange,
  totalEntries,
  itemsPerPage,
}: ReviewerPendingPagerProps) => {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  return (
    <div className="flex flex-col gap-[16px] pt-[10px] md:flex-row md:items-center md:justify-between">
      <div className="inline-flex h-[40px] items-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] text-[16px] font-normal text-sd-grey-6 leading-[24px]">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "px-[14px] py-[8px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
            currentPage === 1 ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-11 hover:text-sd-grey-12"
          )}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const active = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[6px] border text-[14px] font-normal transition-colors cursor-pointer",
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
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "px-[14px] py-[8px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
            currentPage === totalPages ? "text-sd-grey-11/40 cursor-not-allowed" : "text-sd-grey-11 hover:text-sd-grey-12"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};
