import React from "react";
import { cn } from "@/lib/utils";
import {
  SUPPORT_REQUEST_KIND_LABELS,
  SUPPORT_REQUEST_KINDS,
  type SupportRequestKind,
} from "../types";

const TONES: Record<SupportRequestKind, string> = {
  TICKET: "bg-[#F5F9FF] text-[#0A60E1]",
  APPEAL: "bg-[#F5EEFC] text-[#8A38F5]",
};

interface SupportKindBadgeProps {
  kind: string;
  className?: string;
}

/**
 * Ticket-vs-appeal pill. Like the status badge this takes a plain string so an
 * unrecognised `kind` renders with its raw text rather than breaking the row.
 */
export const SupportKindBadge = ({ kind, className }: SupportKindBadgeProps) => {
  const known = SUPPORT_REQUEST_KINDS.includes(kind as SupportRequestKind);
  const tone = known ? TONES[kind as SupportRequestKind] : "bg-sd-grey-2 text-sd-grey-11";
  const label = known
    ? SUPPORT_REQUEST_KIND_LABELS[kind as SupportRequestKind]
    : kind;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[6px] px-[8px] py-[4px]",
        tone,
        className,
      )}
    >
      <span className="text-[12px] font-normal leading-[16px]">{label}</span>
    </span>
  );
};
