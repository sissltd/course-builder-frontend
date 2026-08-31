"use client";

import React from "react";
import { CloseCircle, Key, PauseCircle, TickCircle } from "iconsax-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button } from "@/components/shared/Button";
import { useGetMieSubmissionsQuery } from "../hooks";
import {
  Callout,
  CopyButton,
  DetailRow,
  DeveloperStatusPill,
  PlanPill,
  SectionTitle,
  SubmissionStatusPill,
  fieldValue,
} from "./SharedUI";
import { formatAbsolute, formatRelative } from "../utils/format";
import { DeveloperAccountStatus, type MieDeveloper } from "../types";

interface DeveloperDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  developer: MieDeveloper | null;
  onApprove: (developer: MieDeveloper) => void;
  onReject: (developer: MieDeveloper) => void;
  onSuspend: (developer: MieDeveloper) => void;
  isApproving?: boolean;
}

const statusNotes: Record<DeveloperAccountStatus, string> = {
  [DeveloperAccountStatus.PENDING]:
    "No credentials exist yet. Approving is what issues the API key, and it is shown only once.",
  [DeveloperAccountStatus.APPROVED]:
    "The key is live. Suspending blocks submissions without destroying the key.",
  [DeveloperAccountStatus.REJECTED]:
    "Submissions are refused. Approving again issues a brand-new key — the old one is gone.",
  [DeveloperAccountStatus.SUSPENDED]:
    "Submissions are refused. Reactivating restores the same key, so nothing needs resending.",
};

