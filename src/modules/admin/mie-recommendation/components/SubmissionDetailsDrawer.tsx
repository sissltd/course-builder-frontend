"use client";

import React from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight2,
  Book1,
  CloseCircle,
  Copy,
  TickCircle,
} from "iconsax-react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/lib/routes";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useGetMieSubmissionsQuery,
  useSetMieSubmissionPayoutBypassMutation,
  useSetMieSubmissionSignalsMutation,
} from "../hooks";
import {
  Callout,
  CopyButton,
  DetailRow,
  ReferenceChip,
  SectionTitle,
  SubmissionStatusPill,
  fieldValue,
} from "./SharedUI";
import {
  duplicateStatuses,
  formatAbsolute,
  formatEarnings,
  formatPayload,
  payloadExtras,
  submissionStatusHints,
} from "../utils/format";
import { SubmissionStatus, type MieSubmission } from "../types";
import {
  demandSignalsSchema,
  type DemandSignalsFormData,
} from "../utils/validation";

interface SubmissionDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MieSubmission | null;
  onApprove: (submission: MieSubmission) => void;
  onReject: (submission: MieSubmission) => void;
  isApproving?: boolean;
}

/** Renders a payload value without collapsing objects into `[object Object]`. */
const payloadValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return formatPayload(value);
  return String(value);
};

const humanizeKey = (key: string) =>
  key.replace(/[_-]+/g, " ").replace(/^./, (char) => char.toUpperCase());

