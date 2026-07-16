"use client";

import React from "react";
import { User, UserTick, Designtools, UserOctagon, More, Copy, Filter, Sort } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { AddStaffModal } from "@/modules/admin/dashboard/components/AddStaffModal";
import { TeamActionMenu } from "./components/TeamActionMenu";
import { ColumnDef } from "@tanstack/react-table";

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  date: string;
  status: string;
  userId: string;
}

const data: TeamMember[] = [
  { id: "1", name: "Osaite Emmanuel", initials: "O", email: "emmanuelosaite@gmil.com", role: "Super Admin", date: "25 March 2025, 07:40 PM", status: "Active", userId: "SLD-e43r-3d55-09dE-0" },
  { id: "2", name: "Sarah Johnson", initials: "S", email: "sarah.j@example.com", role: "Admin", date: "24 March 2025, 02:15 PM", status: "Active", userId: "SLD-f54s-4d66-19fF-1" },
  { id: "3", name: "Michael Chen", initials: "M", email: "michael.c@example.com", role: "Creator", date: "23 March 2025, 11:30 AM", status: "Active", userId: "SLD-g65t-5e77-29gG-2" },
  { id: "4", name: "Emily Davis", initials: "E", email: "emily.d@example.com", role: "Reviewer (Writer)", date: "22 March 2025, 09:00 AM", status: "Active", userId: "SLD-h76u-6f88-39hH-3" },
  { id: "5", name: "James Wilson", initials: "J", email: "james.w@example.com", role: "Reviewer (Verifier)", date: "21 March 2025, 04:45 PM", status: "Active", userId: "SLD-i87v-7g99-49iI-4" },
  { id: "6", name: "Anna Martinez", initials: "A", email: "anna.m@example.com", role: "Reviewer (Approver)", date: "20 March 2025, 10:20 AM", status: "Active", userId: "SLD-j98w-8h00-59jJ-5" },
  { id: "7", name: "David Brown", initials: "D", email: "david.b@example.com", role: "Contributor", date: "19 March 2025, 03:10 PM", status: "Inactive", userId: "SLD-k09x-9i11-69kK-6" },
  { id: "8", name: "Lisa Anderson", initials: "L", email: "lisa.a@example.com", role: "Creator", date: "18 March 2025, 01:30 PM", status: "Active", userId: "SLD-l10y-0j22-79lL-7" },
];

const userColors = ["#0A60E1", "#FF8A00", "#00C48C", "#FF3D57", "#7C3AED", "#14B8A6", "#8B5CF6", "#F59E0B"];

export const TeamsView = () => {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [openMenuRow, setOpenMenuRow] = React.useState<string | null>(null);

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: "Names",
      cell: ({ row }) => {
        const idx = data.findIndex((d) => d.id === row.original.id);
        const color = userColors[idx % userColors.length];
        return (
          <div className="flex items-center gap-[8px] w-[216px]">
            <div
              className="size-[32px] rounded-full flex items-center justify-center text-[16px] font-medium text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {row.original.initials}
            </div>
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              {row.original.name}
            </span>
          </div>
        );
      },
      size: 247,
    },
    {
      accessorKey: "email",
      header: "Email address",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.email}</span>
      ),
      size: 206,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.role}</span>
      ),
      size: 172,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.date}</span>
      ),
      size: 186,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.status === "Active";
        return (
          <div className={`inline-flex items-center px-[8px] py-[4px] rounded-[6px] ${active ? "bg-[#F1F8F2] text-[#3C7E44]" : "bg-[#FEF3F2] text-[#B42318]"}`}>
            <span className="text-[12px] font-normal leading-[16px]">{row.original.status}</span>
          </div>
        );
      },
      size: 94,
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-[10px]">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis">
            {row.original.userId}
          </span>
          <Copy variant="Linear" size={14} color="#606060" className="cursor-pointer shrink-0 hover:text-[#0063EF]" />
        </div>
      ),
      size: 202,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="relative flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuRow(openMenuRow === row.original.userId ? null : row.original.userId);
            }}
            className="p-[6px] rounded-full hover:bg-sd-grey-1 transition-colors cursor-pointer"
          >
            <More variant="Linear" size={24} color="#606060" />
          </button>
          {openMenuRow === row.original.userId && (
            <TeamActionMenu onClose={() => setOpenMenuRow(null)} />
          )}
        </div>
      ),
      size: 41,
    },
  ];

  const statCards = [
    { icon: <User variant="Bold" size={20} color="#202020" />, label: "Total Staff", value: "203" },
    { icon: <UserTick variant="Bold" size={20} color="#202020" />, label: "Total Active", value: "100" },
    { icon: <Designtools variant="Bold" size={20} color="#202020" />, label: "Creators", value: "150" },
    { icon: <UserOctagon variant="Bold" size={20} color="#202020" />, label: "Super Admin", value: "24" },
    { icon: <UserOctagon variant="Bold" size={20} color="#202020" />, label: "Admin", value: "2" },
  ];

  return (
    <>
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Teams</h1>
            <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage your teams and their roles</p>
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="bg-[#0063EF] flex items-center gap-[8px] h-[40px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
          >
            <span className="text-[16px] font-normal text-[#FDFDFD] tracking-[-0.32px] leading-[24px]">Invite</span>
          </button>
        </div>

        <div className="flex gap-[16px]">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]"
            >
              <div className="flex gap-[8px] items-center">
                {card.icon}
                <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{card.label}</span>
              </div>
              <span className="text-[28px] font-medium text-[#202020] tracking-[-0.56px] leading-[32px]">{card.value}</span>
            </div>
          ))}
        </div>

        <BaseTable
          title="Teams"
          columns={columns}
          data={data}
          searchPlaceholder="Search names, user id etc"
          filters={[
            {
              label: "Admin",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              searchable: true,
              searchPlaceholder: "Search role",
              options: [
                { label: "All", value: "all" },
                { label: "Super Admin", value: "super-admin" },
                { label: "Admin", value: "admin" },
                { label: "Creator", value: "creator" },
                { label: "Reviewer (Writer)", value: "reviewer-writer" },
                { label: "Reviewer (Verifier)", value: "reviewer-verifier" },
                { label: "Reviewer (Approver)", value: "reviewer-approver" },
                { label: "Contributor", value: "contributor" },
              ],
              onValueChange: (val) => {},
            },
            {
              label: "Sort",
              icon: <Sort size={20} variant="Linear" color="#606060" />,
              options: [
                { label: "Newest", value: "newest" },
                { label: "Oldest", value: "oldest" },
                { label: "A-Z", value: "az" },
              ],
              onValueChange: (val) => {},
            },
          ]}
          showDateFilter
          dateFilterInline
          showHeader={false}
          showPagination
          ignoreRowClickColumns={["actions"]}
        />
      </div>
    </>
  );
};
