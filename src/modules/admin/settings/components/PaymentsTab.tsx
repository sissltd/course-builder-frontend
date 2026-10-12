"use client";

import React from "react";
import { ArrowDown2 } from "iconsax-react";
import { toast } from "sonner";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { cn } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api/errors";
import {
  type PaymentProcessor,
  type PlatformSettings,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} from "../api/platformSettingsApi";

const providerOptions = [
  { label: "Paystack", value: "PAYSTACK" },
  { label: "Flutterwave", value: "FLUTTERWAVE" },
];

interface PaymentFormValues {
  autoCreditDuration: string;
  creatorVerification: boolean;
  provider: PaymentProcessor;
}

const toFormValues = (settings: PlatformSettings): PaymentFormValues => ({
  autoCreditDuration: String(settings.auto_credit_duration_hours),
  creatorVerification: settings.withdrawal_require_verification,
  provider: settings.payment_processor,
});

const Toggle = ({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-label="Require creator verification"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sd-blue focus-visible:ring-offset-2",
      checked ? "bg-sd-blue" : "bg-sd-grey-6",
      disabled && "cursor-not-allowed opacity-50",
    )}
  >
    <span
      className={cn(
        "absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform",
        checked && "translate-x-[22px]",
      )}
    />
  </button>
);

const PaymentsForm = ({ settings }: { settings: PlatformSettings }) => {
  const [baseline, setBaseline] = React.useState(() => toFormValues(settings));
  const [values, setValues] = React.useState(() => toFormValues(settings));
  const [durationError, setDurationError] = React.useState<string>();
  const [updateSettings, { isLoading }] =
    useUpdatePlatformSettingsMutation();

  const isDirty =
    values.autoCreditDuration !== baseline.autoCreditDuration ||
    values.creatorVerification !== baseline.creatorVerification ||
    values.provider !== baseline.provider;

  const handleSave = async () => {
    const duration = Number(values.autoCreditDuration);
    if (!Number.isInteger(duration) || duration < 0) {
      setDurationError("Enter a whole number of zero or more");
      return;
    }

    try {
      const updated = await updateSettings({
        auto_credit_duration_hours: duration,
        withdrawal_require_verification: values.creatorVerification,
        payment_processor: values.provider,
      }).unwrap();
      const savedValues = toFormValues(updated);
      setBaseline(savedValues);
      setValues(savedValues);
      setDurationError(undefined);
      toast.success("Payment settings updated");
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      setDurationError(
        normalized.fieldErrors.auto_credit_duration_hours ?? undefined,
      );
      toast.error(normalized.message ?? "Could not update payment settings");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium leading-[32px] tracking-[-0.44px] text-sd-grey-12">
          Payment
        </h3>
        <p className="text-[14px] font-normal leading-[24px] text-sd-grey-11">
          Configure how payment is handled
        </p>
      </div>

      <div className="flex flex-col gap-[22px]">
        <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]">
          <div className="flex flex-col gap-[22px]">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              CREATOR WALLET
            </span>

            <div className="flex items-start justify-between gap-[24px]">
              <div className="flex max-w-[420px] flex-col gap-[4px]">
                <h4 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  Payment auto-credit duration
                </h4>
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  Set the hours before an approved creator-uploaded course is
                  credited
                </p>
              </div>

              <div className="w-[146px] shrink-0">
                <FormInput
                  name="auto_credit_duration_hours"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={values.autoCreditDuration}
                  error={durationError}
                  disabled={isLoading}
                  rightElement={
                    <span className="text-[12px] text-sd-grey-10">hours</span>
                  }
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      autoCreditDuration: event.target.value,
                    }));
                    setDurationError(undefined);
                  }}
                  className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white pr-[58px] text-[14px] text-sd-grey-10"
                />
              </div>
            </div>

            <div className="flex items-start justify-between gap-[24px]">
              <div className="flex max-w-[420px] flex-col gap-[4px]">
                <h4 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  Creator Verification
                </h4>
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  Require creators to pass KYC before initiating withdrawals
                </p>
              </div>

              <Toggle
                checked={values.creatorVerification}
                disabled={isLoading}
                onChange={(creatorVerification) =>
                  setValues((current) => ({
                    ...current,
                    creatorVerification,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]">
          <div className="flex items-start justify-between gap-[24px]">
            <div className="flex flex-col gap-[4px]">
              <h4 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Payment provider
              </h4>
              <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Select the platform&apos;s primary payment processor
              </p>
            </div>

            <div className="w-[196px] shrink-0">
              <FormSelect
                name="payment_processor"
                value={values.provider}
                disabled={isLoading}
                onValueChange={(provider) =>
                  setValues((current) => ({
                    ...current,
                    provider: provider as PaymentProcessor,
                  }))
                }
                options={providerOptions}
                triggerClassName="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-sd-grey-12 hover:bg-white"
                suffix={
                  <ArrowDown2
                    size={20}
                    variant="Linear"
                    color="var(--sd-grey-11)"
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[12px]">
        <AppButton
          type="button"
          variant="outline"
          size="app"
          disabled={!isDirty || isLoading}
          onClick={() => {
            setValues(baseline);
            setDurationError(undefined);
          }}
          className="h-[44px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
        >
          Discard
        </AppButton>
        <AppButton
          type="button"
          variant="app-primary"
          size="app"
          disabled={!isDirty || isLoading}
          isLoading={isLoading}
          onClick={() => void handleSave()}
          className="h-[44px] min-w-[151px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
        >
          Save changes
        </AppButton>
      </div>
    </div>
  );
};

export const PaymentsTab = () => {
  const { data, isLoading, isError, refetch } =
    useGetPlatformSettingsQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[32px]">
        <div className="h-[56px] w-[280px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[240px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
        <div className="h-[120px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-[16px]">
        <p className="text-[14px] text-sd-danger">
          Failed to load payment settings.
        </p>
        <AppButton
          type="button"
          variant="outline"
          onClick={() => void refetch()}
        >
          Try again
        </AppButton>
      </div>
    );
  }

  return <PaymentsForm key={JSON.stringify(data)} settings={data} />;
};
