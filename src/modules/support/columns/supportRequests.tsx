import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SupportRequest } from "../types";
import {
  formatSupportDate,
  isSupportRequestOverdue,
  supportRequesterName,
} from "../utils/format";
import { SupportKindBadge } from "../components/SupportKindBadge";
import { SupportStatusBadge } from "../components/SupportStatusBadge";

interface SupportRequestColumnsOptions {
  /**
   * Shows who raised the request and the address to reply to. On for the admin
   * queue, off for the creator's own tabs — showing a creator their own name
   * beside every row is noise.
   */
  showRequester?: boolean;
  /** Extra column, typically a Resolve action. Admin detail/queue only. */
  actions?: React.ReactNode;
}

const Cell = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
    {children}
  </span>
);

/**
 * Column set for a `BaseTable` over `SupportRequest`.
 *
 * Shared by the admin queue and both creator tabs because the API returns the
 * identical record from all three listings — three copies of these columns would
 * be three places for them to drift.
 */
export const supportRequestColumns = ({
  showRequester = false,
  actions,
}: SupportRequestColumnsOptions = {}): ColumnDef<SupportRequest, unknown>[] => {
  const columns: ColumnDef<SupportRequest, unknown>[] = [
    {
      accessorKey: "title",
      header: "Subject",
      cell: ({ row }) => (
        <div className="flex flex-col gap-[2px] min-w-0">
          <span className="truncate text-[14px] leading-[20px] tracking-[-0.28px] text-[#202020]">
            {row.original.title || "Untitled request"}
          </span>
          <span className="truncate text-[12px] leading-[16px] text-sd-grey-11">
            {row.original.message}
          </span>
        </div>
      ),
      size: 320,
    },
    {
      accessorKey: "kind",
      header: "Kind",
      cell: ({ row }) => <SupportKindBadge kind={row.original.kind} />,
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <SupportStatusBadge status={row.original.status} />,
      size: 140,
    },
    {
      accessorKey: "due_at",
      header: "Due",
      cell: ({ row }) => {
        const overdue = isSupportRequestOverdue(row.original);
        return (
          <span
            className={`text-[14px] leading-[20px] tracking-[-0.28px] ${
              overdue ? "text-[#FF5025]" : "text-sd-grey-11"
            }`}
          >
            {formatSupportDate(row.original.due_at)}
            {overdue ? " — overdue" : ""}
          </span>
        );
      },
      size: 160,
    },
    {
      accessorKey: "created_datetime",
      header: "Submitted",
      cell: ({ row }) => (
        <Cell>{formatSupportDate(row.original.created_datetime)}</Cell>
      ),
      size: 140,
    },
  ];

  if (showRequester) {
    columns.splice(1, 0, {
      accessorKey: "email",
      header: "Requester",
      cell: ({ row }) => (
        <div className="flex flex-col gap-[2px] min-w-0">
          <span className="truncate text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            {supportRequesterName(row.original)}
          </span>
          <span className="truncate text-[12px] leading-[16px] text-sd-grey-11">
            {row.original.submitted_by_email ?? row.original.email}
          </span>
        </div>
      ),
      size: 200,
    });
  }

  if (actions) {
    columns.push({ id: "actions", header: "", cell: () => actions, size: 60 });
  }

  return columns;
};
