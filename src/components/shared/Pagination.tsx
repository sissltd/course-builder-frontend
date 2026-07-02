"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  pageIndex,
  pageSize,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  setPageIndex,
  setPageSize,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
}: PaginationProps) {
  const getVisiblePages = () => {
    const total = pageCount;
    const current = pageIndex + 1;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }
    return [current - 2, current - 1, current, current + 1, current + 2];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center justify-between w-full mt-4 flex-wrap gap-4", className)}>
      <div className="flex items-center">
        <Select
          value={String(pageSize)}
          onValueChange={(val) => setPageSize(Number(val))}
        >
          <SelectTrigger className="h-[40px] px-[16px] py-[10px] border border-[#D9D9D9] rounded-[24px] bg-white text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] gap-[8px] focus:ring-0 focus:border-sd-grey-7 w-fit min-w-[130px] shadow-none flex items-center justify-between">
            <span>Show {pageSize}/page</span>
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#F0F0F0] rounded-[16px] p-[8px]">
            {pageSizeOptions.map((option) => (
              <SelectItem
                key={option}
                value={String(option)}
                className="flex items-center p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] [&_svg]:hidden"
              >
                Show {option}/page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className={cn(
            "text-[14px] font-medium tracking-[-0.28px] px-3 py-1.5 rounded-[8px] transition-colors",
            canPreviousPage
              ? "text-[#606060] hover:bg-sd-grey-1 cursor-pointer"
              : "text-[#B6B6B6] cursor-not-allowed"
          )}
        >
          Previous
        </button>

        {visiblePages.map((page) => {
          const isActive = pageIndex === page - 1;
          return (
            <button
              key={page}
              onClick={() => setPageIndex(page - 1)}
              className={cn(
                "size-[36px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] border transition-colors",
                isActive
                  ? "bg-[#0063EF] text-white border-[#0063EF]"
                  : "bg-white text-[#606060] border-[#E8E8E8] hover:bg-sd-grey-1 hover:border-sd-grey-5"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className={cn(
            "text-[14px] font-medium tracking-[-0.28px] px-3 py-1.5 rounded-[8px] transition-colors",
            canNextPage
              ? "text-[#606060] hover:bg-sd-grey-1 cursor-pointer"
              : "text-[#B6B6B6] cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
