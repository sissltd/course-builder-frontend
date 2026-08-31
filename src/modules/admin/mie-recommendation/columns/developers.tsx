"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CloseCircle, PauseCircle, TickCircle } from "iconsax-react";
import {
  CopyButton,
  DeveloperStatusPill,
  PlanPill,
  TimestampCell,
  fieldValue,
} from "../components/SharedUI";
import { DeveloperAccountStatus, type MieDeveloper } from "../types";

interface DeveloperColumnOptions {
  onApprove: (row: MieDeveloper) => void;
  onReject: (row: MieDeveloper) => void;
  onSuspend: (row: MieDeveloper) => void;
}

export const developerColumns = ({
  onApprove,
  onReject,
  onSuspend,
}: DeveloperColumnOptions): ColumnDef<MieDeveloper>[] => [
  {
    accessorKey: "email",
    header: "Developer",
    cell: ({ row }) => (
      <div className="flex flex-col gap-[2px]">
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          {row.original.email}
        </span>
        <span
          className="max-w-[280px] truncate text-[12px] leading-[16px] text-sd-grey-11"
          title={row.original.webhook_url}
        >
          {row.original.webhook_url}
        </span>
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <DeveloperStatusPill status={row.original.status} />,
    size: 130,
  },
  {
    accessorKey: "plan_type",
    header: "Plan",
    cell: ({ row }) => <PlanPill plan={row.original.plan_type} />,
    size: 180,
  },
  {
    accessorKey: "api_key_preview",
    header: "API key",
    cell: ({ row }) => {
      const preview = row.original.api_key_preview;
      if (!preview) {
        return (
          <span
            className="text-[13px] leading-[18px] text-sd-muted-text"
            title="No key has been issued for this account yet."
          >
            Not issued
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-[6px]">
          <span
            className="whitespace-nowrap font-mono text-[13px] leading-[18px] text-sd-grey-11"
            title="Masked preview. The full key was shown once at issuance and cannot be retrieved."
          >
            {preview}
          </span>
          <CopyButton value={preview} label="Copy" className="px-[6px]" />
        </span>
      );
    },
    size: 200,
  },
  {
    accessorKey: "api_key_last_used_at",
    header: "Key last used",
    cell: ({ row }) =>
      row.original.api_key_last_used_at ? (
        <TimestampCell iso={row.original.api_key_last_used_at} />
      ) : (
        fieldValue(null)
      ),
    size: 140,
  },
  {
    accessorKey: "created_datetime",
    header: "Registered",
    cell: ({ row }) => <TimestampCell iso={row.original.created_datetime} />,
    size: 130,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const { status } = row.original;
      // Approve doubles as un-reject and un-suspend; suspend is APPROVED-only.
      const canApprove = status !== DeveloperAccountStatus.APPROVED;
      const canSuspend = status === DeveloperAccountStatus.APPROVED;
      const canReject = status !== DeveloperAccountStatus.REJECTED;

      const approveLabel =
        status === DeveloperAccountStatus.PENDING ? "Approve" : "Reactivate";

      return (
        <div className="flex items-center gap-[8px]">
          {canReject && (
            <button
              type="button"
              onClick={() => onReject(row.original)}
              className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
            >
              <CloseCircle variant="Linear" size={16} color="#D54800" />
              <span className="whitespace-nowrap text-[12px] leading-[16px] text-sd-grey-12">
                Reject
              </span>
            </button>
          )}
          {canSuspend && (
            <button
              type="button"
              onClick={() => onSuspend(row.original)}
              className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
            >
              <PauseCircle variant="Linear" size={16} color="var(--sd-warning-text)" />
              <span className="whitespace-nowrap text-[12px] leading-[16px] text-sd-grey-12">
                Suspend
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
              <span className="whitespace-nowrap text-[12px] leading-[16px] text-sd-grey-12">
                {approveLabel}
              </span>
            </button>
          )}
        </div>
      );
    },
    size: 220,
  },
];
