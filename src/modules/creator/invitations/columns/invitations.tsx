"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash, UserOctagon } from "iconsax-react";
import type { WorkspaceCollaborator } from "../../collaborators/types";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
  getAvatarColor,
  getCollaboratorDisplayName,
} from "../utils/format";

const AvatarCell = ({ name, seed }: { name: string; seed: string }) => {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-[12px]">
      <div
        className="size-[36px] rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: getAvatarColor(seed) }}
      >
        <span className="text-[14px] font-semibold text-white">{initial}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] text-[#202020] tracking-[-0.28px] truncate">
          {name}
        </span>
        {!name.includes("@") && (
          <span className="text-[12px] text-[#636363] tracking-[-0.24px] truncate">
            {seed}
          </span>
        )}
      </div>
    </div>
  );
};

const StatusCell = ({ status }: { status: WorkspaceCollaborator["status"] }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
  return (
    <span
      className={`px-[12px] py-[4px] rounded-full text-[14px] leading-[20px] inline-flex items-center gap-[6px] whitespace-nowrap ${style.chip}`}
    >
      <span className={`size-[6px] rounded-full ${style.dot}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
};

export interface InvitationColumnActions {
  onRemove: (collaborator: WorkspaceCollaborator) => void;
  onChangeRole: (collaborator: WorkspaceCollaborator) => void;
  removingId?: string;
}

export function buildInvitationColumns({
  onRemove,
  onChangeRole,
  removingId,
}: InvitationColumnActions): ColumnDef<WorkspaceCollaborator>[] {
  return [
    {
      id: "person",
      accessorKey: "name",
      header: "Invited person",
      cell: ({ row }) => {
        const collaborator = row.original;
        const display = getCollaboratorDisplayName(collaborator);
        return (
          <AvatarCell
            name={display}
            seed={collaborator.email ?? collaborator.invited_email}
          />
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
          {row.original.role_label ||
            ROLE_LABELS[row.original.role] ||
            row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
      accessorKey: "date_added",
      header: "Date added",
      cell: ({ row }) => {
        const value = row.original.date_added || row.original.created_datetime;
        if (!value) {
          return (
            <span className="text-[14px] text-[#B6B6B6]">—</span>
          );
        }
        const parsed = new Date(value);
        return (
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
            {Number.isNaN(parsed.getTime())
              ? "—"
              : format(parsed, "d MMM yyyy")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const collaborator = row.original;
        const isRemoved = collaborator.status === "REMOVED";
        const isBusy = removingId === collaborator.id;
        return (
          <div className="flex items-center gap-[4px] justify-end">
            <button
              type="button"
              onClick={() => onChangeRole(collaborator)}
              disabled={isRemoved || isBusy}
              aria-label={`Change role for ${getCollaboratorDisplayName(collaborator)}`}
              title="Change role"
              className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer p-[6px] hover:bg-sd-grey-2 rounded-[4px] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserOctagon size={20} variant="Linear" color="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(collaborator)}
              disabled={isRemoved || isBusy}
              aria-label={`Remove ${getCollaboratorDisplayName(collaborator)}`}
              title={isRemoved ? "Already removed" : "Remove collaborator"}
              className="text-[#606060] hover:text-[#FF5025] transition-colors cursor-pointer p-[6px] hover:bg-[#FFEBEB] rounded-[4px] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash size={20} variant="Linear" color="currentColor" />
            </button>
          </div>
        );
      },
    },
  ];
}
