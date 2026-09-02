"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { format } from "date-fns";
import type { Collaborator } from "../types";

const AvatarCell = ({ name, color = "#0063EF" }: { name: string; color?: string }) => {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-[12px]">
      <div
        className="size-[36px] rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: color }}
      >
        <span className="text-[14px] font-semibold text-white">{initial}</span>
      </div>
      <span className="text-[14px] text-[#202020] tracking-[-0.28px]">{name}</span>
    </div>
  );
};

const AVATAR_COLORS = ["#0063EF", "#F05A25", "#606060", "#FF5025", "#2E7D32", "#7B1FA2"];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const collaboratorColumns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <AvatarCell
        name={row.getValue("name")}
        color={getAvatarColor(row.original.name)}
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "date_added",
    header: "Date added",
    cell: ({ row }) => {
      const date = row.getValue("date_added") as string;
      return (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
          {format(new Date(date), "d MMMM yyyy, hh:mm a")}
        </span>
      );
    },
  },
  {
    accessorKey: "role_label",
    header: "Role",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {row.getValue("role_label")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <button className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer p-[4px] hover:bg-sd-grey-2 rounded-[4px] flex items-center justify-center">
        <More size={20} variant="Linear" color="currentColor" />
      </button>
    ),
  },
];
