"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft2,
  ArrowRight2,
  TickCircle,
  InfoCircle,
  CloseCircle,
} from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { syncSubmitCourse } from "@/redux/slices/builderSync";
import { toast } from "sonner";
import { normalizeApiError, formatApiErrorItem } from "@/lib/api/errors";
import { useRouter, useSearchParams } from "next/navigation";
import { CreatorRoute } from "@/lib/routes";
import { useGetQualityChecksQuery, useRefreshQualityChecksMutation } from "@/modules/creator/hooks";
import type { QualityCheckResult } from "@/modules/creator/dashboard/types";
import type { ApiErrorItem } from "@/lib/api/types";
import {
  evaluateStructuralStandards,
  type StructuralStandard,
} from "@/modules/builder/utils/structuralStandards";
import { cn } from "@/lib/utils";

interface QualityCheckStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onPreview?: () => void;
}

interface QualityCheckItemProps {
  label: string;
  passed: boolean;
  warning?: string;
}

const QualityCheckItem = ({ label, passed, warning }: QualityCheckItemProps) => {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[12px]">
        <TickCircle size={24} variant="Bold" color={passed ? "#0A60E1" : "#D9D9D9"} />
        <span className="text-[16px] text-[#202020] leading-[24px] tracking-[-0.32px]">
          {label}
        </span>
      </div>
      {warning && (
        <div className="flex items-center gap-[8px] pl-[36px]">
          <InfoCircle size={16} variant="Linear" color="#FF5025" />
          <span className="text-[14px] text-[#FF5025] leading-[20px]">
            {warning}
          </span>
        </div>
      )}
    </div>
  );
};

const StandardItem = ({ standard }: { standard: StructuralStandard }) => {
  return (
    <div className="flex items-start gap-[12px]">
      <TickCircle
        size={24}
        variant="Bold"
        color={standard.passed ? "#0A60E1" : "#D9D9D9"}
        className="mt-[2px] shrink-0"
      />
      <div className="flex flex-col gap-[2px] min-w-0">
        <span className="text-[16px] text-[#202020] leading-[24px] tracking-[-0.32px]">
          {standard.label}
        </span>
        <span
          className={cn(
            "text-[14px] leading-[20px]",
            standard.passed ? "text-[#606060]" : "text-[#FF5025]",
          )}
        >
          Requires {standard.requirement} · currently {standard.actual}
        </span>
      </div>
    </div>
  );
};

interface QualityCheckSection {
  section: string;
  items: QualityCheckResult[];
}

const groupBySection = (checks: QualityCheckResult[]): QualityCheckSection[] => {
  const grouped = new Map<string, QualityCheckResult[]>();

  for (const check of checks) {
    const section = check.criterion.section;
    if (!grouped.has(section)) {
      grouped.set(section, []);
    }
    grouped.get(section)!.push(check);
  }

  return Array.from(grouped.entries()).map(([section, items]) => ({
    section,
    items: items.sort((a, b) => a.criterion.order_index - b.criterion.order_index),
  }));
};

