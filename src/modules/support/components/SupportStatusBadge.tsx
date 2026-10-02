import React from "react";
import { cn } from "@/lib/utils";
import {
  SUPPORT_REQUEST_STATUSES,
  SUPPORT_REQUEST_STATUS_LABELS,
  type SupportRequestStatus,
} from "../types";

type StatusTone = {
  className: string;
  iconColor: string;
};

const TONES: Record<SupportRequestStatus, StatusTone> = {
  OPEN: { className: "bg-[#FFF5ED] text-[#B54708]", iconColor: "#B54708" },
  IN_PROGRESS: { className: "bg-[#F5F9FF] text-[#0A60E1]", iconColor: "#0A60E1" },
  RESOLVED: { className: "bg-[#F1F8F2] text-[#3C7E44]", iconColor: "#3C7E44" },
  CLOSED: { className: "bg-sd-grey-2 text-sd-grey-11", iconColor: "#606060" },
};

const FALLBACK_TONE: StatusTone = {
  className: "bg-sd-grey-2 text-sd-grey-11",
  iconColor: "#606060",
};

interface SupportStatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Status pill for any support request.
 *
 * `status` is accepted as a plain string on purpose: the API only documents
 * `OPEN`, so a value outside the enum is expected rather than exceptional, and an
 * unknown status renders as a neutral pill carrying its raw text instead of
 * throwing or disappearing. Widen `SUPPORT_REQUEST_STATUSES` once the enum is
 * confirmed and this picks it up automatically.
 */
export const SupportStatusBadge = ({
  status,
  className,
}: SupportStatusBadgeProps) => {
  const known = SUPPORT_REQUEST_STATUSES.includes(
    status as SupportRequestStatus,
  );
  const tone = known
    ? TONES[status as SupportRequestStatus]
    : FALLBACK_TONE;
  const label = known
    ? SUPPORT_REQUEST_STATUS_LABELS[status as SupportRequestStatus]
    : status;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-[6px] rounded-[6px] px-[8px] py-[4px]",
        tone.className,
        className,
      )}
    >
      <span
        aria-hidden
        className="size-[6px] rounded-full"
        style={{ backgroundColor: tone.iconColor }}
      />
      <span className="text-[12px] font-normal leading-[16px]">{label}</span>
    </span>
  );
};
