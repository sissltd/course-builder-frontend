"use client";

import React from "react";
import { format } from "date-fns";
import {
  More,
  TickCircle,
  CloseCircle,
  Eye,
  DollarCircle,
  Chart,
  Calendar2,
} from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { paletteForCategory } from "@/modules/admin/courses/data/categoryColors";
import { SubmissionStatus, type MieSubmission } from "../types";
import {
  SubmissionStatusPill,
  ReferenceChip,
  PayoutBypassChip,
} from "./SharedUI";
import { formatEarnings } from "../utils/format";
import { getSubmissionCategory } from "../utils/category";

interface MieSubmissionCardProps {
  submission: MieSubmission;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const MieSubmissionCard = ({
  submission,
  onOpen,
  onApprove,
  onReject,
}: MieSubmissionCardProps) => {
  const category = getSubmissionCategory(submission);
  const palette = paletteForCategory(category);

  const canApprove = submission.status !== SubmissionStatus.APPROVED;
  const canReject = submission.status !== SubmissionStatus.REJECTED;

  const initials = submission.developer_email
    ? submission.developer_email.slice(0, 2).toUpperCase()
    : "DEV";

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={onOpen}
      className={cn(
        "group flex flex-col justify-between rounded-[8px] border p-[18px] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer",
        palette.card
      )}
    >
      <div className="flex flex-col gap-[14px]">
        {/* Top Status & Menu */}
        <div className="flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[8px] flex-wrap">
            <SubmissionStatusPill status={submission.status} />
            <span
              className={cn(
                "rounded-[6px] px-[8px] py-[3px] text-[11px] font-medium border border-black/5 shadow-xs",
                palette.chip
              )}
            >
              {category}
            </span>
          </div>

          <div onClick={stop}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Submission actions"
                  className="flex size-[28px] items-center justify-center rounded-full text-sd-grey-11 transition-colors hover:bg-black/5 hover:text-sd-grey-12 cursor-pointer"
                >
                  <More size={18} variant="Linear" color="currentColor" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px] p-[4px] bg-white border border-sd-grey-3 rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
              >
                <DropdownMenuItem
                  onClick={onOpen}
                  className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
                >
                  <Eye size={16} variant="Linear" color="currentColor" />
                  <span>View details</span>
                </DropdownMenuItem>
                {canApprove && (
                  <DropdownMenuItem
                    onClick={onApprove}
                    className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#3C7E44] hover:bg-emerald-50 rounded-[6px] cursor-pointer"
                  >
                    <TickCircle size={16} variant="Linear" color="#3C7E44" />
                    <span>Approve</span>
                  </DropdownMenuItem>
                )}
                {canReject && (
                  <DropdownMenuItem
                    onClick={onReject}
                    className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-red-50 rounded-[6px] cursor-pointer"
                  >
                    <CloseCircle size={16} variant="Linear" color="#D54800" />
                    <span>Reject</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title & Reference */}
        <div className="flex flex-col gap-[6px]">
          <h3
            className={cn(
              "line-clamp-2 text-[15px] font-semibold leading-[22px]",
              palette.title
            )}
          >
            {submission.title}
          </h3>
          <div onClick={stop}>
            <ReferenceChip reference={submission.reference} />
          </div>
        </div>

        {/* Demand & Financial Signals */}
        <div className="flex flex-wrap items-center gap-[8px] pt-[2px]">
          <div
            className={cn(
              "flex items-center gap-[6px] rounded-[6px] px-[8px] py-[4px] border border-black/5",
              palette.chip
            )}
          >
            <Chart size={14} variant="Linear" color="currentColor" />
            <span className="text-[12px]">
              Demand:{" "}
              <strong>
                {submission.demand_score !== null
                  ? `${submission.demand_score}/100`
                  : "—"}
              </strong>
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-[6px] rounded-[6px] px-[8px] py-[4px] border border-black/5",
              palette.chip
            )}
          >
            <DollarCircle size={14} variant="Linear" color="currentColor" />
            <span className="text-[12px]">
              Est:{" "}
              <strong>
                {formatEarnings(submission.estimated_monthly_earnings)}
              </strong>
            </span>
          </div>

          <PayoutBypassChip active={submission.payout_bypass} />
        </div>
      </div>

      {/* Bottom Row: Developer info & arrival date */}
      <div
        className={cn(
          "mt-[16px] flex items-center justify-between border-t pt-[12px] text-[12px]",
          palette.divider
        )}
      >
        <div className="flex min-w-0 items-center gap-[8px]">
          <div
            className={cn(
              "flex size-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold border border-black/5 shadow-xs",
              palette.chip
            )}
          >
            {initials}
          </div>
          <span
            className={cn("truncate font-medium", palette.body)}
            title={submission.developer_email}
          >
            {submission.developer_email}
          </span>
        </div>

        <div className={cn("flex items-center gap-[4px] shrink-0", palette.body)}>
          <Calendar2 size={14} variant="Linear" color="currentColor" />
          <span>
            {submission.created_datetime
              ? format(new Date(submission.created_datetime), "dd MMM yyyy")
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};
