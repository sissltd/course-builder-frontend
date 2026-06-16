"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, More, Eye, Edit, Danger, Trash, Mirror } from "iconsax-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type MyCourse = {
  title: string;
  category: string;
  courseId: string;
  qualityScore: number;
  status: "Approved" | "Draft" | "In Review" | "Rejected" | "Needs revision";
  lastEdited: string;
  isAi?: boolean;
};

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    "Approved": { bg: "bg-[#EBF7EE]", text: "text-[#27AE60]" },
    "In Review": { bg: "bg-[#EBF3FF]", text: "text-[#0063EF]" },
    "Rejected": { bg: "bg-[#FFF0ED]", text: "text-[#FF5025]" },
    "Draft": { bg: "bg-[#F5F5F5]", text: "text-[#606060]" },
    "Needs revision": { bg: "bg-[#FFF5ED]", text: "text-[#F2994A]" },
  };

  const currentStyle = styles[status] || styles["Draft"];

  return (
    <span className={cn("px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap", currentStyle.bg, currentStyle.text)}>
      {status}
    </span>
  );
};

const CourseIdCell = ({ id }: { id: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success(`Course ID copied: ${id}`);
  };

  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">{id}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        className="text-[#606060] hover:text-[#0063EF] transition-colors cursor-pointer flex items-center justify-center"
        title="Copy Course ID"
      >
        <Copy size={16} variant="Linear" color="currentColor" />
      </button>
    </div>
  );
};

export const myCoursesColumns: ColumnDef<MyCourse>[] = [
  {
    accessorKey: "title",
    header: "COURSE TITLE",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px]">{row.getValue("title")}</span>
        {row.original.isAi && (
          <span className="bg-[#EBF3FF] text-[#0063EF] px-[6px] py-[2px] rounded-[4px] text-[12px] font-semibold tracking-[-0.24px] uppercase select-none">
            Ai
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {row.getValue("category")}
      </span>
    ),
  },
  {
    accessorKey: "courseId",
    header: "Course ID",
    cell: ({ row }) => <CourseIdCell id={row.getValue("courseId")} />,
  },
  {
    accessorKey: "qualityScore",
    header: "QUALITY SCORE",
    cell: ({ row }) => {
      const score = row.getValue("qualityScore") as number;
      return (
        <div className="flex items-center gap-[8px] min-w-[100px]">
          <div className="flex-1 h-[6px] bg-[#E8E8E8] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                score >= 70
                  ? "bg-[#27AE60]"
                  : score > 0
                  ? "bg-[#FF5025]"
                  : "bg-transparent"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <span
            className={cn(
              "text-[12px] font-semibold tracking-[-0.24px]",
              score >= 70
                ? "text-[#27AE60]"
                : score > 0
                ? "text-[#FF5025]"
                : "text-[#B6B6B6]"
            )}
          >
            {score}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusChip status={row.getValue("status")} />,
  },
  {
    accessorKey: "lastEdited",
    header: "LAST EDITED",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
        {row.getValue("lastEdited")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const course = row.original;

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer p-[4px] hover:bg-sd-grey-2 rounded-[4px] flex items-center justify-center outline-none">
                <More size={24} variant="Linear" color="currentColor" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white border border-[#F0F0F0] rounded-[12px] p-[8px] ">
              <DropdownMenuItem 
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() => meta?.onViewDetails(course)}
              >
                <Eye size={18} variant="Linear" color="currentColor" />
                <span>View details</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() => meta?.onEdit(course)}
              >
                <Edit size={18} variant="Linear" color="currentColor" />
                <span>Edit course</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() => meta?.onMoveToDraft(course)}
              >
                <Mirror size={18} variant="Linear" color="currentColor" />
                <span>Move to draft</span>
              </DropdownMenuItem>
              {course.status === "Rejected" && (
                <DropdownMenuItem 
                  className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                  onClick={() => meta?.onAppeal(course)}
                >
                  <Danger size={18} variant="Linear" color="currentColor" />
                  <span>Appeal</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#FF5025] cursor-pointer hover:bg-[#FFF0ED] focus:bg-[#FFF0ED] outline-none"
                onClick={() => meta?.onDelete(course)}
              >
                <Trash size={18} variant="Linear" color="currentColor" />
                <span>Delete course</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
