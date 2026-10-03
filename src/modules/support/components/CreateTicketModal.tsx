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
import { useCreateSupportTicketMutation } from "../hooks";
import { SUPPORT_FIELD_MAP } from "../types";
import { ticketSchema, type TicketFormData } from "../utils/validation";

interface CreateTicketModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fires after the ticket is created, so the list can scroll or toast again. */
  onCreated?: () => void;
}

const EMPTY: TicketFormData = {
  title: "",
  email: "",
  webLink: "",
  description: "",
};

/**
 * Create-ticket form for `POST /support/tickets/`.
 *
 * The API's body is snake_case while the form is camelCase, so values are mapped
 * on the way out and `SUPPORT_FIELD_MAP` maps the backend's `field_name`s back
 * onto the fields on the way in — otherwise a `web_link` validation error would
 * be filed against a field that does not exist and never reach the user.
 */
export const CreateTicketModal = ({
  isOpen,
  onOpenChange,
  onCreated,
}: CreateTicketModalProps) => {
  const [createTicket, { isLoading }] = useCreateSupportTicketMutation();

  const methods = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  const handleClose = () => {
    methods.reset(EMPTY);
    onOpenChange(false);
  };

  const onSubmit = async (values: TicketFormData) => {
    try {
      await createTicket({
        title: values.title.trim(),
        email: values.email.trim(),
        ...(values.webLink?.trim() ? { web_link: values.webLink.trim() } : {}),
        description: values.description.trim(),
      }).unwrap();

      toast.success("Ticket created. We'll be in touch shortly.");
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
        toast.error(message ?? "Failed to create your ticket.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Create a ticket"
      description="Tell us what you need help with and we'll reply by email."
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
            hint={'A short summary, e.g. "Payout not received".'}
          />
          <FormInput
            name="email"
            label="Email"
            type="email"
            required
            placeholder="Enter email address"
            hint="Where should we send the reply?"
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
              Create ticket
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
