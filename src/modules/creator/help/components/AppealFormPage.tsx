"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { normalizeApiError } from "@/lib/api/errors";
import { useCreateSupportAppealMutation } from "@/modules/support/hooks";
import { SUPPORT_FIELD_MAP } from "@/modules/support/types";
import { appealSchema, type AppealFormData } from "../utils/validation";

interface AppealFormPageProps {
  onSubmitSuccess: () => void;
}

const EMPTY: AppealFormData = {
  title: "",
  email: "",
  webLink: "",
  description: "",
};

/**
 * Standalone appeal form, reached from the Help > Support tab as
 * `?view=appeal`.
 *
 * Kept as a full page rather than a dialog because it already existed as one and
 * has a design — reusing it verbatim is preferable to rebuilding it as a modal.
 * The `setTimeout` it carried while there was no endpoint is now the real
 * `POST /support/appeals/` mutation; values go out snake_case and the backend's
 * `field_name`s come back in through `SUPPORT_FIELD_MAP` so a `web_link`
 * rejection lands on the `webLink` input.
 *
 * Open to a suspended creator, so nothing here reads account status.
 */
export const AppealFormPage = ({ onSubmitSuccess }: AppealFormPageProps) => {
  const [createAppeal, { isLoading: isSubmitting }] =
    useCreateSupportAppealMutation();

  const methods = useForm<AppealFormData>({
    resolver: zodResolver(appealSchema),
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  const handleSubmit = async (values: AppealFormData) => {
    try {
      await createAppeal({
        title: values.title.trim(),
        email: values.email.trim(),
        ...(values.webLink?.trim() ? { web_link: values.webLink.trim() } : {}),
        description: values.description.trim(),
      }).unwrap();

      methods.reset(EMPTY);
      toast.success("Appeal submitted. We'll review it and get back to you.");
      onSubmitSuccess();
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
    <div className="flex flex-col items-center w-full py-[40px] px-[20px]">
      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <h1 className="text-[28px] font-semibold text-[#202020] text-center leading-[36px]">
          Request for an appeal
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="flex flex-col gap-[24px]"
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
              required
              type="email"
              placeholder="Enter email address"
            />
            <FormInput
              name="webLink"
              label="Web link"
              placeholder="Enter address"
              leftElement={
                <span className="text-[14px] text-[#8C8C8C] pr-[8px] border-r border-[#CECECE]">
                  https://
                </span>
              }
            />
            <FormTextarea
              name="description"
              label="Description"
              required
              placeholder="Describe your problem"
              rows={5}
            />
            <Button
              type="submit"
              variant="app-primary"
              size="app"
              isLoading={isSubmitting}
              className="w-full"
            >
              Send request
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
