"use client";

import React from "react";
import { Timer1, Data, Money } from "iconsax-react";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { BaseTable } from "@/components/shared/BaseTable";
import { ColumnDef } from "@tanstack/react-table";

interface SystemService {
  service: string;
  status: string;
  uptime: string;
  status2: string;
  priority: string;
}

const services: SystemService[] = [
  { service: "Creator Studio", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "API Gateway", status: "Degraded", uptime: "99.9%", status2: "Degraded", priority: "Medium" },
  { service: "Database Cluster", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "Auth Service", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "Storage Service", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "Search Index", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "Media Transcoder", status: "Degraded", uptime: "99.9%", status2: "Degraded", priority: "Medium" },
  { service: "Notification Queue", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "CDN Edge", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
  { service: "Analytics Pipeline", status: "Operational", uptime: "99.9%", status2: "Operational", priority: "Low" },
];

const statusStyle = (val: string) => {
  if (val === "Operational") return "text-[#008500]";
  if (val === "Degraded") return "text-[#FF6B00]";
  return "text-[#606060]";
};

const columns: ColumnDef<SystemService>[] = [
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.service}</span>
    ),
    size: 265,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`text-[14px] font-normal tracking-[-0.28px] leading-[20px] ${statusStyle(row.original.status)}`}>
        {row.original.status}
      </span>
    ),
    size: 191,
  },
  {
    accessorKey: "uptime",
    header: "Up Time",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.uptime}</span>
    ),
    size: 139,
  },
  {
    accessorKey: "status2",
    header: "Status",
    cell: ({ row }) => (
      <span className={`text-[14px] font-normal tracking-[-0.28px] leading-[20px] ${statusStyle(row.original.status2)}`}>
        {row.original.status2}
      </span>
    ),
    size: 139,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px]">
        <div className={`size-[8px] rounded-full ${
          row.original.priority === "Critical" ? "bg-[#D54800]" :
          row.original.priority === "High" ? "bg-[#FF8A00]" :
          row.original.priority === "Medium" ? "bg-[#FF8A00]" : "bg-[#B6B6B6]"
        }`} />
        <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.priority}</span>
      </div>
    ),
    size: 100,
  },
];

export const SystemHealthView = () => {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Overall Uptime"
          value="203"
          trend="Last 30 days"
        />
        <AdminStatCard
          icon={<Data variant="Bold" size={20} color="#202020" />}
          label="AVG API Latency"
          value="56ms"
          trend="+24 since 7 days"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Incidents Today"
          value="2"
          trend="Degraded"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="MTTR"
          value="$1,500"
          trend="4hr Recover Time"
        />
      </div>

      <BaseTable
        title="Overall Uptime"
        columns={columns}
        data={services}
        showHeader={false}
        showPagination
      />
    </div>
  );
};
