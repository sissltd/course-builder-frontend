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
import type { CourseSummary } from "@/modules/creator/courses/types";
import { CourseStatus } from "@/modules/creator/courses/types";
import {
  getCourseStatusDisplay,
  formatCourseId,
} from "@/modules/creator/courses/utils/status";

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    Approved: { bg: "bg-[#EBF7EE]", text: "text-[#27AE60]" },
    "In Review": { bg: "bg-[#EBF3FF]", text: "text-[#0063EF]" },
    Rejected: { bg: "bg-[#FFF0ED]", text: "text-[#FF5025]" },
    Draft: { bg: "bg-[#F5F5F5]", text: "text-[#606060]" },
    "Needs Revision": { bg: "bg-[#FFF5ED]", text: "text-[#F2994A]" },
  };

  const currentStyle = styles[status] || styles["Draft"];

  return (
    <span
      className={cn(
        "px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap",
        currentStyle.bg,
        currentStyle.text,
      )}
    >
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
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {formatCourseId(id)}
      </span>
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

export const myCoursesColumns: ColumnDef<CourseSummary, unknown>[] = [
  {
    accessorKey: "title",
    header: "COURSE TITLE",
    cell: ({ row }) => (
      <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px]">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      const category = row.getValue("category") as { name: string } | null;
      return (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
          {category?.name ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Course ID",
    cell: ({ row }) => <CourseIdCell id={row.getValue("id")} />,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as CourseStatus;
      const display = getCourseStatusDisplay(status);
      return <StatusChip status={display.label} />;
    },
  },
  {
    accessorKey: "created_datetime",
    header: "CREATED",
    cell: ({ row }) => {
      const date = row.getValue("created_datetime") as string;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row, table }) => {
      const meta = table.options.meta as Record<string, unknown> | undefined;
      const course = row.original;

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer p-[4px] hover:bg-sd-grey-2 rounded-[4px] flex items-center justify-center outline-none">
                <More size={24} variant="Linear" color="currentColor" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[180px] bg-white border border-[#F0F0F0] rounded-[12px] p-[8px] "
            >
              <DropdownMenuItem
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() =>
                  (meta?.onViewDetails as (c: CourseSummary) => void)?.(course)
                }
              >
                <Eye size={18} variant="Linear" color="currentColor" />
                <span>View details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() =>
                  (meta?.onEdit as (c: CourseSummary) => void)?.(course)
                }
              >
                <Edit size={18} variant="Linear" color="currentColor" />
                <span>Edit course</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                onClick={() =>
                  (meta?.onMoveToDraft as (c: CourseSummary) => void)?.(course)
                }
              >
                <Mirror size={18} variant="Linear" color="currentColor" />
                <span>Move to draft</span>
              </DropdownMenuItem>
              {course.status === CourseStatus.REJECTED && (
                <DropdownMenuItem
                  className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] outline-none"
                  onClick={() =>
                    (meta?.onAppeal as (c: CourseSummary) => void)?.(course)
                  }
                >
                  <Danger size={18} variant="Linear" color="currentColor" />
                  <span>Appeal</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex items-center gap-[10px] p-[8px] rounded-[8px] text-[14px] text-[#FF5025] cursor-pointer hover:bg-[#FFF0ED] focus:bg-[#FFF0ED] outline-none"
                onClick={() =>
                  (meta?.onDelete as (c: CourseSummary) => void)?.(course)
                }
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
