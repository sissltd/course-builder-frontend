"use client";

import React from "react";
import { SearchNormal, TickCircle, Warning2 } from "iconsax-react";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface PlagiarismTabProps {
  course?: AdminCourseDetail;
}

const statusClassName = (status?: string) => {
  switch (status) {
    case "PASS":
      return "bg-[#EAFBF3] text-[#16A34A]";
    case "WARNING":
      return "bg-sd-warning-bg text-[#592D18]";
    case "FAIL":
      return "bg-[#FFF0ED] text-[#D54800]";
    default:
      return "bg-sd-grey-3 text-sd-grey-11";
  }
};

export const PlagiarismTab = ({ course }: PlagiarismTabProps) => {
  const runs = course?.quality_check_runs ?? [];
  const standaloneFindings = course?.quality_findings ?? [];

  if (runs.length === 0 && standaloneFindings.length === 0) {
    return (
      <div className="flex flex-col gap-[24px]">
        <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
          <SearchNormal size={40} variant="Linear" color="var(--sd-grey-11)" />
          <span className="text-[15px] font-semibold text-sd-grey-12">
            No plagiarism report available
          </span>
          <span className="text-[13px] text-sd-reviewer-muted max-w-[440px]">
            Plagiarism scanning has not been performed on &quot;{course?.title || "this course"}&quot; yet or results have not been submitted.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {runs.map((run) => (
        <div
          key={run.id}
          className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[20px]"
        >
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <span className="text-[15px] font-semibold leading-[20px] text-sd-grey-12">
                {run.provider || "Quality check"}
              </span>
              <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                {run.created_datetime
                  ? new Date(run.created_datetime).toLocaleString()
                  : "No run date"}
                {run.overall_score != null ? ` · Overall score ${run.overall_score}` : ""}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-[8px]">
              <span
                className={`rounded-[4px] px-[8px] py-[2px] text-[10px] font-semibold uppercase ${statusClassName(run.status)}`}
              >
                {run.status || "NOT_RUN"}
              </span>
              {run.risk_level && (
                <span className="rounded-[4px] bg-sd-grey-3 px-[8px] py-[2px] text-[10px] font-semibold uppercase text-sd-grey-11">
                  Risk: {run.risk_level}
                </span>
              )}
            </div>
          </div>

          <div className="mt-[16px] grid grid-cols-1 gap-[12px] md:grid-cols-2">
            <div className="flex items-center justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-2/60 p-[12px]">
              <span className="text-[12px] font-medium text-sd-grey-12">Plagiarism</span>
              <span className="flex items-center gap-[8px]">
                <span className="text-[12px] text-sd-reviewer-muted">
                  {run.plagiarism_score ?? "No score"}
                </span>
                <span
                  className={`rounded-[4px] px-[8px] py-[2px] text-[10px] font-semibold uppercase ${statusClassName(run.plagiarism_status)}`}
                >
                  {run.plagiarism_status || "NOT_RUN"}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-2/60 p-[12px]">
              <span className="text-[12px] font-medium text-sd-grey-12">Duplication</span>
              <span className="flex items-center gap-[8px]">
                <span className="text-[12px] text-sd-reviewer-muted">
                  {run.duplicate_score ?? "No score"}
                </span>
                <span
                  className={`rounded-[4px] px-[8px] py-[2px] text-[10px] font-semibold uppercase ${statusClassName(run.duplicate_status)}`}
                >
                  {run.duplicate_status || "NOT_RUN"}
                </span>
              </span>
            </div>
          </div>

          {run.findings && run.findings.length > 0 && (
            <div className="mt-[16px] flex flex-col gap-[8px]">
              <span className="text-[13px] font-semibold leading-[18px] text-sd-grey-12">
                Findings ({run.findings.length})
              </span>
              {run.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="flex items-start gap-[10px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]"
                >
                  {finding.severity === "ERROR" ? (
                    <Warning2 size={16} variant="Linear" color="#D54800" className="mt-[2px] shrink-0" />
                  ) : (
                    <TickCircle size={16} variant="Linear" color="var(--sd-grey-9)" className="mt-[2px] shrink-0" />
                  )}
                  <div className="flex min-w-0 flex-col gap-[4px]">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <span className="text-[13px] font-medium leading-[18px] text-sd-grey-12">
                        {finding.code}
                      </span>
                      <span
                        className={`rounded-[4px] px-[6px] py-[1px] text-[10px] font-semibold uppercase ${statusClassName(finding.severity === "ERROR" ? "FAIL" : finding.severity === "WARNING" ? "WARNING" : "PASS")}`}
                      >
                        {finding.severity}
                      </span>
                      {finding.resolved_at && (
                        <span className="text-[11px] text-sd-reviewer-muted">Resolved</span>
                      )}
                    </div>
                    <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                      {finding.message}
                    </span>
                    {(finding.module || finding.lesson) && (
                      <span className="text-[11px] leading-[14px] text-sd-muted-text">
                        {[finding.module, finding.lesson].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {standaloneFindings.length > 0 && (
        <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[20px]">
          <span className="text-[15px] font-semibold leading-[20px] text-sd-grey-12">
            Other quality findings ({standaloneFindings.length})
          </span>
          <div className="mt-[12px] flex flex-col gap-[8px]">
            {standaloneFindings.map((finding) => (
              <div
                key={finding.id}
                className="flex items-start justify-between gap-[12px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]"
              >
                <div className="flex min-w-0 flex-col gap-[4px]">
                  <span className="text-[13px] font-medium leading-[18px] text-sd-grey-12">
                    {finding.code}
                  </span>
                  <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                    {finding.message}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-[4px] px-[8px] py-[2px] text-[10px] font-semibold uppercase ${statusClassName(finding.severity === "ERROR" ? "FAIL" : finding.severity === "WARNING" ? "WARNING" : "PASS")}`}
                >
                  {finding.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
