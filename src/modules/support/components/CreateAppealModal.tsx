"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { normalizeApiError } from "@/lib/api/errors";
import { useCreateSupportAppealMutation } from "../hooks";
import { SUPPORT_FIELD_MAP } from "../types";
import { appealSchema, type AppealFormData } from "../utils/validation";

interface CreateAppealModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const EMPTY: AppealFormData = {
  title: "",
  email: "",
  webLink: "",
  description: "",
};

/**
 * Create-appeal form for `POST /support/appeals/`.
 *
 * Same fields as a ticket and the same snake_case mapping, but a separate
 * component: appeals are a distinct queue on the admin side, and this is the
 * in-app entry point beside the standalone `AppealFormPage`. Open to a suspended
 * creator — that is the whole point of an appeal — so nothing here reads account
 * status.
 */
export const CreateAppealModal = ({
  isOpen,
  onOpenChange,
  onCreated,
}: CreateAppealModalProps) => {
  const [createAppeal, { isLoading }] = useCreateSupportAppealMutation();

  const methods = useForm<AppealFormData>({
    resolver: zodResolver(appealSchema),
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  const handleClose = () => {
    methods.reset(EMPTY);
    onOpenChange(false);
  };

  const onSubmit = async (values: AppealFormData) => {
    try {
      await createAppeal({
        title: values.title.trim(),
        email: values.email.trim(),
        ...(values.webLink?.trim() ? { web_link: values.webLink.trim() } : {}),
        description: values.description.trim(),
      }).unwrap();

      toast.success("Appeal submitted. We'll review it and get back to you.");
      handleClose();
      onCreated?.();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
        SUPPORT_FIELD_MAP,
      );

      if (fieldErrors.title) {
        methods.setError("title", { message: fieldErrors.title });
      }
      if (fieldErrors.email) {
        methods.setError("email", { message: fieldErrors.email });
      }
      if (fieldErrors.webLink) {
        methods.setError("webLink", { message: fieldErrors.webLink });
      }
      if (fieldErrors.description) {
        methods.setError("description", { message: fieldErrors.description });
      }
      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(message ?? "Failed to submit your appeal.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Request an appeal"
      description="Explain the decision you'd like reconsidered and we'll review it."
      className="sm:max-w-[560px]"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px]"
        >
          <FormInput
            name="title"
            label="Title"
            required
            placeholder="Enter title"
          />
          <FormInput
            name="email"
            label="Email"
            type="email"
            required
            placeholder="Enter email address"
          />
          <FormInput
            name="webLink"
            label="Web link"
            placeholder="Enter address"
            leftElement={
              <span className="border-r border-[#CECECE] pr-[8px] text-[14px] text-[#8C8C8C]">
                https://
              </span>
            }
          />
          <FormTextarea
            name="description"
            label="Description"
            required
            rows={5}
            placeholder="Describe your problem"
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
              Send request
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
