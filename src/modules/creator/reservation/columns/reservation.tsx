"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";

export type Reservation = {
  id: string;
  topic: string;
  category: string;
  status: "Approved" | "Pending" | "Rejected";
  dateRequested: string;
};

const StatusChip = ({ status }: { status: Reservation["status"] }) => {
  const styles = {
    Approved: "bg-[#ECFDF3] text-[#027A48]",
    Pending: "bg-[#FFFAEB] text-[#B54708]",
    Rejected: "bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <div className={cn("px-[8px] py-[2px] rounded-[16px] text-[12px] font-medium w-fit", styles[status])}>
      {status}
    </div>
  );
};

export const reservationColumns = (onActionClick: (reservation: Reservation) => void): ColumnDef<Reservation>[] => [
  {
    accessorKey: "topic",
    header: "TOPIC",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] font-medium tracking-[-0.28px]">
        {row.getValue("topic")}
      </span>
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
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusChip status={row.getValue("status")} />,
  },
  {
    accessorKey: "dateRequested",
    header: "DATE REQUESTED",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
        {row.getValue("dateRequested")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => (
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onActionClick(row.original);
        }}
        className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer p-[4px] hover:bg-sd-grey-2 rounded-[4px] flex items-center justify-center"
      >
        <More size={20} variant="Linear" color="currentColor" />
      </button>
    ),
  },
];
