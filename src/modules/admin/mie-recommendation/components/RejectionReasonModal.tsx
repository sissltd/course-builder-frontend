"use client";

import React from "react";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Switch } from "@/components/ui/switch";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useCreateMieRejectionReasonMutation,
  useUpdateMieRejectionReasonMutation,
} from "../hooks";
import { Callout } from "./SharedUI";
import type { MieRejectionReason } from "../types";
import {
  rejectionReasonSchema,
  type RejectionReasonFormData,
} from "../utils/validation";

interface RejectionReasonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates; a reason edits it in place. */
  reason: MieRejectionReason | null;
}

/**
 * Create or edit a taxonomy entry. There is no delete on the API — retiring a
 * reason means `is_active: false`, which keeps historical rejections intact
 * while hiding it from the reviewer's picker.
 */
export const RejectionReasonModal = ({
  isOpen,
  onOpenChange,
  reason,
}: RejectionReasonModalProps) => {
  const isEditing = !!reason;
  const [createReason, { isLoading: isCreating }] =
    useCreateMieRejectionReasonMutation();
  const [updateReason, { isLoading: isUpdating }] =
    useUpdateMieRejectionReasonMutation();

  const methods = useForm<RejectionReasonFormData>({
    resolver: zodResolver(rejectionReasonSchema),
    mode: "onBlur",
    defaultValues: { label: "", description: "", is_active: true },
  });

  const isActive = methods.watch("is_active");

  React.useEffect(() => {
    if (!isOpen) return;
    methods.reset({
      label: reason?.label ?? "",
      description: reason?.description ?? "",
      is_active: reason?.is_active ?? true,
    });
  }, [isOpen, reason, methods]);

  const handleClose = () => {
    methods.reset({ label: "", description: "", is_active: true });
    onOpenChange(false);
  };

  const onSubmit = async (values: RejectionReasonFormData) => {
    const body = {
      label: values.label.trim(),
      description: values.description.trim(),
      is_active: values.is_active,
    };

    try {
      if (reason) {
        await updateReason({ id: reason.id, body }).unwrap();
        toast.success("Rejection reason updated");
      } else {
        await createReason(body).unwrap();
        toast.success("Rejection reason added");
      }
      handleClose();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );

      if (fieldErrors.label) {
        methods.setError("label", { message: fieldErrors.label });
      }
      if (fieldErrors.description) {
        methods.setError("description", { message: fieldErrors.description });
      }
      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(
          message ??
            (reason
              ? "Failed to update rejection reason"
              : "Failed to add rejection reason"),
        );
      }
    }
  };

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
            {isEditing ? "Edit rejection reason" : "Add rejection reason"}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close rejection reason modal"
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
          <FormInput
            name="label"
            label="Label"
            placeholder="e.g. Out of catalogue scope"
            required
            hint="Reviewers pick this exact wording, and the developer sees it."
            className="h-[44px] bg-white"
          />

          <FormTextarea
            name="description"
            label="Description"
            placeholder="When should a reviewer choose this reason?"
            rows={3}
            className="min-h-[96px] bg-white"
          />

          <div className="flex items-start justify-between gap-[16px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                Available to reviewers
              </span>
              <span className="text-[12px] leading-[16px] text-sd-grey-11">
                Turning this off retires the reason. Past rejections keep it.
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) =>
                methods.setValue("is_active", checked, { shouldDirty: true })
              }
              aria-label="Available to reviewers"
            />
          </div>

          {isEditing && reason?.is_active && !isActive && (
            <Callout tone="warning">
              Reviewers will no longer be able to pick this reason once you save.
            </Callout>
          )}

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
              variant="app-primary"
              size="app"
              className="h-[44px] min-w-[133px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              isLoading={isCreating || isUpdating}
            >
              {isEditing ? "Save changes" : "Add reason"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
