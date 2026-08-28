"use client";

import React from "react";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TickCircle } from "iconsax-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useRegisterMieDeveloperMutation } from "../hooks";
import { Callout } from "./SharedUI";
import { planTypeHints, planTypeLabels } from "../utils/format";
import { MiePlanType, type MieDeveloper } from "../types";
import {
  onboardDeveloperSchema,
  type OnboardDeveloperFormData,
} from "../utils/validation";

interface OnboardDeveloperModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fired with the created PENDING account so the caller can offer approval. */
  onCreated?: (developer: MieDeveloper) => void;
}

const planOptions = Object.values(MiePlanType).map((value) => ({
  value,
  label: (
    <span className="flex flex-col gap-[2px] py-[2px]">
      <span className="text-[14px] leading-[20px] text-sd-grey-12">
        {planTypeLabels[value]}
      </span>
      <span className="text-[12px] leading-[16px] text-sd-grey-11">
        {planTypeHints[value]}
      </span>
    </span>
  ),
  searchValue: planTypeLabels[value],
}));

/**
 * Manual onboarding for a developer who cannot self-register. The account lands
 * in PENDING exactly like a self-registration — no key exists until approval.
 */
export const OnboardDeveloperModal = ({
  isOpen,
  onOpenChange,
  onCreated,
}: OnboardDeveloperModalProps) => {
  const [registerDeveloper, { isLoading }] = useRegisterMieDeveloperMutation();

  const methods = useForm<OnboardDeveloperFormData>({
    resolver: zodResolver(onboardDeveloperSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      webhook_url: "",
      plan_type: MiePlanType.PAID_PER_SUBMISSION,
    },
  });

  const handleClose = () => {
    methods.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: OnboardDeveloperFormData) => {
    try {
      const developer = await registerDeveloper({
        email: values.email.trim(),
        webhook_url: values.webhook_url.trim(),
        plan_type: values.plan_type,
      }).unwrap();

      toast.success("Developer registered — awaiting approval", {
        icon: (
          <div className="flex size-[40px] items-center justify-center rounded-full bg-[var(--sd-success-bg)]">
            <TickCircle variant="Bold" size={20} color="var(--sd-success)" />
          </div>
        ),
        classNames: {
          toast:
            "min-h-[72px] w-[356px] rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[12px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]",
          title:
            "text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]",
          icon: "!mr-[10px] !size-auto",
        },
      });

      handleClose();
      onCreated?.(developer);
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );

      // Field-level errors belong on the field; the rest surfaces as a toast.
      (Object.keys(fieldErrors) as (keyof OnboardDeveloperFormData)[]).forEach(
        (field) => {
          if (field in methods.getValues()) {
            methods.setError(field, { message: fieldErrors[field] });
          }
        },
      );

      if (message || Object.keys(fieldErrors).length === 0) {
        toast.error(message ?? "Failed to register developer");
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
            Onboard MIE developer
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close onboard developer modal"
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
          <Callout tone="info">
            The account is created in <strong>Pending</strong>. Approving it is
            what issues the API key — and the key is shown only once, right then.
          </Callout>

          <FormInput
            name="email"
            label="Developer email"
            placeholder="developer@example.com"
            type="email"
            required
            className="h-[44px] bg-white"
          />

          <FormInput
            name="webhook_url"
            label="Webhook URL"
            placeholder="https://example.com/hooks/mie"
            required
            hint="Every approval and rejection is POSTed here."
            className="h-[44px] bg-white"
          />

          <FormSelect
            name="plan_type"
            label="Payout plan"
            options={planOptions}
            required
            placeholder="Select plan"
            triggerClassName="h-[44px] bg-white text-sd-grey-12"
            hint="Account-wide default. Individual ideas can still be marked no-payout."
          />

          <div className="flex gap-[12px] pt-[8px]">
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
              isLoading={isLoading}
            >
              Register developer
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
