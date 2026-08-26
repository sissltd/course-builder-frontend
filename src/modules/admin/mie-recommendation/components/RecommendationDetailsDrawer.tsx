"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { ArrowRight2, CloseCircle, Danger, TickCircle } from "iconsax-react";
import type { MieRecommendation } from "../data/mockData";
import {
  SourcePill,
  StatusPill,
  approveLabel,
  fieldValue,
  formatAbsolute,
  formatRelative,
} from "./SharedUI";

interface RecommendationDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: MieRecommendation | null;
  /** Siblings sharing this topic, oldest-first. Null when there is no clash. */
  cluster?: MieRecommendation[] | null;
  onCompare?: () => void;
  onApprove?: (row: MieRecommendation) => void;
  onReject?: (row: MieRecommendation) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-[16px]">
    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
      {label}
    </span>
    <span className="text-right text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
      {children}
    </span>
  </div>
);

export const RecommendationDetailsDrawer = ({
  isOpen,
  onOpenChange,
  recommendation,
  cluster,
  onCompare,
  onApprove,
  onReject,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: RecommendationDetailsDrawerProps) => {
  if (!recommendation) return null;

  const isCurator = recommendation.source.kind === "curator";
  const hasClash = !!cluster && cluster.length > 1;
  const isPending = recommendation.status === "pending";

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-full sm:!w-[617px] sm:!max-w-[617px]"
      contentClassName="!p-0 flex flex-col overflow-hidden"
      showCloseButton={false}
    >
      {/* Header */}
      <div className="border-b border-sd-grey-6 p-[20px]">
        <div className="flex w-full items-center justify-between">
          <span className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
            Topic details
          </span>
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-0">
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex cursor-pointer items-center justify-center rounded-l-[8px] border border-sd-grey-3 p-[6px] transition-colors hover:bg-sd-grey-1 disabled:opacity-30"
                aria-label="Previous recommendation"
              >
                <ArrowRight2
                  variant="Linear"
                  size={20}
                  color="var(--sd-grey-12)"
                  className="rotate-180"
                />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex cursor-pointer items-center justify-center rounded-r-[8px] border border-l-0 border-sd-grey-3 p-[6px] transition-colors hover:bg-sd-grey-1 disabled:opacity-30"
                aria-label="Next recommendation"
              >
                <ArrowRight2 variant="Linear" size={20} color="var(--sd-grey-12)" />
              </button>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="flex cursor-pointer items-center justify-center rounded-[8px] border border-sd-grey-3 p-[6px] transition-colors hover:bg-sd-grey-1"
              aria-label="Close"
            >
              <CloseCircle variant="Linear" size={20} color="var(--sd-grey-11)" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Duplicate clash callout */}
        {hasClash && (
          <button
            type="button"
            onClick={onCompare}
            className="mx-[17px] mt-[17px] flex w-[calc(100%-34px)] cursor-pointer items-center justify-between gap-[12px] rounded-[10px] border border-l-4 border-sd-warning-bg border-l-sd-warning-text bg-sd-warning-bg p-[12px] text-left transition-colors hover:brightness-95"
          >
            <span className="flex items-start gap-[10px]">
              <Danger
                variant="Bold"
                size={18}
                color="var(--sd-warning-text)"
                className="mt-[1px] shrink-0"
              />
              <span className="flex flex-col gap-[2px]">
                <span className="text-[13px] font-semibold leading-[18px] text-sd-warning-text">
                  Part of a {cluster!.length}-way duplicate
                </span>
                <span className="text-[12px] leading-[16px] text-sd-warning-text">
                  {cluster![0].id === recommendation.id
                    ? "This is the earliest submission."
                    : `${
                        cluster![0].source.kind === "ai"
                          ? "AI Engine"
                          : cluster![0].source.name
                      } submitted first.`}
                </span>
              </span>
            </span>
            <span className="shrink-0 rounded-[6px] bg-white px-[10px] py-[4px] text-[12px] font-medium text-sd-warning-text">
              Compare
            </span>
          </button>
        )}

        {/* Topic description */}
        <div className="flex flex-col gap-[16px] p-[17px]">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            Topic Description
          </span>

          <DetailRow label="Title">{recommendation.topic}</DetailRow>
          <DetailRow label="Category">{recommendation.category}</DetailRow>
          <DetailRow label="Level">{recommendation.difficultyLevel}</DetailRow>
          <DetailRow label="Demand Score">
            {fieldValue(recommendation.demandScore)}
          </DetailRow>
          <DetailRow label="Searches per month">
            {fieldValue(recommendation.searchesPerMonth)}
          </DetailRow>
        </div>

        {/* Submission provenance */}
        <div className="flex flex-col gap-[16px] border-t border-sd-grey-6 p-[17px]">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            Submission
          </span>

          <div className="flex items-start justify-between gap-[16px]">
            <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Recommended by
            </span>
            <SourcePill source={recommendation.source} size="md" />
          </div>

          <DetailRow label="Submitted">
            <span className="flex flex-col">
              <span>{formatAbsolute(recommendation.submittedAt)}</span>
              <span className="text-[12px] leading-[16px] text-sd-grey-11">
                {formatRelative(recommendation.submittedAt)}
              </span>
            </span>
          </DetailRow>

          <div className="flex items-center justify-between gap-[16px]">
            <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Status
            </span>
            <StatusPill status={recommendation.status} />
          </div>

          {isCurator && isPending && (
            <div className="rounded-[10px] border border-sd-blue-light bg-sd-blue-light p-[12px]">
              <p className="text-[13px] leading-[18px] text-sd-blue">
                Stage 1 of 2 — topic proposal. Approving unlocks the full write-up for{" "}
                {recommendation.source.kind === "curator" && recommendation.source.name}.
              </p>
            </div>
          )}

          {recommendation.rejectedReason && (
            <div className="rounded-[10px] border border-sd-danger-soft bg-sd-danger-soft p-[12px]">
              <p className="text-[13px] leading-[18px] text-sd-danger">
                {recommendation.rejectedReason}
              </p>
            </div>
          )}
        </div>

        {/* Pitch */}
        {recommendation.description && (
          <div className="flex flex-col gap-[16px] border-t border-sd-grey-6 p-[17px]">
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              Description
            </span>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              {recommendation.description}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {isPending && (onApprove || onReject) && (
        <div className="flex items-center gap-[12px] border-t border-sd-grey-6 p-[16px]">
          {onReject && (
            <button
              type="button"
              onClick={() => onReject(recommendation)}
              className="flex h-[44px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-4 bg-white text-[14px] text-sd-grey-12 transition-colors hover:bg-sd-grey-1"
            >
              <CloseCircle variant="Linear" size={18} color="var(--sd-danger)" />
              Reject
            </button>
          )}
          {onApprove && (
            <button
              type="button"
              onClick={() => onApprove(recommendation)}
              className="flex h-[44px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-sd-blue text-[14px] font-medium text-white transition-colors hover:bg-sd-blue-hover"
            >
              <TickCircle variant="Linear" size={18} color="#FFFFFF" />
              {approveLabel(recommendation)}
            </button>
          )}
        </div>
      )}
    </SideDrawer>
  );
};
