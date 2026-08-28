"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CloseCircle, TickCircle } from "iconsax-react";
import {
  PayoutBypassChip,
  ReferenceChip,
  SortableHeader,
  SubmissionStatusPill,
  TimestampCell,
  fieldValue,
} from "../components/SharedUI";
import { formatEarnings } from "../utils/format";
import { SubmissionStatus, type MieSubmission } from "../types";

interface SubmissionColumnOptions {
  onApprove: (row: MieSubmission) => void;
  onReject: (row: MieSubmission) => void;
}

export const submissionColumns = ({
  onApprove,
  onReject,
}: SubmissionColumnOptions): ColumnDef<MieSubmission>[] => [
  {
    accessorKey: "title",
    header: "Idea",
    cell: ({ row }) => (
      <div className="flex flex-col gap-[4px]">
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          {row.original.title}
        </span>
        <ReferenceChip reference={row.original.reference} />
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: "developer_email",
    header: "Developer",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
        {row.original.developer_email}
      </span>
    ),
    size: 200,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <SubmissionStatusPill status={row.original.status} />,
    size: 150,
  },
  {
    accessorKey: "demand_score",
    header: ({ column }) => <SortableHeader column={column} label="Demand" />,
    sortingFn: (a, b) =>
      (a.original.demand_score ?? -1) - (b.original.demand_score ?? -1),
    cell: ({ row }) => (
      <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
        {fieldValue(row.original.demand_score)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: "estimated_monthly_earnings",
    header: "Est. monthly",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
        {formatEarnings(row.original.estimated_monthly_earnings)}
      </span>
    ),
    size: 130,
  },
  {
    accessorKey: "payout_bypass",
    header: "Payout",
    cell: ({ row }) => <PayoutBypassChip active={row.original.payout_bypass} />,
    size: 110,
  },
  {
    accessorKey: "created_datetime",
    header: "Arrived",
    cell: ({ row }) => <TimestampCell iso={row.original.created_datetime} />,
    size: 130,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const { status } = row.original;
      // Every state is actionable — the only pointless button is the one that
      // would re-apply the decision the row already carries.
      const canApprove = status !== SubmissionStatus.APPROVED;
      const canReject = status !== SubmissionStatus.REJECTED;

      return (
        <div className="flex items-center gap-[8px]">
          {canReject && (
            <button
              type="button"
              onClick={() => onReject(row.original)}
              className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
            >
              <CloseCircle variant="Linear" size={16} color="#D54800" />
              <span className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-sd-grey-12">
                Reject
              </span>
            </button>
          )}
          {canApprove && (
            <button
              type="button"
              onClick={() => onApprove(row.original)}
              className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
            >
              <TickCircle variant="Linear" size={16} color="#008500" />
              <span className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-sd-grey-12">
                {status === SubmissionStatus.REJECTED ? "Re-approve" : "Approve"}
              </span>
            </button>
          )}
        </div>
      );
    },
    size: 190,
  },
];