export const QualityCheckStep = ({ onBack }: QualityCheckStepProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    errors: ApiErrorItem[];
    signature: string;
  }>({ errors: [], signature: "" });
  const [refreshQualityChecks] = useRefreshQualityChecksMutation();

  const courseInformation = useAppSelector(
    (state) => state.courseBuilder.courseInformation,
  );
  const modules = useAppSelector((state) => state.courseBuilder.modules);
  const version = useAppSelector((state) => state.courseBuilder.version);
  const finalAssessment = useAppSelector(
    (state) => state.courseBuilder.finalAssessment,
  );

  const { data: qualityChecks, isLoading: isLoadingChecks } = useGetQualityChecksQuery(
    courseId ?? "",
    { skip: !courseId }
  );

  const structuralStandards = useMemo(
    () =>
      evaluateStructuralStandards({
        courseInformation,
        modules,
        version,
        finalAssessment,
      }),
    [courseInformation, modules, version, finalAssessment],
  );

  const courseSignature = useMemo(
    () => JSON.stringify({ courseInformation, modules, version, finalAssessment }),
    [courseInformation, modules, version, finalAssessment],
  );

  const submitErrors =
    submitState.signature === courseSignature ? submitState.errors : [];

  useEffect(() => {
    if (!courseId) return;
    refreshQualityChecks(courseId);
  }, [courseId, courseSignature, refreshQualityChecks]);

  const failedStandards = structuralStandards.filter((standard) => !standard.passed);
  const blockingCount = failedStandards.length + submitErrors.length;
  const canSubmit = !isSubmitting && blockingCount === 0;

  const groupedChecks = qualityChecks ? groupBySection(qualityChecks) : [];

  const handleRefreshChecks = async () => {
    if (!courseId) return;
    try {
      await refreshQualityChecks(courseId).unwrap();
      setSubmitState({ errors: [], signature: courseSignature });
      toast.success("Quality checks refreshed");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Failed to refresh quality checks");
    }
  };

  const handleSubmit = async () => {
    setSubmitState({ errors: [], signature: courseSignature });
    setIsSubmitting(true);
    try {
      const result = await dispatch(syncSubmitCourse()).unwrap();
      if (result.success) {
        toast.success("Course submitted for review!");
        router.push(CreatorRoute.COURSES);
      } else if (result.errors && result.errors.length > 0) {
        setSubmitState({ errors: result.errors, signature: courseSignature });
        toast.error("This course does not meet the submission standards yet.");
      } else {
        toast.error("Failed to submit course. Please try again.");
      }
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Failed to submit course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FDFDFD] px-[16px] md:pl-[24px] md:pr-[200px] py-[24px] md:py-[40px] flex flex-col gap-[32px] md:gap-[40px] pb-[32px]">
      {/* Title Section */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          Quality check
        </h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Review and confirm your course meets all quality standards before submitting for review
        </p>
      </div>

      {/* Server-reported submission errors */}
      {submitErrors.length > 0 && (
        <div
          role="alert"
          data-testid="submit-errors"
          className="flex flex-col gap-[12px] rounded-[12px] border border-[#FDA29B] bg-[#FFFBFA] p-[16px]"
        >
          <div className="flex items-center gap-[8px]">
            <CloseCircle size={20} variant="Bold" color="#B42318" />
            <span className="text-[16px] font-semibold text-[#B42318] leading-[24px]">
              This course can&apos;t be submitted yet
            </span>
          </div>
          <p className="text-[14px] text-[#B42318] leading-[20px]">
            The server rejected the submission with {submitErrors.length}{" "}
            {submitErrors.length === 1 ? "issue" : "issues"}. Fix them below, then
            refresh the quality checks.
          </p>
          <ul className="flex flex-col gap-[8px]">
            {submitErrors.map((error, index) => (
              <li
                key={`${error.field_name ?? "error"}-${index}`}
                className="flex items-start gap-[8px] text-[14px] text-[#B42318] leading-[20px]"
              >
                <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-[#B42318]" />
                <span>{formatApiErrorItem(error)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refresh Button */}
      {courseId && (
        <div className="flex justify-end">
          <Button
            variant="app-outline"
            onClick={handleRefreshChecks}
            disabled={isLoadingChecks}
          >
            {isLoadingChecks ? "Refreshing..." : "Refresh Quality Checks"}
          </Button>
        </div>
      )}

      {/* Structural standards (submission requirements) */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[4px]">
          <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
            Submission requirements
          </h3>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            Every requirement must be met before this course can be submitted for review.
          </p>
        </div>
        <div className="flex flex-col gap-[16px]">
          {structuralStandards.map((standard) => (
            <StandardItem key={standard.id} standard={standard} />
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E8E8E8]" />

      {/* Quality Check Sections */}
      {isLoadingChecks ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : groupedChecks.length > 0 ? (
        groupedChecks.map((group) => (
          <React.Fragment key={group.section}>
            <div className="flex flex-col gap-[20px]">
              <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
                {group.section}
              </h3>
              <div className="flex flex-col gap-[16px]">
                {group.items.map((check) => (
                  <QualityCheckItem
                    key={check.id}
                    label={check.criterion.label}
                    passed={check.is_checked}
                    warning={check.warning_note ?? undefined}
                  />
                ))}
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#E8E8E8]" />
          </React.Fragment>
        ))
      ) : (
        <p className="text-[14px] text-[#606060] leading-[20px]">
          No additional quality checks have been recorded for this course yet.
        </p>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-col-reverse gap-[12px] sm:flex-row sm:items-center sm:justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
        <Button
          variant="app-outline"
          onClick={onBack}
          leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
        >
          Go back
        </Button>
        <div className="flex flex-col items-end gap-[8px]">
          {blockingCount > 0 && (
            <span className="text-[14px] text-[#FF5025] leading-[20px] sm:text-right">
              Resolve {blockingCount} {blockingCount === 1 ? "issue" : "issues"} to
              submit for review
            </span>
          )}
          <Button
            variant="app-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
          >
            {isSubmitting ? "Submitting..." : "Preview and Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};
