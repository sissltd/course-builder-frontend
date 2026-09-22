"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowDown2 } from "iconsax-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetReviewerActivityOverviewQuery } from "../hooks";
import type { ReviewerPeriod } from "../types";

const PERIOD_OPTIONS: { label: string; value: ReviewerPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "All time", value: "all_time" },
];

function parseLocalDate(dateStr: string): Date {
  if (dateStr.includes("T")) {
    return new Date(dateStr);
  }
  return new Date(`${dateStr}T00:00:00`);
}

function formatXAxis(dateStr: string, period: ReviewerPeriod): string {
  try {
    const d = parseLocalDate(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    if (period === "this_week") {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (period === "today") {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    const d = parseLocalDate(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      displayDate: string;
      date: string;
      escalated: number;
      approved: number;
      rejected: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const datum = payload[0]?.payload;
  if (!datum) return null;

  return (
    <div className="z-20 min-w-[170px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] py-[10px] shadow-[0px_12px_32px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between gap-[8px] border-b border-sd-grey-3 pb-[6px]">
        <span className="text-[13px] font-medium text-sd-grey-12 leading-[18px]">
          {datum.displayDate}
        </span>
        <span className="text-[11px] font-normal text-sd-reviewer-muted leading-[16px]">
          Activity
        </span>
      </div>

      <div className="mt-[8px] flex flex-col gap-[6px]">
        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[8px]">
            <span className="size-[6px] rounded-full bg-sd-blue-dark" />
            <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
              Escalated
            </span>
          </div>
          <span className="text-[12px] font-medium text-sd-grey-12 leading-[16px]">
            {datum.escalated}
          </span>
        </div>

        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[8px]">
            <span className="size-[6px] rounded-full bg-sd-reviewer-purple" />
            <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
              Approved
            </span>
          </div>
          <span className="text-[12px] font-medium text-sd-grey-12 leading-[16px]">
            {datum.approved}
          </span>
        </div>

        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[8px]">
            <span className="size-[6px] rounded-full bg-sd-reviewer-rejected" />
            <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
              Rejected
            </span>
          </div>
          <span className="text-[12px] font-medium text-sd-grey-12 leading-[16px]">
            {datum.rejected}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ReviewerActivityOverview = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ReviewerPeriod>("this_week");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading } = useGetReviewerActivityOverviewQuery(selectedPeriod);

  const selectedOption = PERIOD_OPTIONS.find((opt) => opt.value === selectedPeriod);

  const chartData = useMemo(() => {
    if (!data?.series || data.series.length === 0) {
      return [];
    }
    return data.series.map((item) => ({
      ...item,
      label: formatXAxis(item.date, selectedPeriod),
      displayDate: formatTooltipDate(item.date),
    }));
  }, [data?.series, selectedPeriod]);

  return (
    <section className="relative flex flex-col justify-between min-h-[296px] w-full rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 overflow-hidden px-[18px] py-[21px]">
      <div className="flex items-start justify-between gap-[16px]">
        <h2 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
          Activity Overview
        </h2>

        <div className="flex items-center gap-[10px]">
          <div className="hidden md:flex items-center gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <span className="size-[6px] rounded-full bg-sd-blue-dark" />
              <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                Escalated
                {data?.totals && (
                  <span className="ml-[4px] font-medium text-sd-grey-12">
                    ({data.totals.escalated})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="size-[6px] rounded-full bg-sd-reviewer-purple" />
              <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                Approved
                {data?.totals && (
                  <span className="ml-[4px] font-medium text-sd-grey-12">
                    ({data.totals.approved})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="size-[6px] rounded-full bg-sd-reviewer-rejected" />
              <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                Rejected
                {data?.totals && (
                  <span className="ml-[4px] font-medium text-sd-grey-12">
                    ({data.totals.rejected})
                  </span>
                )}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-[40px] items-center gap-[6px] rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[10px] py-[10px] cursor-pointer focus-visible:outline-none">
                <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px]">
                  {selectedOption?.label || "This Week"}
                </span>
                <ArrowDown2 variant="Linear" size={16} color="var(--sd-reviewer-muted)" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[140px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[6px] shadow-[0px_4px_24px_rgba(0,0,0,0.06)]"
            >
              {PERIOD_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={cn(
                    "flex w-full cursor-pointer select-none items-center rounded-[8px] px-[12px] py-[8px] text-[14px] leading-[20px] outline-none",
                    selectedPeriod === option.value
                      ? "bg-sd-grey-3 text-sd-grey-12 font-medium"
                      : "text-sd-reviewer-muted",
                  )}
                  onClick={() => setSelectedPeriod(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-[20px] h-[195px] w-full">
        {isLoading || !isMounted ? (
          <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-sd-grey-2/50 animate-pulse">
            <span className="text-[13px] text-sd-reviewer-muted">
              Loading activity chart...
            </span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center rounded-[8px] border border-dashed border-sd-grey-3 bg-sd-grey-2/30">
            <span className="text-[13px] text-sd-reviewer-muted">
              No activity recorded for this period
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -22, bottom: 5 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--sd-grey-4, #E8E8E8)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "var(--sd-grey-4, #E8E8E8)" }}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#949596" }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#949596" }}
                allowDecimals={false}
                domain={[0, (dataMax: number) => Math.max(dataMax, 5)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="escalated"
                name="Escalated"
                stroke="#0A60E1"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0A60E1", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#0A60E1" }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                name="Approved"
                stroke="#9747FF"
                strokeWidth={2}
                dot={{ r: 3, fill: "#9747FF", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#9747FF" }}
              />
              <Line
                type="monotone"
                dataKey="rejected"
                name="Rejected"
                stroke="#FFBA95"
                strokeWidth={2}
                dot={{ r: 3, fill: "#FFBA95", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#FFBA95" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};