export const DeveloperDetailsDrawer = ({
  isOpen,
  onOpenChange,
  developer,
  onApprove,
  onReject,
  onSuspend,
  isApproving,
}: DeveloperDetailsDrawerProps) => {
  // Scoped by account uuid rather than email so a renamed address still resolves.
  const { data: submissionsResponse, isFetching } = useGetMieSubmissionsQuery(
    { developer: developer?.id ?? "", size: 5, ordering: "-created_datetime" },
    { skip: !isOpen || !developer?.id },
  );

  if (!developer) return null;

  const submissions = submissionsResponse?.data?.results ?? [];
  const totalSubmissions = submissionsResponse?.data?.paginator?.count ?? 0;

  const canApprove = developer.status !== DeveloperAccountStatus.APPROVED;
  const canSuspend = developer.status === DeveloperAccountStatus.APPROVED;
  const canReject = developer.status !== DeveloperAccountStatus.REJECTED;
  const approveLabel =
    developer.status === DeveloperAccountStatus.PENDING
      ? "Approve"
      : "Reactivate";

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={developer.email}
      description={
        <span className="flex flex-wrap items-center gap-[10px]">
          <span>Registered {formatAbsolute(developer.created_datetime)}</span>
          <span className="text-sd-grey-9">·</span>
          <span>
            {totalSubmissions}{" "}
            {totalSubmissions === 1 ? "submission" : "submissions"}
          </span>
        </span>
      }
      footer={
        <div className="flex w-full flex-wrap items-center gap-[12px]">
          {canReject && (
            <Button
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] flex-1 rounded-[10px] border-sd-grey-6 bg-white text-[14px] font-normal text-sd-grey-12"
              leftIcon={
                <CloseCircle variant="Linear" size={18} color="#D54800" />
              }
              onClick={() => onReject(developer)}
            >
              Reject
            </Button>
          )}
          {canSuspend && (
            <Button
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] flex-1 rounded-[10px] border-sd-grey-6 bg-white text-[14px] font-normal text-sd-grey-12"
              leftIcon={
                <PauseCircle
                  variant="Linear"
                  size={18}
                  color="var(--sd-grey-11)"
                />
              }
              onClick={() => onSuspend(developer)}
            >
              Suspend
            </Button>
          )}
          {canApprove && (
            <Button
              type="button"
              variant="app-primary"
              size="app"
              className="h-[44px] flex-1 rounded-[10px] text-[14px] font-normal tracking-[-0.28px]"
              leftIcon={<TickCircle variant="Linear" size={18} color="#FFF" />}
              isLoading={isApproving}
              onClick={() => onApprove(developer)}
            >
              {approveLabel}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-[24px]">
        {/* Status */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[8px]">
            <DeveloperStatusPill status={developer.status} />
            <PlanPill plan={developer.plan_type} />
          </div>
          <p className="text-[13px] leading-[18px] text-sd-grey-11">
            {statusNotes[developer.status]}
          </p>
        </div>

        {/* Account */}
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
          <SectionTitle>Account</SectionTitle>
          <DetailRow label="Email">
            <span className="inline-flex items-center gap-[8px]">
              {developer.email}
              <CopyButton value={developer.email} />
            </span>
          </DetailRow>
          <DetailRow
            label="Webhook URL"
            hint="Every approval and rejection for this developer is POSTed here."
          >
            <span className="inline-flex items-center gap-[8px]">
              <span className="min-w-0 break-all font-mono text-[13px] leading-[18px]">
                {developer.webhook_url}
              </span>
              <CopyButton value={developer.webhook_url} />
            </span>
          </DetailRow>
          <DetailRow label="Decision made">
            {fieldValue(formatAbsolute(developer.decided_at))}
          </DetailRow>
          <DetailRow label="Last updated">
            {fieldValue(formatRelative(developer.updated_datetime))}
          </DetailRow>
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-white p-[16px]">
          <div className="flex items-center gap-[8px]">
            <Key variant="Bold" size={16} color="var(--sd-grey-11)" />
            <SectionTitle>API credential</SectionTitle>
          </div>

          {developer.api_key_preview ? (
            <>
              <DetailRow
                label="Key"
                hint="Only the prefix is stored in readable form."
              >
                <span className="font-mono text-[13px] leading-[18px]">
                  {developer.api_key_preview}
                </span>
              </DetailRow>
              <DetailRow label="Issued">
                {fieldValue(formatAbsolute(developer.api_key_issued_at))}
              </DetailRow>
              <DetailRow
                label="Last used"
                hint="Updated on every authenticated submission."
              >
                {developer.api_key_last_used_at
                  ? formatRelative(developer.api_key_last_used_at)
                  : fieldValue(null)}
              </DetailRow>
              {!developer.api_key_last_used_at && (
                <Callout tone="info">
                  The key has never been used — the developer has not wired up
                  their integration yet.
                </Callout>
              )}
            </>
          ) : (
            <Callout tone="warning">
              No key has been issued for this account. Approving it issues one,
              and that response is the only place the full key ever appears.
            </Callout>
          )}
        </div>

        {/* Recent submissions */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[2px]">
            <SectionTitle>Recent submissions</SectionTitle>
            <span className="text-[12px] leading-[16px] text-sd-grey-11">
              {totalSubmissions > submissions.length
                ? `Newest ${submissions.length} of ${totalSubmissions}. Filter the submissions queue by this developer to see the rest.`
                : "Everything this developer has sent."}
            </span>
          </div>

          {isFetching ? (
            <div className="flex items-center gap-[8px] text-[13px] leading-[18px] text-sd-grey-11">
              <span className="size-[14px] animate-spin rounded-full border-2 border-sd-grey-3 border-t-sd-blue" />
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-[13px] leading-[18px] text-sd-grey-11">
              Nothing submitted yet.
            </p>
          ) : (
            <div className="flex flex-col gap-[8px]">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between gap-[12px] rounded-[10px] border border-sd-grey-3 bg-white p-[12px]"
                >
                  <div className="flex min-w-0 flex-col gap-[4px]">
                    <span
                      className="truncate text-[13px] leading-[18px] text-sd-grey-12"
                      title={submission.title}
                    >
                      {submission.title}
                    </span>
                    <span className="font-mono text-[12px] leading-[16px] text-sd-grey-11">
                      {submission.reference}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-[4px]">
                    <SubmissionStatusPill status={submission.status} />
                    <span className="text-[11px] leading-[14px] text-sd-grey-11">
                      {formatRelative(submission.created_datetime)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SideDrawer>
  );
};
