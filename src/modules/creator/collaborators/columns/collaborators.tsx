"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";

export type Collaborator = {
  name: string;
  email: string;
  dateAdded: string;
  role: "Author" | "Collaborator";
  avatarColor?: string;
};

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

export const collaboratorColumns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <AvatarCell name={row.getValue("name")} color={row.original.avatarColor} />
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
    accessorKey: "dateAdded",
    header: "Dated added",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] whitespace-nowrap">
        {row.getValue("dateAdded")}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px]">
        {row.getValue("role")}
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
