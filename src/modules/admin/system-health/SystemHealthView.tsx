"use client";

import React from "react";
import { Timer1, Data, Warning2, Clock, Refresh2 } from "iconsax-react";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { BaseTable } from "@/components/shared/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetAdminSystemHealthQuery, SystemServiceItem } from "@/redux/slices/adminApi";

const statusBadge = (status: string | null | undefined) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium bg-[#F0F0F0] text-[#707070]">
        No Data
      </span>
    );
  }
  const s = status.toUpperCase();
  if (s === "OPERATIONAL") {
    return (
      <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium bg-[#E7F7EC] text-[#008500]">
        Operational
      </span>
    );
  }
  if (s === "DEGRADED") {
    return (
      <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium bg-[#FFF3E0] text-[#FF6B00]">
        Degraded
      </span>
    );
  }
  if (s === "DOWN") {
    return (
      <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium bg-[#FDE8E8] text-[#E02424]">
        Down
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium bg-[#F5F5F5] text-[#606060]">
      {status}
    </span>
  );
};

const priorityDot = (priority: string) => {
  const p = priority?.toUpperCase();
  if (p === "CRITICAL") return "bg-[#D54800]";
  if (p === "HIGH") return "bg-[#FF5025]";
  if (p === "MEDIUM") return "bg-[#FF8A00]";
  return "bg-[#A0A0A0]";
};

const columns: ColumnDef<SystemServiceItem>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: ({ row }) => (
      <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">
        {row.original.name}
      </span>
    ),
    size: 240,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => statusBadge(row.original.status),
    size: 160,
  },
  {
    accessorKey: "uptime_percent",
    header: "Up Time",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">
        {row.original.uptime_percent != null ? `${row.original.uptime_percent}%` : "—"}
      </span>
    ),
    size: 130,
  },
  {
    accessorKey: "avg_latency_ms",
    header: "Latency",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">
        {row.original.avg_latency_ms != null ? `${row.original.avg_latency_ms}ms` : "—"}
      </span>
    ),
    size: 130,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px]">
        <div className={`size-[8px] rounded-full ${priorityDot(row.original.priority)}`} />
        <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px] capitalize">
          {row.original.priority?.toLowerCase()}
        </span>
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "sample_count",
    header: "Samples",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
        {row.original.sample_count != null ? row.original.sample_count.toLocaleString() : "0"}
      </span>
    ),
    size: 100,
  },
];

export const SystemHealthView = () => {
  const { data, isLoading, isError, refetch } = useGetAdminSystemHealthQuery();

  const services = data?.services || [];

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <h2 className="text-[18px] font-semibold text-[#202020] tracking-[-0.36px]">
            System Health &amp; Services
          </h2>
          {data?.window_days && (
            <span className="text-[12px] bg-[#F2F4F7] text-[#667085] px-[8px] py-[2px] rounded-full font-medium">
              {data.window_days}-day rolling window
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] text-[#0A60E1] bg-[#EBF3FF] hover:bg-[#D9E9FF] rounded-[6px] cursor-pointer transition-colors"
        >
          <Refresh2 size={16} />
          <span>Refresh Status</span>
        </button>
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Overall Uptime"
          value={
            isLoading
              ? "..."
              : data?.overall_uptime_percent != null
              ? `${data.overall_uptime_percent}%`
              : "—"
          }
          trend={`Last ${data?.window_days ?? 30} days`}
        />
        <AdminStatCard
          icon={<Data variant="Bold" size={20} color="#202020" />}
          label="AVG API Latency"
          value={
            isLoading
              ? "..."
              : data?.avg_api_latency_ms != null
              ? `${data.avg_api_latency_ms}ms`
              : "—"
          }
          trend="Window average"
        />
        <AdminStatCard
          icon={<Warning2 variant="Bold" size={20} color="#202020" />}
          label="Down / Degraded"
          value={
            isLoading
              ? "..."
              : data
              ? `${data.down_count} Down`
              : "—"
          }
          trend={
            data
              ? `${data.degraded_count} Degraded services`
              : "—"
          }
        />
        <AdminStatCard
          icon={<Clock variant="Bold" size={20} color="#202020" />}
          label="MTTR (Recovery)"
          value={
            isLoading
              ? "..."
              : data?.avg_recovery_seconds != null
              ? `${Math.round(data.avg_recovery_seconds / 60)} min`
              : "—"
          }
          trend="Average recovery time"
        />
      </div>

      {isLoading ? (
        <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[32px] flex flex-col items-center justify-center gap-[12px] animate-pulse">
          <div className="h-[20px] w-[200px] bg-[#EAEAEA] rounded" />
          <div className="h-[14px] w-[320px] bg-[#F0F0F0] rounded" />
        </div>
      ) : (
        <BaseTable
          title="Service Health Samples"
          columns={columns}
          data={services}
          showHeader={false}
          showPagination
        />
      )}
    </div>
  );
};
