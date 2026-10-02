"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import { normalizeApiError } from "@/lib/api/errors";
import { useSendContactMessageMutation } from "../hooks";
import { SUPPORT_FIELD_MAP } from "../types";
import { describeContactError } from "../utils/errors";
import { contactSchema, type ContactFormData } from "../utils/validation";

interface ContactSupportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: () => void;
}

const EMPTY: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  message: "",
};

/**
 * In-app equivalent of the public `/contact` form, for a signed-in caller.
 *
 * Same endpoint and the same schema, so the two cannot drift; what differs is
 * that the endpoint is public and IP-rate-limited, hence `describeContactError`
 * — a 429 means "come back later", not "your message failed", and telling the
 * user the latter would invite them to retype it.
 */
export const ContactSupportModal = ({
  isOpen,
  onOpenChange,
  onSent,
}: ContactSupportModalProps) => {
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const methods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  const handleClose = () => {
    methods.reset(EMPTY);
    onOpenChange(false);
  };

  const onSubmit = async (values: ContactFormData) => {
    try {
      await sendContactMessage({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        country: values.country,
        message: values.message.trim(),
      }).unwrap();

      toast.success("Thanks for reaching out! We'll get back to you soon.");
      handleClose();
      onSent?.();
    } catch (err) {
      const typed = err as Parameters<typeof normalizeApiError>[0];
      const { fieldErrors } = normalizeApiError(typed, SUPPORT_FIELD_MAP);

      if (fieldErrors.firstName) {
        methods.setError("firstName", { message: fieldErrors.firstName });
      }
      if (fieldErrors.lastName) {
        methods.setError("lastName", { message: fieldErrors.lastName });
      }
      if (fieldErrors.email) {
        methods.setError("email", { message: fieldErrors.email });
      }
      if (fieldErrors.country) {
        methods.setError("country", { message: fieldErrors.country });
      }
      if (fieldErrors.message) {
        methods.setError("message", { message: fieldErrors.message });
      }

      // Read through `describeContactError` rather than `normalizeApiError`'s own
      // message so a 429 says "come back later" instead of being flattened into
      // "Request failed with status 429."
      toast.error(describeContactError(err).message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Contact support"
      description="Send us a message and we'll reply to the address you give."
      className="sm:max-w-[560px]"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px]"
        >
          <div className="flex flex-col gap-[16px] sm:flex-row">
            <FormInput
              name="firstName"
              label="First name"
              required
              placeholder="Enter first name"
            />
            <FormInput
              name="lastName"
              label="Last name"
              required
              placeholder="Enter last name"
            />
          </div>
          <FormInput
            name="email"
            label="Email address"
            type="email"
            required
            placeholder="Enter email address"
          />
          <FormSelect
            name="country"
            label="Country/region"
            required
            placeholder="Select country/region"
            searchable
            searchPlaceholder="Search country"
            options={COUNTRY_OPTIONS}
          />
          <FormTextarea
            name="message"
            label="Message"
            required
            rows={4}
            placeholder="Tell us what you need help with"
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
              Send message
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
