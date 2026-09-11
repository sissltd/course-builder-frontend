import React from "react";
import { cn } from "@/lib/utils";

interface ReviewerPendingPagerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalEntries: number;
  itemsPerPage: number;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
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
  const visiblePages = getVisiblePages(currentPage, Math.max(1, totalPages));

  return (
    <div className="flex flex-col gap-[16px] pt-[10px] md:flex-row md:items-center md:justify-between">
      <div className="inline-flex h-[40px] items-center rounded-full border border-sd-grey-3 bg-sd-grey-1 px-[16px] text-[14px] font-normal text-sd-grey-11 leading-[20px]">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>

      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={cn(
            "px-[12px] py-[8px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
            currentPage <= 1
              ? "text-sd-grey-11/40 cursor-not-allowed"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          Previous
        </button>

        <div className="flex items-center gap-[4px]">
          {visiblePages.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex size-[32px] items-center justify-center text-[14px] text-sd-grey-11"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const active = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "flex size-[32px] items-center justify-center rounded-[6px] border text-[14px] font-normal transition-colors cursor-pointer",
                  active
                    ? "border-sd-blue bg-sd-blue text-sd-grey-1"
                    : "border-sd-grey-4 bg-sd-grey-1 text-sd-grey-11 hover:bg-sd-grey-2",
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={cn(
            "px-[12px] py-[8px] text-[14px] font-normal transition-colors cursor-pointer border-0 bg-transparent",
            currentPage >= totalPages
              ? "text-sd-grey-11/40 cursor-not-allowed"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};
