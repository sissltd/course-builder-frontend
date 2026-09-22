"use client";

import React from "react";
import { ArrowRight2 } from "iconsax-react";
import { X } from "lucide-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { useGetMieSubmissionQuery } from "../hooks";
import { type MieSubmission } from "../types";

interface SubmissionDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MieSubmission | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onApprove?: (submission: MieSubmission) => void;
  onReject?: (submission: MieSubmission) => void;
  isApproving?: boolean;
}

const formatScore = (val: unknown) => {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") {
    if (val <= 10) return `${val} / 10`;
    return String(val);
  }
  return String(val);
};

export const SubmissionDetailsDrawer = ({
  isOpen,
  onOpenChange,
  submission,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: SubmissionDetailsDrawerProps) => {
  // Fetch detailed submission data from /api/v1/mie/admin/submissions/{id}/
  const { data: detailData } = useGetMieSubmissionQuery(
    submission?.id ?? "",
    { skip: !isOpen || !submission?.id }
  );

  if (!submission) return null;

  const currentSubmission = detailData ?? submission;
  const payload = (currentSubmission.payload || {}) as Record<string, unknown>;

  const title =
    currentSubmission.title ||
    (payload.title as string) ||
    (payload.topic as string) ||
    "—";

  const developerEmail =
    currentSubmission.developer_email ||
    (payload.developer_email as string) ||
    (payload.developer_name as string) ||
    "—";

  const marketDemandScore =
    payload.market_demand_score ??
    currentSubmission.demand_score ??
    payload.demand_score ??
    payload.demandScore;

  const practicalityScore =
    payload.practicality_score ?? payload.practicalityScore;
  const trendScore = payload.trend_score ?? payload.trendScore;
  const evergreenScore = payload.evergreen_score ?? payload.evergreenScore;
  const courseWorthiness =
    payload.course_worthiness ?? payload.courseWorthiness;
  const educationalValue =
    payload.educational_value ?? payload.educationalValue;
  const confidence = payload.confidence;

  const description =
    (payload.description as string) ||
    (payload.topic_description as string) ||
    (payload.overview as string) ||
    (payload.summary as string) ||
    "No description provided.";

  const evaluationReason = payload.evaluation_reason as string | undefined;

  // Build the list of scores
  const scoreRows: { label: string; value: string }[] = [
    { label: "Market Demand Score", value: formatScore(marketDemandScore) },
    { label: "Practicality Score", value: formatScore(practicalityScore) },
  ];

  if (trendScore !== undefined && trendScore !== null) {
    scoreRows.push({ label: "Trend Score", value: formatScore(trendScore) });
  }
  if (evergreenScore !== undefined && evergreenScore !== null) {
    scoreRows.push({
      label: "Evergreen Score",
      value: formatScore(evergreenScore),
    });
  }
  if (courseWorthiness !== undefined && courseWorthiness !== null) {
    scoreRows.push({
      label: "Course Worthiness",
      value: formatScore(courseWorthiness),
    });
  }
  if (educationalValue !== undefined && educationalValue !== null) {
    scoreRows.push({
      label: "Educational Value",
      value: formatScore(educationalValue),
    });
  }
  if (confidence !== undefined && confidence !== null) {
    scoreRows.push({
      label: "Confidence",
      value:
        typeof confidence === "number" ? `${confidence}%` : String(confidence),
    });
  }

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-full sm:!w-[617px] sm:!max-w-[617px]"
      contentClassName="!p-0 flex flex-col overflow-y-auto"
      showCloseButton={false}
    >
      {/* Header */}
      <div className="border-b border-[#D9D9D9] p-[20px]">
        <div className="flex w-full items-center justify-between">
          <span className="text-[20px] font-semibold leading-[28px] text-[#202020]">
            Topic details
          </span>
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-0">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex cursor-pointer items-center justify-center rounded-l-[8px] border border-[#F0F0F0] p-[6px] transition-colors hover:bg-sd-grey-1 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous topic"
              >
                <ArrowRight2
                  variant="Linear"
                  size={20}
                  color="#202020"
                  className="rotate-180"
                />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="flex cursor-pointer items-center justify-center rounded-r-[8px] border border-l-0 border-[#F0F0F0] p-[6px] transition-colors hover:bg-sd-grey-1 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next topic"
              >
                <ArrowRight2 variant="Linear" size={20} color="#202020" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex cursor-pointer items-center justify-center rounded-[8px] border border-[#F0F0F0] p-[6px] text-[#606060] transition-colors hover:bg-sd-grey-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-[16px] p-[20px]">
        <div>
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-[#202020]">
            Topic Details
          </span>
        </div>

        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#606060]">
            Title
          </span>
          <span className="text-right text-[15px] font-medium leading-[22px] tracking-[-0.3px] text-[#202020]">
            {title}
          </span>
        </div>

        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#606060]">
            Developer
          </span>
          <span className="text-right text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#202020]">
            {developerEmail}
          </span>
        </div>

        {scoreRows.map((score) => (
          <div
            key={score.label}
            className="flex items-center justify-between gap-[16px]"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#606060]">
              {score.label}
            </span>
            <span className="text-right text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-[#008500]">
              {score.value}
            </span>
          </div>
        ))}
      </div>

      {/* Description Section */}
      <div className="flex flex-col gap-[12px] border-t border-[#D9D9D9] p-[20px]">
        <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-[#202020]">
          Description
        </span>
        <p className="whitespace-pre-line text-[14px] font-normal leading-[22px] tracking-[-0.28px] text-[#606060]">
          {description}
        </p>
      </div>

      {/* Evaluation Reason Section (if present) */}
      {evaluationReason && (
        <div className="flex flex-col gap-[12px] border-t border-[#D9D9D9] p-[20px]">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-[#202020]">
            Evaluation Reason
          </span>
          <p className="text-[14px] font-normal leading-[22px] tracking-[-0.28px] text-[#606060]">
            {evaluationReason}
          </p>
        </div>
      )}
    </SideDrawer>
  );
};
