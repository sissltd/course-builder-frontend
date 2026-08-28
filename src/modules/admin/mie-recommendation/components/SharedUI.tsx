"use client";

import React from "react";
import type { Column } from "@tanstack/react-table";
import {
  ArrowDown2,
  ArrowUp2,
  Copy,
  TickCircle,
} from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  DeveloperAccountStatus,
  MiePlanType,
  SubmissionStatus,
} from "../types";
import {
  developerStatusLabels,
  formatAbsolute,
  formatRelative,
  planTypeLabels,
  referenceSuffixHint,
  submissionStatusHints,
  submissionStatusLabels,
} from "../utils/format";

/* ─────────────────────────── Submission status ─────────────────────────── */

/**
 * Deliberately *not* a two-state green/red map. The three dedup states are
 * short-circuits rather than decisions, and APPROVED/REJECTED are both
 * reversible — so nothing here is styled as terminal.
 */
const submissionStatusStyles: Record<SubmissionStatus, string> = {
  [SubmissionStatus.PENDING_REVIEW]: "bg-sd-warning-bg text-sd-warning-text",
  [SubmissionStatus.DUPLICATE_IN_QUEUE]: "bg-sd-purple-bg text-sd-purple-text",
  [SubmissionStatus.DUPLICATE_EXISTING]: "bg-sd-purple-bg text-sd-purple-text",
  [SubmissionStatus.PREVIOUSLY_REJECTED]: "bg-sd-grey-3 text-sd-grey-11",
  [SubmissionStatus.APPROVED]: "bg-sd-success-bg text-sd-success-text",
  [SubmissionStatus.REJECTED]: "bg-sd-danger-soft text-sd-danger",
};

export const SubmissionStatusPill = ({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) => (
  <span
    title={submissionStatusHints[status]}
    className={cn(
      "inline-flex w-fit items-center whitespace-nowrap rounded-[8px] px-[10px] py-[4px] text-[12px] font-medium leading-[16px]",
      submissionStatusStyles[status] ?? "bg-sd-grey-3 text-sd-grey-11",
      className,
    )}
  >
    {submissionStatusLabels[status] ?? status}
  </span>
);

/* ─────────────────────────── Developer status ─────────────────────────── */

const developerStatusStyles: Record<DeveloperAccountStatus, string> = {
  [DeveloperAccountStatus.PENDING]: "bg-sd-warning-bg text-sd-warning-text",
  [DeveloperAccountStatus.APPROVED]: "bg-sd-success-bg text-sd-success-text",
  [DeveloperAccountStatus.REJECTED]: "bg-sd-danger-soft text-sd-danger",
  [DeveloperAccountStatus.SUSPENDED]: "bg-sd-grey-3 text-sd-grey-11",
};

export const DeveloperStatusPill = ({
  status,
}: {
  status: DeveloperAccountStatus;
}) => (
  <span
    className={cn(
      "inline-flex w-fit items-center whitespace-nowrap rounded-[8px] px-[10px] py-[4px] text-[12px] font-medium leading-[16px]",
      developerStatusStyles[status] ?? "bg-sd-grey-3 text-sd-grey-11",
    )}
  >
    {developerStatusLabels[status] ?? status}
  </span>
);

/* ────────────────────────────── Plan type ────────────────────────────── */

export const PlanPill = ({ plan }: { plan: MiePlanType }) => (
  <span
    className={cn(
      "inline-flex w-fit items-center whitespace-nowrap rounded-[6px] border px-[8px] py-[3px] text-[12px] font-medium leading-[16px]",
      plan === MiePlanType.PAID_PER_SUBMISSION
        ? "border-sd-blue-light bg-sd-blue-light text-sd-blue"
        : "border-sd-grey-4 bg-sd-grey-2 text-sd-grey-11",
    )}
  >
    {planTypeLabels[plan] ?? plan}
  </span>
);

/** Per-idea no-payout marker — distinct from the developer's account plan. */
export const PayoutBypassChip = ({ active }: { active: boolean }) =>
  active ? (
    <span
      className="inline-flex w-fit items-center whitespace-nowrap rounded-[6px] bg-sd-warning-bg px-[8px] py-[3px] text-[12px] font-medium leading-[16px] text-sd-warning-text"
      title="This specific idea is marked no-payout. The creator will not be paid for it."
    >
      No payout
    </span>
  ) : (
    <span className="text-[13px] leading-[18px] text-sd-muted-text">Paying</span>
  );

/* ──────────────────────────── Copy affordance ──────────────────────────── */

export const CopyButton = ({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard is unavailable outside a secure context — the value stays
      // selectable on screen, so there is nothing useful to report here.
      return;
    }
    setCopied(true);
  };

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        void copy();
      }}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-[4px] rounded-[6px] border border-sd-grey-3 bg-white px-[8px] py-[3px] text-[12px] leading-[16px] text-sd-grey-11 transition-colors hover:bg-sd-grey-2",
        className,
      )}
      aria-label={label}
    >
      {copied ? (
        <TickCircle variant="Bold" size={13} color="var(--sd-success)" />
      ) : (
        <Copy variant="Linear" size={13} color="var(--sd-grey-11)" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
};

/** The correlation key operators and developers quote at each other. */
export const ReferenceChip = ({ reference }: { reference: string }) => (
  <span className="inline-flex items-center gap-[6px]">
    <span
      className="whitespace-nowrap font-mono text-[13px] leading-[18px] text-sd-grey-12"
      title={referenceSuffixHint(reference)}
    >
      {reference}
    </span>
    <CopyButton value={reference} label="Copy" className="px-[6px]" />
  </span>
);

/* ──────────────────────────── Layout helpers ──────────────────────────── */

export const DetailRow = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-[16px]">
    <span
      className="shrink-0 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11"
      title={hint}
    >
      {label}
    </span>
    <span className="min-w-0 break-words text-right text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-12">
      {children}
    </span>
  </div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
    {children}
  </span>
);

export const TimestampCell = ({ iso }: { iso: string | null | undefined }) => (
  <span className="flex flex-col gap-[2px]" title={formatAbsolute(iso)}>
    <span className="whitespace-nowrap text-[14px] leading-[20px] text-sd-grey-11">
      {formatRelative(iso)}
    </span>
  </span>
);

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

export const EmptyValue = () => <span className="text-sd-muted-text">—</span>;

export const fieldValue = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? <EmptyValue /> : value;

/** Small inline callout used for reversibility notes and short-circuit hints. */
export const Callout = ({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  children: React.ReactNode;
}) => {
  const tones = {
    info: "border-sd-blue-light bg-sd-blue-light text-sd-blue",
    warning: "border-sd-warning-bg bg-sd-warning-bg text-sd-warning-text",
    danger: "border-sd-danger-soft bg-sd-danger-soft text-sd-danger",
    success: "border-sd-success-bg bg-sd-success-bg text-sd-success-text",
  } as const;

  return (
    <div className={cn("rounded-[10px] border p-[12px]", tones[tone])}>
      <p className="text-[13px] leading-[18px]">{children}</p>
    </div>
  );
};
