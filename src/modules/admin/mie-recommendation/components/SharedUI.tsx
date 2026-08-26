"use client";

import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ArrowDown2, ArrowUp2, Danger, MagicStar } from "iconsax-react";
import type { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  colorForCurator,
  type MieRecommendation,
  type RecommendationSource,
  type RecommendationStatus,
} from "../data/mockData";

/* ─────────────────────────── Source ─────────────────────────── */

export const SourcePill = ({
  source,
  size = "sm",
}: {
  source: RecommendationSource;
  size?: "sm" | "md";
}) => {
  if (source.kind === "ai") {
    return (
      <span
        className={cn(
          "inline-flex w-fit items-center gap-[6px] rounded-[8px] bg-sd-blue-light px-[8px] py-[4px] font-medium text-sd-blue",
          size === "sm" ? "text-[12px] leading-[16px]" : "text-[14px] leading-[20px]",
        )}
      >
        <MagicStar variant="Bold" size={size === "sm" ? 14 : 16} color="var(--sd-blue)" />
        AI Engine
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-[8px]">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-medium text-white",
          size === "sm" ? "size-[24px] text-[12px]" : "size-[32px] text-[14px]",
        )}
        style={{ backgroundColor: colorForCurator(source.name) }}
      >
        {source.initials}
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "whitespace-nowrap text-sd-grey-12",
            size === "sm" ? "text-[14px] leading-[20px]" : "text-[14px] font-medium leading-[20px]",
          )}
        >
          {source.name}
        </span>
        {size === "md" && (
          <span className="text-[12px] leading-[16px] text-sd-grey-11">Curator</span>
        )}
      </span>
    </span>
  );
};

export const sourceLabel = (source: RecommendationSource) =>
  source.kind === "ai" ? "AI Engine" : source.name;

/* ─────────────────────────── Status ─────────────────────────── */

const statusStyles: Record<RecommendationStatus, { className: string; label: string }> = {
  pending: { className: "bg-sd-warning-bg text-sd-warning-text", label: "Pending" },
  approved: { className: "bg-sd-success-bg text-sd-success-text", label: "Approved" },
  rejected: { className: "bg-sd-danger-soft text-sd-danger", label: "Rejected" },
};

export const StatusPill = ({ status }: { status: RecommendationStatus }) => {
  const { className, label } = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-[8px] px-[10px] py-[4px] text-[12px] font-medium leading-[16px]",
        className,
      )}
    >
      {label}
    </span>
  );
};

/* ───────────────────────── Duplicates ───────────────────────── */

export const DuplicateChip = ({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={(event) => {
      // The row itself opens the details drawer — keep the chip's job separate.
      event.stopPropagation();
      onClick();
    }}
    className="inline-flex w-fit cursor-pointer items-center gap-[4px] rounded-[6px] bg-sd-warning-bg px-[6px] py-[2px] text-[11px] font-medium leading-[16px] text-sd-warning-text transition-colors hover:brightness-95"
    title={`This topic clashes with ${count - 1} other recommendation${count - 1 === 1 ? "" : "s"} — click to compare`}
  >
    <Danger variant="Bold" size={12} color="var(--sd-warning-text)" />
    {count - 1} similar
  </button>
);

export const FirstInBadge = () => (
  <span
    className="inline-flex w-fit items-center rounded-[4px] bg-sd-success-bg px-[6px] py-[1px] text-[10px] font-semibold uppercase leading-[14px] tracking-[0.4px] text-sd-success-text"
    title="Earliest submission in this duplicate cluster"
  >
    First in
  </span>
);

/* ───────────────────────── Timestamps ──────────────────────── */

export const formatAbsolute = (iso: string) => format(parseISO(iso), "dd MMM yyyy, HH:mm");

export const formatRelative = (iso: string) =>
  `${formatDistanceToNow(parseISO(iso))} ago`;

export const SubmittedCell = ({
  submittedAt,
  firstIn,
}: {
  submittedAt: string;
  firstIn?: boolean;
}) => (
  <span className="flex flex-col gap-[2px]" title={formatAbsolute(submittedAt)}>
    <span className="whitespace-nowrap text-[14px] leading-[20px] text-sd-grey-11">
      {formatRelative(submittedAt)}
    </span>
    {firstIn && <FirstInBadge />}
  </span>
);

/* ─────────────────────── Sortable header ───────────────────── */

export const SortableHeader = <TData,>({
  column,
  label,
}: {
  column: Column<TData, unknown>;
  label: string;
}) => {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="inline-flex cursor-pointer items-center gap-[4px] text-[14px] font-semibold tracking-[-0.28px] text-sd-muted-text transition-colors hover:text-sd-grey-11"
    >
      {label}
      {sorted === "desc" ? (
        <ArrowDown2 variant="Linear" size={14} color="currentColor" />
      ) : (
        <ArrowUp2
          variant="Linear"
          size={14}
          color="currentColor"
          className={cn(!sorted && "opacity-40")}
        />
      )}
    </button>
  );
};

/* ──────────────────────────── Misc ─────────────────────────── */

export const EmptyValue = () => <span className="text-sd-muted-text">—</span>;

/** Renders a field value, falling back to an em dash for un-enriched proposals. */
export const fieldValue = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? <EmptyValue /> : value;

export const approveLabel = (row: MieRecommendation) =>
  row.source.kind === "curator" ? "Approve topic" : "Approve";
