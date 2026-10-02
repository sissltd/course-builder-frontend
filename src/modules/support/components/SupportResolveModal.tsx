"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormTextarea } from "@/components/form/FormTextarea";
import { getErrorStatus, normalizeApiError } from "@/lib/api/errors";
import { useResolveSupportRequestMutation } from "../hooks";
import { RESOLVABLE_STATUS, type SupportRequest } from "../types";
import { resolveNotesSchema, type ResolveNotesFormData } from "../utils/validation";

interface SupportResolveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequest | null;
  onResolved?: () => void;
}

const EMPTY: ResolveNotesFormData = { notes: "" };

/**
 * Resolve a support request — `POST /support/requests/{id}/resolve/`.
 *
 * Two things this has to get right. The action is **final**: the backend takes
 * it only while the request is `OPEN` and answers 400 to a second attempt, so a
 * stale page that still offers the button gets a handled error rather than an
 * unhandled rejection. And the confirmation says so out loud, because there is
 * no way back.
 */
export const SupportResolveModal = ({
  isOpen,
  onOpenChange,
  request,
  onResolved,
}: SupportResolveModalProps) => {
  const [resolveRequest, { isLoading }] = useResolveSupportRequestMutation();

  const methods = useForm<ResolveNotesFormData>({
    resolver: zodResolver(resolveNotesSchema),
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  const handleClose = () => {
    methods.reset(EMPTY);
    onOpenChange(false);
  };

  const onSubmit = async (values: ResolveNotesFormData) => {
    if (!request) return;

    try {
      const notes = values.notes.trim();
      await resolveRequest({
        id: request.id,
        body: notes ? { notes } : {},
      }).unwrap();

      toast.success("Request resolved.");
      handleClose();
      onResolved?.();
    } catch (err) {
      const typed = err as Parameters<typeof normalizeApiError>[0];
      const { fieldErrors, message } = normalizeApiError(typed);

      if (fieldErrors.notes) {
        methods.setError("notes", { message: fieldErrors.notes });
      }

      // 400 here is almost always "cannot resolve twice" — somebody else closed
      // it between the queue loading and this click — so it is reported as a
      // stale action with a way forward rather than as a raw backend message.
      if (getErrorStatus(typed) === 400) {
        toast.error(
          message ?? "This request can no longer be resolved — it was already decided.",
        );
        handleClose();
        onResolved?.();
        return;
      }

      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(message ?? "Failed to resolve this request.");
      }
    }
  };

  if (!request) return null;

  const isOpenRequest = request.status === RESOLVABLE_STATUS;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Resolve request"
      description="Resolving is final — the request cannot be reopened or resolved a second time."
      className="sm:max-w-[560px]"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px]"
        >
          <div className="rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
            <p className="text-[14px] leading-[20px] text-sd-grey-12">
              {request.title || "Untitled request"}
            </p>
            <p className="mt-[4px] text-[12px] leading-[16px] text-sd-grey-11">
              {isOpenRequest
                ? "Currently open — this will close it."
                : `Currently ${request.status.toLowerCase().replace(/_/g, " ")} — the backend may reject this.`}
            </p>
          </div>

          <FormTextarea
            name="notes"
            label="Resolution notes"
            rows={4}
            placeholder="What was decided, and what the submitter should do next"
            hint="Optional, but this is the only record of the outcome the submitter will ever see."
          />

          <div className="flex gap-[12px] pt-[4px]">
            <Button
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[112px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] font-normal text-sd-grey-12"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="app-primary"
              size="app"
              isLoading={isLoading}
              className="h-[44px] flex-1 rounded-[10px] px-[24px] font-normal"
            >
              Resolve request
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
