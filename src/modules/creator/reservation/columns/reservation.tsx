"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";
import type { TopicReservation } from "../types";
import { TopicReservationStatus } from "../types";

export type Reservation = TopicReservation;

const StatusChip = ({ status }: { status: TopicReservationStatus }) => {
  const styles: Record<TopicReservationStatus, string> = {
    [TopicReservationStatus.APPROVED]: "bg-[#ECFDF3] text-[#027A48]",
    [TopicReservationStatus.PENDING]: "bg-[#FFFAEB] text-[#B54708]",
    [TopicReservationStatus.REJECTED]: "bg-[#FEF3F2] text-[#B42318]",
  };

  const labels: Record<TopicReservationStatus, string> = {
    [TopicReservationStatus.APPROVED]: "Approved",
    [TopicReservationStatus.PENDING]: "Pending",
    [TopicReservationStatus.REJECTED]: "Rejected",
  };

  return (
    <div className={cn("px-[8px] py-[2px] rounded-[16px] text-[12px] font-medium w-fit", styles[status])}>
      {labels[status]}
    </div>
  );
};

export const reservationColumns = (onActionClick: (reservation: Reservation) => void): ColumnDef<Reservation>[] => [
  {
    accessorKey: "name",
    header: "TOPIC",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] font-medium tracking-[-0.28px]">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.category.name,
    id: "category",
    header: "CATEGORY",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {row.original.category.name}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusChip status={row.getValue("status")} />,
  },
  {
    accessorKey: "created_datetime",
    header: "DATE REQUESTED",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
        {new Date(row.getValue("created_datetime")).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
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
