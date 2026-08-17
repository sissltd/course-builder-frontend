"use client";

import React, { useRef, useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const yAxisLabels = ["250", "200", "150", "100", "50"];
const xAxisLabels = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
const legendItems = [
  { label: "Escalated", className: "bg-sd-blue-dark" },
  { label: "Approved", className: "bg-sd-reviewer-purple" },
  { label: "Rejected", className: "bg-sd-reviewer-rejected" },
];

const chartSeries = [
  {
    name: "approved",
    className: "bg-sd-reviewer-purple",
    points: [
      [0, 138],
      [94, 82],
      [170, 101],
      [243, 62],
      [316, 101],
      [389, 110],
      [474, 96],
    ],
  },
  {
    name: "escalated",
    className: "bg-sd-blue-dark",
    points: [
      [0, 138],
      [26, 99],
      [100, 1],
      [163, 37],
      [233, 48],
      [314, 37],
      [390, 83],
      [477, 43],
    ],
  },
  {
    name: "rejected",
    className: "bg-sd-reviewer-rejected",
    points: [
      [0, 138],
      [65, 119],
      [98, 111],
      [170, 120],
      [219, 8],
      [316, 63],
      [377, 8],
      [468, 76],
    ],
  },
];

const chartTooltipData = [
  { day: "Mon", escalated: 0, approved: 0, rejected: 0 },
  { day: "Tue", escalated: 200, approved: 85, rejected: 50 },
  { day: "Wed", escalated: 150, approved: 65, rejected: 40 },
  { day: "Thur", escalated: 135, approved: 120, rejected: 190 },
  { day: "Fri", escalated: 150, approved: 60, rejected: 120 },
  { day: "Sat", escalated: 90, approved: 50, rejected: 190 },
  { day: "Sun", escalated: 142, approved: 70, rejected: 95 },
];

const CHART_WIDTH = 477;
const CHART_HEIGHT = 140;
const TOOLTIP_WIDTH = 184;

interface ChartLineSegmentProps {
  from: number[];
  to: number[];
  className: string;
}

const ChartLineSegment = ({ from, to, className }: ChartLineSegmentProps) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <span
      className={cn("absolute h-[1.5px] origin-left rounded-full", className)}
      style={{
        left: `${(x1 / CHART_WIDTH) * 100}%`,
        top: `${(y1 / CHART_HEIGHT) * 100}%`,
        width: `${(length / CHART_WIDTH) * 100}%`,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

export const ReviewerActivityOverview = () => {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [hoverState, setHoverState] = useState<{ index: number; left: number } | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const activeDatum = hoverState ? chartTooltipData[hoverState.index] : null;
  const tooltipLeft = hoverState?.left ?? 0;

  const handleChartMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const rawIndex = Math.max(
      0,
      Math.min(
        chartTooltipData.length - 1,
        Math.round((x / rect.width) * (chartTooltipData.length - 1)),
      ),
    );

    const anchorX = (rawIndex / (chartTooltipData.length - 1)) * rect.width;
    const tooltipLeft = Math.max(
      12 + TOOLTIP_WIDTH / 2,
      Math.min(rect.width - 12 - TOOLTIP_WIDTH / 2, anchorX),
    );

    setHoverState({ index: rawIndex, left: tooltipLeft });
  };

  return (
    <section className="relative min-h-[296px] w-full rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 overflow-hidden px-[18px] py-[21px]">
      <div className="flex items-start justify-between gap-[16px]">
        <h2 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
          Activity Overview
        </h2>

        <div className="flex items-center gap-[10px]">
          <div className="hidden md:flex items-center gap-[10px]">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-[8px]">
                <span className={`size-[4px] rounded-full ${item.className}`} />
                <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-[40px] items-center gap-[6px] rounded-[8px] border border-sd-grey-4 px-[10px] py-[10px] cursor-pointer focus-visible:outline-none">
                <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px]">
                  {selectedTimeframe}
                </span>
                <ArrowDown2 variant="Linear" size={16} color="var(--sd-reviewer-muted)" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[140px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[6px] shadow-[0px_4px_24px_rgba(0,0,0,0.06)]"
            >
              {["All time", "Today", "This Week", "This month"].map((option) => (
                <DropdownMenuItem
                  key={option}
                  className={cn(
                    "flex w-full cursor-pointer select-none items-center rounded-[8px] px-[12px] py-[8px] text-[14px] leading-[20px] outline-none",
                    selectedTimeframe === option
                      ? "bg-sd-grey-3 text-sd-grey-12"
                      : "text-sd-reviewer-muted",
                  )}
                  onClick={() => setSelectedTimeframe(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-[27px] grid grid-cols-[57px_minmax(0,1fr)] gap-[16px]">
        <div className="flex h-[178px] flex-col justify-between">
          {yAxisLabels.map((label) => (
            <div key={label} className="flex items-center gap-[8px]">
              <span className="w-[57px] text-right text-[12px] font-normal text-sd-reviewer-axis leading-[16px]">
                {label}
              </span>
              <span className="h-px w-[4px] bg-sd-grey-4" />
            </div>
          ))}
        </div>

        <div className="min-w-0">
          <div
            ref={plotRef}
            onMouseMove={handleChartMove}
            onMouseLeave={() => setHoverState(null)}
            className="relative h-[178px] border-l border-b border-sd-grey-4"
          >
            {activeDatum && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-px border-l border-dashed border-sd-grey-6"
                  style={{
                    left: `${tooltipLeft}px`,
                  }}
                />
                <div
                  className="pointer-events-none absolute z-20 rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] py-[10px] shadow-[0px_12px_32px_rgba(0,0,0,0.12)]"
                  style={{
                    left: `${tooltipLeft}px`,
                    top: "18px",
                    width: `${TOOLTIP_WIDTH}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="text-[14px] font-medium text-sd-grey-12 leading-[20px]">
                      {activeDatum.day}
                    </span>
                    <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                      Hover details
                    </span>
                  </div>

                  <div className="mt-[8px] flex flex-col gap-[6px]">
                    {[
                      { label: "Escalated", value: activeDatum.escalated, dot: "bg-sd-blue-dark" },
                      { label: "Approved", value: activeDatum.approved, dot: "bg-sd-reviewer-purple" },
                      { label: "Rejected", value: activeDatum.rejected, dot: "bg-sd-reviewer-rejected" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-[16px]">
                        <div className="flex items-center gap-[8px]">
                          <span className={cn("size-[6px] rounded-full", item.dot)} />
                          <span className="text-[12px] font-normal text-sd-reviewer-muted leading-[16px]">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[12px] font-medium text-sd-grey-12 leading-[16px]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="absolute bottom-0 left-0 h-[140px] w-full max-w-[477px]">
              {chartSeries.map((series) => (
                <React.Fragment key={series.name}>
                  {series.points.slice(0, -1).map((point, index) => (
                    <ChartLineSegment
                      key={`${series.name}-${index}`}
                      from={point}
                      to={series.points[index + 1]}
                      className={series.className}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-[6px] grid max-w-[486px] grid-cols-7 gap-[16px]">
            {xAxisLabels.map((label) => (
              <div key={label} className="flex flex-col items-center gap-[6px]">
                <span className="h-[4px] w-px bg-sd-grey-4" />
                <span className="text-center text-[12px] font-normal text-sd-reviewer-axis leading-[16px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
