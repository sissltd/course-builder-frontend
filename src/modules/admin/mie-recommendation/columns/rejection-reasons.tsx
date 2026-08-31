"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, EyeSlash, RefreshCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { TimestampCell, fieldValue } from "../components/SharedUI";
import type { MieRejectionReason } from "../types";

interface RejectionReasonColumnOptions {
  onEdit: (row: MieRejectionReason) => void;
  onToggleActive: (row: MieRejectionReason) => void;
}

export const rejectionReasonColumns = ({
  onEdit,
  onToggleActive,
}: RejectionReasonColumnOptions): ColumnDef<MieRejectionReason>[] => [
  {
    accessorKey: "label",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
        {row.original.label}
      </span>
    ),
    size: 240,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span
        className="block max-w-[380px] text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11"
        title={row.original.description ?? undefined}
      >
        {fieldValue(row.original.description)}
      </span>
    ),
    size: 400,
  },
  {
    accessorKey: "is_active",
    header: "State",
    cell: ({ row }) => (
      <span
        title={
          row.original.is_active
            ? "Selectable when rejecting a submission."
            : "Retired. Past rejections keep it, but reviewers can no longer pick it."
        }
        className={cn(
          "inline-flex w-fit items-center whitespace-nowrap rounded-[8px] px-[10px] py-[4px] text-[12px] font-medium leading-[16px]",
          row.original.is_active
            ? "bg-sd-success-bg text-sd-success-text"
            : "bg-sd-grey-3 text-sd-grey-11",
        )}
      >
        {row.original.is_active ? "Active" : "Inactive"}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: "created_datetime",
    header: "Created",
    cell: ({ row }) => <TimestampCell iso={row.original.created_datetime} />,
    size: 130,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
        >
          <Edit2 variant="Linear" size={16} color="var(--sd-grey-11)" />
          <span className="whitespace-nowrap text-[12px] leading-[16px] text-sd-grey-12">
            Edit
          </span>
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(row.original)}
          className="flex h-[32px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-3 px-[8px] transition-colors hover:bg-sd-grey-1"
        >
          {row.original.is_active ? (
            <EyeSlash variant="Linear" size={16} color="var(--sd-warning-text)" />
          ) : (
            <RefreshCircle variant="Linear" size={16} color="#008500" />
          )}
          <span className="whitespace-nowrap text-[12px] leading-[16px] text-sd-grey-12">
            {row.original.is_active ? "Deactivate" : "Reactivate"}
          </span>
        </button>
      </div>
    ),
    size: 220,
  },
];
