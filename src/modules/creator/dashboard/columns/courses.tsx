"use client";

import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";

export type Course = {
  title: string;
  category: string;
  qualityScore: number;
  status: "Approved" | "Draft" | "In review" | "Rejected" | "Needs revision";
  lastEdited: string;
  isAi?: boolean;
};

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "Approved": "bg-[#f1f8f2] text-[#3c7e44]",
    "In review": "bg-[#ebf3fe] text-[#0a60e1]",
    "Rejected": "bg-[#ffeceb] text-[#fc5049]",
    "Draft": "bg-[#e6e6e6] text-[#202020]",
    "Needs revision": "bg-[#ffeadc] text-[#d54800]",
  };

  return (
    <span className={cn("px-2 py-1 rounded-[6px] text-[14px] font-normal whitespace-nowrap tracking-[-0.28px]", styles[status] || styles["Draft"])}>
      {status}
    </span>
  );
};

export const courseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "COURSE TITLE",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.getValue("title")}
        {row.original.isAi && (
          <span className="bg-[#ebf3fe] text-[#0a60e1] px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium uppercase">Ai</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "qualityScore",
    header: "QUALITY SCORE",
    cell: ({ row }) => {
      const score = row.getValue("qualityScore") as number;
      return (
        <div className="flex items-center gap-2 min-w-[101px]">
          <div className="flex-1 h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                score >= 70 ? "bg-[#008500]" : score > 0 ? "bg-[#fc5049]" : "bg-transparent"
              )} 
              style={{ width: `${score}%` }} 
            />
          </div>
          <span className={cn(
            "text-[12px] font-medium leading-[16px]",
            score >= 70 ? "text-[#008500]" : score > 0 ? "text-[#f48e5e]" : "text-[#B6B6B6]"
          )}>
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
    cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("lastEdited")}</span>,
  },
  {
    id: "actions",
    header: "ACTION",
    cell: () => <More size={24} variant="Linear" color="#606060" className="cursor-pointer" />,
  },
];
