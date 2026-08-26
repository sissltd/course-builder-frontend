"use client";

import React from "react";
import { CloseCircle, Danger, TickCircle } from "iconsax-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { cn } from "@/lib/utils";
import type { MieRecommendation } from "../data/mockData";
import { getDifferingFields, type ComparableField } from "../utils/duplicates";
import {
  SourcePill,
  StatusPill,
  approveLabel,
  fieldValue,
  formatAbsolute,
  formatRelative,
} from "./SharedUI";

interface DuplicateCompareDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cluster: MieRecommendation[] | null;
  onApprove: (row: MieRecommendation, siblings: MieRecommendation[]) => void;
  onReject: (row: MieRecommendation) => void;
  onRejectAll: (cluster: MieRecommendation[]) => void;
}

const RANK_GLYPHS = ["①", "②", "③", "④", "⑤", "⑥"];

const COMPARE_ROWS: { field: ComparableField; label: string }[] = [
  { field: "topic", label: "Topic" },
  { field: "category", label: "Category" },
  { field: "difficultyLevel", label: "Level" },
  { field: "demandScore", label: "Demand score" },
  { field: "searchesPerMonth", label: "Searches / month" },
];

export const DuplicateCompareDrawer = ({
  isOpen,
  onOpenChange,
  cluster,
  onApprove,
  onReject,
  onRejectAll,
}: DuplicateCompareDrawerProps) => {
  if (!cluster || cluster.length < 2) return null;

  const differing = getDifferingFields(cluster);
  const resolved = cluster.filter((row) => row.status !== "pending");
  const isResolved = resolved.length > 0;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-full sm:!w-[900px] sm:!max-w-[900px]"
      contentClassName="!p-0 flex flex-col overflow-hidden"
      showCloseButton={false}
    >
      {/* Header */}
      <div className="border-b border-sd-grey-6 p-[20px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Compare similar recommendations
            </span>
            <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              {cluster.length} submissions for this topic
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-sd-grey-3 p-[6px] transition-colors hover:bg-sd-grey-1"
            aria-label="Close"
          >
            <CloseCircle variant="Linear" size={20} color="var(--sd-grey-11)" />
          </button>
        </div>
      </div>

      {/* Clash banner */}
      <div className="mx-[20px] mt-[20px] flex items-start gap-[10px] rounded-[10px] border border-l-4 border-sd-warning-bg border-l-sd-warning-text bg-sd-warning-bg p-[12px]">
        <Danger variant="Bold" size={18} color="var(--sd-warning-text)" className="mt-[1px] shrink-0" />
        <p className="text-[13px] leading-[18px] text-sd-warning-text">
          {isResolved ? (
            <>This clash has been resolved. {resolved.length} of {cluster.length} submissions
            already have a decision.</>
          ) : (
            <>
              <span className="font-semibold">{cluster.length} recommendations</span> matched on
              topic &amp; category. Approving one will automatically reject the{" "}
              {cluster.length - 1 === 1 ? "other" : `other ${cluster.length - 1}`}.
            </>
          )}
        </p>
      </div>

      {/* Side-by-side columns */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-[20px]">
        <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-[12px]">
          {cluster.map((row, index) => {
            const siblings = cluster.filter((candidate) => candidate.id !== row.id);
            const isFirst = index === 0;

            return (
              <div
                key={row.id}
                className={cn(
                  "flex flex-col rounded-[12px] border bg-sd-grey-1",
                  isFirst ? "border-sd-success/40" : "border-sd-grey-4",
                )}
              >
                {/* Column header — rank, source, timing */}
                <div
                  className={cn(
                    "flex flex-col gap-[10px] rounded-t-[12px] border-b p-[14px]",
                    isFirst
                      ? "border-sd-success/30 bg-sd-success-bg"
                      : "border-sd-grey-4 bg-sd-grey-2",
                  )}
                >
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="text-[16px] leading-[20px] text-sd-grey-11">
                      {RANK_GLYPHS[index] ?? `#${index + 1}`}
                    </span>
                    {isFirst ? (
                      <span className="rounded-[4px] bg-white px-[6px] py-[1px] text-[10px] font-semibold uppercase tracking-[0.4px] text-sd-success-text">
                        First in
                      </span>
                    ) : (
                      <StatusPill status={row.status} />
                    )}
                  </div>

                  <SourcePill source={row.source} size="md" />

                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[13px] font-medium leading-[18px] text-sd-grey-12">
                      {formatRelative(row.submittedAt)}
                    </span>
                    <span className="text-[11px] leading-[16px] text-sd-grey-11">
                      {formatAbsolute(row.submittedAt)}
                    </span>
                  </div>
                </div>

                {/* Field rows — only differing fields get the amber tint */}
                <div className="flex flex-1 flex-col divide-y divide-sd-grey-3">
                  {COMPARE_ROWS.map(({ field, label }) => (
                    <div
                      key={field}
                      className={cn(
                        "flex flex-col gap-[2px] px-[14px] py-[10px]",
                        differing.has(field) && "bg-sd-warning-bg/60",
                      )}
                    >
                      <span className="text-[11px] uppercase leading-[16px] tracking-[0.3px] text-sd-grey-11">
                        {label}
                      </span>
                      <span
                        className={cn(
                          "text-[14px] leading-[20px]",
                          differing.has(field)
                            ? "font-medium text-sd-grey-12"
                            : "text-sd-grey-11",
                        )}
                      >
                        {fieldValue(row[field])}
                      </span>
                    </div>
                  ))}

                  {row.description && (
                    <div className="flex flex-col gap-[4px] px-[14px] py-[10px]">
                      <span className="text-[11px] uppercase leading-[16px] tracking-[0.3px] text-sd-grey-11">
                        Pitch
                      </span>
                      <p className="text-[13px] leading-[18px] text-sd-grey-11">
                        {row.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Per-column actions */}
                <div className="flex flex-col gap-[8px] border-t border-sd-grey-4 p-[12px]">
                  {row.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(row, siblings)}
                        className="flex h-[36px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] bg-sd-blue text-[13px] font-medium text-white transition-colors hover:bg-sd-blue-hover"
                      >
                        <TickCircle variant="Linear" size={16} color="#FFFFFF" />
                        {approveLabel(row)}
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(row)}
                        className="flex h-[36px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-sd-grey-4 bg-white text-[13px] text-sd-grey-12 transition-colors hover:bg-sd-grey-1"
                      >
                        <CloseCircle variant="Linear" size={16} color="var(--sd-danger)" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-[4px]">
                      <StatusPill status={row.status} />
                      {row.rejectedReason && (
                        <span className="text-[11px] leading-[16px] text-sd-grey-11">
                          {row.rejectedReason}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!isResolved && (
        <div className="flex items-center justify-between gap-[12px] border-t border-sd-grey-6 p-[16px]">
          <span className="text-[13px] leading-[18px] text-sd-grey-11">
            Nothing here worth building?
          </span>
          <button
            type="button"
            onClick={() => onRejectAll(cluster)}
            className="flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[8px] border border-sd-grey-4 bg-white px-[16px] text-[14px] text-sd-grey-12 transition-colors hover:bg-sd-grey-1"
          >
            <CloseCircle variant="Linear" size={16} color="var(--sd-danger)" />
            Reject all {cluster.length}
          </button>
        </div>
      )}
    </SideDrawer>
  );
};
