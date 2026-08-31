"use client";

import React from "react";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { normalizeApiError } from "@/lib/api/errors";
import { AdminRoute } from "@/lib/routes";
import {
  useGetMieRejectionReasonsQuery,
  useRejectMieSubmissionMutation,
} from "../hooks";
import { Callout } from "./SharedUI";
import { SubmissionStatus, type MieSubmission } from "../types";
import {
  rejectSubmissionSchema,
  type RejectSubmissionFormData,
} from "../utils/validation";

interface RejectSubmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MieSubmission | null;
  onRejected?: (submission: MieSubmission) => void;
}

/**
 * The reason is required and must be an existing active label — the backend
 * matches on the label string, so the select is fed from the live taxonomy
 * rather than a hardcoded list.
 */
export const RejectSubmissionModal = ({
  isOpen,
  onOpenChange,
  submission,
  onRejected,
}: RejectSubmissionModalProps) => {
  const { data: reasonsResponse, isLoading: isLoadingReasons } =
    useGetMieRejectionReasonsQuery(
      { is_active: true, size: 100 },
      { skip: !isOpen },
    );
  const [rejectSubmission, { isLoading }] = useRejectMieSubmissionMutation();

  const reasons = reasonsResponse?.data?.results ?? [];

  const methods = useForm<RejectSubmissionFormData>({
    resolver: zodResolver(rejectSubmissionSchema),
    mode: "onBlur",
    defaultValues: { rejection_reason: "", rejection_note: "" },
  });

  // Reopening for a different idea must not inherit the previous answer, and a
  // re-rejection should start from whatever reason is already on record.
  React.useEffect(() => {
    if (!isOpen) return;
    methods.reset({
      rejection_reason: submission?.rejection_reason ?? "",
      rejection_note: submission?.rejection_note ?? "",
    });
  }, [isOpen, submission?.id, submission?.rejection_reason, submission?.rejection_note, methods]);

  const handleClose = () => {
    methods.reset({ rejection_reason: "", rejection_note: "" });
    onOpenChange(false);
  };

  const onSubmit = async (values: RejectSubmissionFormData) => {
    if (!submission) return;

    try {
      const result = await rejectSubmission({
        id: submission.id,
        body: {
          rejection_reason: values.rejection_reason,
          ...(values.rejection_note.trim()
            ? { rejection_note: values.rejection_note.trim() }
            : {}),
        },
      }).unwrap();

      toast.success(result.detail || "Submission rejected");
      handleClose();
      onRejected?.(result.submission);
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );

      if (fieldErrors.rejection_reason) {
        methods.setError("rejection_reason", {
          message: fieldErrors.rejection_reason,
        });
      }
      if (fieldErrors.rejection_note) {
        methods.setError("rejection_note", {
          message: fieldErrors.rejection_note,
        });
      }
      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(message ?? "Failed to reject submission");
      }
    }
  };

  const wasApproved = submission?.status === SubmissionStatus.APPROVED;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      showCloseButton={false}
      className="rounded-[16px] border border-sd-grey-3 p-[20px] sm:max-w-[560px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold leading-[32px] tracking-[-0.4px] text-sd-grey-12">
            Reject submission
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close reject submission modal"
          >
            <X size={18} />
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px]"
        >
          <div className="flex flex-col gap-[4px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
            <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              {submission?.title ?? "—"}
            </span>
            <span className="font-mono text-[12px] leading-[16px] text-sd-grey-11">
              {submission?.reference ?? "—"} · {submission?.developer_email ?? "—"}
            </span>
          </div>

          {wasApproved && (
            <Callout tone="warning">
              This idea is already approved. Rejecting it unpublishes and parks
              any course it produced — nothing is deleted, and approving again
              relinks it.
            </Callout>
          )}

          <FormSelect
            name="rejection_reason"
            label="Rejection reason"
            required
            searchable
            options={reasons.map((reason) => ({
              label: reason.label,
              value: reason.label,
            }))}
            placeholder={
              isLoadingReasons ? "Loading reasons..." : "Select a reason"
            }
            emptyText="No active reasons found."
            searchPlaceholder="Search reasons"
            disabled={isLoadingReasons}
            triggerClassName="h-[44px] bg-white text-sd-grey-12"
          />

          {!isLoadingReasons && reasons.length === 0 && (
            <Callout tone="danger">
              There are no active rejection reasons yet, so nothing can be
              rejected.{" "}
              <Link
                href={AdminRoute.MIE_REJECTION_REASONS}
                className="underline"
              >
                Add one first
              </Link>
              .
            </Callout>
          )}

          <FormTextarea
            name="rejection_note"
            label="Note to the developer"
            placeholder="Optional context — this reaches the developer with the webhook."
            rows={4}
            className="min-h-[110px] bg-white"
          />

          <div className="flex gap-[12px] pt-[4px]">
            <Button
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[132px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="app"
              className="h-[44px] min-w-[133px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              isLoading={isLoading}
              disabled={reasons.length === 0}
            >
              Reject submission
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