export const SubmissionDetailsDrawer = ({
  isOpen,
  onOpenChange,
  submission,
  onApprove,
  onReject,
  isApproving,
}: SubmissionDetailsDrawerProps) => {
  /**
   * The raw-JSON toggle is tied to the submission it was opened for, so moving to
   * another row collapses it again without an effect resetting state.
   */
  const [rawPayloadFor, setRawPayloadFor] = React.useState<string | null>(null);
  const showRawPayload = !!submission && rawPayloadFor === submission.id;
  const [setSignals, { isLoading: isSavingSignals }] =
    useSetMieSubmissionSignalsMutation();
  const [setPayoutBypass, { isLoading: isSavingBypass }] =
    useSetMieSubmissionPayoutBypassMutation();

  /* ─────────────────────────── Demand signals ─────────────────────────── */

  const methods = useForm<DemandSignalsFormData>({
    resolver: zodResolver(demandSignalsSchema),
    mode: "onBlur",
    defaultValues: { demand_score: "", estimated_monthly_earnings: "" },
  });

  React.useEffect(() => {
    if (!isOpen) return;
    methods.reset({
      demand_score:
        submission?.demand_score === null ||
        submission?.demand_score === undefined
          ? ""
          : String(submission.demand_score),
      estimated_monthly_earnings: submission?.estimated_monthly_earnings ?? "",
    });
  }, [
    isOpen,
    submission?.id,
    submission?.demand_score,
    submission?.estimated_monthly_earnings,
    methods,
  ]);

  const saveSignals = async (values: DemandSignalsFormData) => {
    if (!submission) return;
    try {
      await setSignals({
        id: submission.id,
        body: {
          demand_score: Number(values.demand_score),
          // An empty field means "clear it" — the field is nullable, so null is
          // the only way to say that; omitting it would leave the old value.
          estimated_monthly_earnings:
            values.estimated_monthly_earnings.trim() === ""
              ? null
              : values.estimated_monthly_earnings.trim(),
        },
      }).unwrap();
      toast.success("Demand signals saved");
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      if (fieldErrors.demand_score) {
        methods.setError("demand_score", { message: fieldErrors.demand_score });
      }
      if (fieldErrors.estimated_monthly_earnings) {
        methods.setError("estimated_monthly_earnings", {
          message: fieldErrors.estimated_monthly_earnings,
        });
      }
      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(message ?? "Failed to save demand signals");
      }
    }
  };

  /* ──────────────────────────── Payout bypass ──────────────────────────── */

  const togglePayoutBypass = async (checked: boolean) => {
    if (!submission || checked === submission.payout_bypass) return;
    try {
      await setPayoutBypass({
        id: submission.id,
        body: { payout_bypass: checked },
      }).unwrap();
      toast.success(
        checked
          ? "This idea is now marked no-payout"
          : "This idea will be paid on approval",
      );
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to update payout setting");
    }
  };

  /* ──────────────────────── Same-title siblings ──────────────────────── */

  // The backend deduplicates on title, so anything sharing this title is what
  // put the row into a DUPLICATE_* state — surface it instead of making the
  // operator go search for it.
  const { data: siblingsResponse, isFetching: isFetchingSiblings } =
    useGetMieSubmissionsQuery(
      { search: submission?.title ?? "", size: 6 },
      { skip: !isOpen || !submission?.title },
    );

  const siblings = (siblingsResponse?.data?.results ?? []).filter(
    (row) => row.id !== submission?.id,
  );

  if (!submission) return null;

  const extras = payloadExtras(submission.payload);
  const canApprove = submission.status !== SubmissionStatus.APPROVED;
  const canReject = submission.status !== SubmissionStatus.REJECTED;
  const isDuplicateState = duplicateStatuses.includes(submission.status);

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={submission.title}
      description={
        <span className="flex flex-wrap items-center gap-[10px]">
          <ReferenceChip reference={submission.reference} />
          <span className="text-sd-grey-11">{submission.developer_email}</span>
        </span>
      }
      footer={
        <div className="flex w-full items-center gap-[12px]">
          {canReject && (
            <Button
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] flex-1 rounded-[10px] border-sd-grey-6 bg-white text-[14px] font-normal text-sd-grey-12"
              leftIcon={
                <CloseCircle variant="Linear" size={18} color="#D54800" />
              }
              onClick={() => onReject(submission)}
            >
              {submission.status === SubmissionStatus.APPROVED
                ? "Reverse approval"
                : "Reject"}
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
              onClick={() => onApprove(submission)}
            >
              {submission.status === SubmissionStatus.REJECTED
                ? "Re-approve"
                : "Approve"}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-[24px]">
        {/* Status */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between gap-[12px]">
            <SubmissionStatusPill status={submission.status} />
            <span className="text-[12px] leading-[16px] text-sd-grey-11">
              Arrived {formatAbsolute(submission.created_datetime)}
            </span>
          </div>
          <p className="text-[13px] leading-[18px] text-sd-grey-11">
            {submissionStatusHints[submission.status]}
          </p>
        </div>

        {isDuplicateState && (
          <Callout tone="warning">
            The pipeline short-circuited this idea before review. It can still be
            approved — doing so overrides the dedup verdict.
          </Callout>
        )}

        {/* Decision record */}
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
          <SectionTitle>Decision record</SectionTitle>
          <DetailRow label="Decided by">
            {fieldValue(submission.decided_by_email)}
          </DetailRow>
          <DetailRow label="Decided at">
            {fieldValue(formatAbsolute(submission.decided_at))}
          </DetailRow>
          <DetailRow
            label="Rejection reason"
            hint="The taxonomy label attached to the most recent rejection."
          >
            {fieldValue(submission.rejection_reason)}
          </DetailRow>
          <DetailRow label="Rejection note">
            {fieldValue(submission.rejection_note)}
          </DetailRow>
          <DetailRow
            label="Queued at"
            hint="When the idea entered the review queue."
          >
            {fieldValue(formatAbsolute(submission.queued_at))}
          </DetailRow>
        </div>

        {/* Resulting course */}
        {submission.resulting_course && (
          <Link
            href={`${AdminRoute.COURSE_OVERVIEW}/${encodeURIComponent(
              submission.resulting_course,
            )}`}
            className="flex items-center justify-between gap-[12px] rounded-[12px] border border-sd-grey-3 bg-white p-[16px] transition-colors hover:border-sd-blue"
          >
            <span className="flex items-center gap-[10px]">
              <span className="flex size-[36px] items-center justify-center rounded-[10px] bg-sd-blue-light">
                <Book1 variant="Bold" size={18} color="var(--sd-blue)" />
              </span>
              <span className="flex flex-col gap-[2px]">
                <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                  Course produced from this idea
                </span>
                <span className="font-mono text-[12px] leading-[16px] text-sd-grey-11">
                  {submission.resulting_course}
                </span>
              </span>
            </span>
            <ArrowRight2 variant="Linear" size={18} color="var(--sd-grey-11)" />
          </Link>
        )}

        {/* Demand signals — admin-only, never shown to the developer */}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(saveSignals)}
            className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-white p-[16px]"
          >
            <div className="flex flex-col gap-[2px]">
              <SectionTitle>Demand signals</SectionTitle>
              <span className="text-[12px] leading-[16px] text-sd-grey-11">
                Internal prioritisation only. The developer never sees these and
                saving fires no webhook.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <FormInput
                name="demand_score"
                label="Demand score"
                placeholder="0 – 100"
                required
                className="h-[44px] bg-white"
              />
              <FormInput
                name="estimated_monthly_earnings"
                label="Est. monthly earnings"
                placeholder="4200.00"
                leftElement={<span className="text-[14px]">$</span>}
                className="h-[44px] bg-white"
              />
            </div>

            <div className="flex items-center justify-between gap-[12px]">
              <span className="text-[12px] leading-[16px] text-sd-grey-11">
                Currently {fieldValue(submission.demand_score)} ·{" "}
                {formatEarnings(submission.estimated_monthly_earnings)}
              </span>
              <Button
                type="submit"
                variant="outline"
                size="app"
                className="h-[36px] rounded-[8px] border-sd-grey-6 bg-white px-[16px] text-[13px] font-normal text-sd-grey-12"
                isLoading={isSavingSignals}
              >
                Save signals
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* Payout bypass */}
        <div className="flex items-start justify-between gap-[16px] rounded-[12px] border border-sd-grey-3 bg-white p-[16px]">
          <div className="flex flex-col gap-[2px]">
            <SectionTitle>Skip payout for this idea</SectionTitle>
            <span className="text-[12px] leading-[16px] text-sd-grey-11">
              Per-idea override. The developer&apos;s account plan still applies
              to everything else they submit.
            </span>
          </div>
          <Switch
            checked={submission.payout_bypass}
            disabled={isSavingBypass}
            onCheckedChange={togglePayoutBypass}
            aria-label="Skip payout for this idea"
          />
        </div>

        {/* Payload */}
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
          <div className="flex items-center justify-between gap-[12px]">
            <SectionTitle>What the developer sent</SectionTitle>
            <button
              type="button"
              onClick={() =>
                setRawPayloadFor(showRawPayload ? null : submission.id)
              }
              className="cursor-pointer text-[12px] leading-[16px] text-sd-blue underline"
            >
              {showRawPayload ? "Show fields" : "Show raw JSON"}
            </button>
          </div>

          {showRawPayload ? (
            <div className="flex flex-col gap-[8px]">
              <pre className="max-h-[320px] overflow-auto rounded-[10px] border border-sd-grey-3 bg-white p-[12px] font-mono text-[12px] leading-[18px] text-sd-grey-12">
                {formatPayload(submission.payload)}
              </pre>
              <CopyButton
                value={formatPayload(submission.payload)}
                label="Copy payload"
                className="w-fit"
              />
            </div>
          ) : extras.length > 0 ? (
            <div className="flex flex-col gap-[12px]">
              {extras.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-[2px]">
                  <span className="text-[12px] leading-[16px] text-sd-grey-11">
                    {humanizeKey(key)}
                  </span>
                  <span className="break-words whitespace-pre-wrap text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                    {payloadValue(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] leading-[18px] text-sd-grey-11">
              The submission carried only a title — no extra context was sent.
            </p>
          )}
        </div>

        {/* Same-title siblings */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[2px]">
            <SectionTitle>Other submissions with this title</SectionTitle>
            <span className="text-[12px] leading-[16px] text-sd-grey-11">
              Deduplication matches on title, so this is what the pipeline
              compared against.
            </span>
          </div>

          {isFetchingSiblings ? (
            <div className="flex items-center gap-[8px] text-[13px] leading-[18px] text-sd-grey-11">
              <span className="size-[14px] animate-spin rounded-full border-2 border-sd-grey-3 border-t-sd-blue" />
              Checking the queue...
            </div>
          ) : siblings.length === 0 ? (
            <p className="text-[13px] leading-[18px] text-sd-grey-11">
              Nothing else in the queue shares this title.
            </p>
          ) : (
            <div className="flex flex-col gap-[8px]">
              {siblings.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center justify-between gap-[12px] rounded-[10px] border border-sd-grey-3 bg-white p-[12px]",
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-[4px]">
                    <span className="truncate text-[13px] leading-[18px] text-sd-grey-12">
                      {row.developer_email}
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="font-mono text-[12px] leading-[16px] text-sd-grey-11">
                        {row.reference}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          void navigator.clipboard
                            ?.writeText(row.reference)
                            .catch(() => {})
                        }
                        className="cursor-pointer text-sd-grey-9 transition-colors hover:text-sd-grey-11"
                        aria-label={`Copy ${row.reference}`}
                      >
                        <Copy variant="Linear" size={13} color="currentColor" />
                      </button>
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-[4px]">
                    <SubmissionStatusPill status={row.status} />
                    <span className="text-[11px] leading-[14px] text-sd-grey-11">
                      {formatAbsolute(row.created_datetime)}
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
