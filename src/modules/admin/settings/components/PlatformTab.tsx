"use client";

import React from "react";
import { toast } from "sonner";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { normalizeApiError } from "@/lib/api/errors";
import {
  type PlatformSettings,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} from "../api/platformSettingsApi";

type NumericPlatformKey =
  | "draft_minimum_hold_hours"
  | "topic_reservation_expiry_days"
  | "sla_amber_threshold_hours"
  | "sla_red_threshold_hours"
  | "auto_flag_after_hours";

type PlatformFormValues = Record<NumericPlatformKey, string>;

const minimumValues: Record<NumericPlatformKey, number> = {
  draft_minimum_hold_hours: 0,
  topic_reservation_expiry_days: 1,
  sla_amber_threshold_hours: 1,
  sla_red_threshold_hours: 1,
  auto_flag_after_hours: 0,
};

interface PlatformField {
  key: NumericPlatformKey;
  title: string;
  description: string;
  unit: "hours" | "days";
}

const sections: Array<{ title: string; fields: PlatformField[] }> = [
  {
    title: "TIMING & THRESHOLDS",
    fields: [
      {
        key: "draft_minimum_hold_hours",
        title: "Draft minimum hold time",
        description:
          "Set the number of hours required for a new course to stay in draft before submission",
        unit: "hours",
      },
      {
        key: "topic_reservation_expiry_days",
        title: "Topic reservation expiration",
        description:
          "Set how long an inactive topic reservation remains unavailable",
        unit: "days",
      },
    ],
  },
  {
    title: "REVIEW",
    fields: [
      {
        key: "sla_amber_threshold_hours",
        title: "Review SLA amber threshold",
        description:
          "Set when a course approaching its review deadline enters the amber state",
        unit: "hours",
      },
      {
        key: "sla_red_threshold_hours",
        title: "Review SLA - admin alert",
        description:
          "Alert admins once when a course remains in review beyond this period",
        unit: "hours",
      },
      {
        key: "auto_flag_after_hours",
        title: "Flagging hour",
        description:
          "Flag a course for attention when no decision is made within this period",
        unit: "hours",
      },
    ],
  },
];

const toFormValues = (settings: PlatformSettings): PlatformFormValues => ({
  draft_minimum_hold_hours: String(settings.draft_minimum_hold_hours),
  topic_reservation_expiry_days: String(
    settings.topic_reservation_expiry_days,
  ),
  sla_amber_threshold_hours: String(settings.sla_amber_threshold_hours),
  sla_red_threshold_hours: String(settings.sla_red_threshold_hours),
  auto_flag_after_hours: String(settings.auto_flag_after_hours),
});

const PlatformSettingsForm = ({ settings }: { settings: PlatformSettings }) => {
  const [baseline, setBaseline] = React.useState(() => toFormValues(settings));
  const [values, setValues] = React.useState(() => toFormValues(settings));
  const [errors, setErrors] = React.useState<
    Partial<Record<NumericPlatformKey, string>>
  >({});
  const [updateSettings, { isLoading }] =
    useUpdatePlatformSettingsMutation();

  const isDirty = (Object.keys(values) as NumericPlatformKey[]).some(
    (key) => values[key] !== baseline[key],
  );

  const handleSave = async () => {
    const nextErrors: Partial<Record<NumericPlatformKey, string>> = {};
    const payload = {} as Record<NumericPlatformKey, number>;

    for (const key of Object.keys(values) as NumericPlatformKey[]) {
      const value = Number(values[key]);
      const minimum = minimumValues[key];
      if (!Number.isInteger(value) || value < minimum) {
        nextErrors[key] = `Enter a whole number of ${minimum} or more`;
      } else {
        payload[key] = value;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const updated = await updateSettings(payload).unwrap();
      const savedValues = toFormValues(updated);
      setBaseline(savedValues);
      setValues(savedValues);
      setErrors({});
      toast.success("Platform settings updated");
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      const fieldErrors: Partial<Record<NumericPlatformKey, string>> = {};
      for (const [field, message] of Object.entries(normalized.fieldErrors)) {
        if (field in values) {
          fieldErrors[field as NumericPlatformKey] = message;
        }
      }
      setErrors(fieldErrors);
      toast.error(normalized.message ?? "Could not update platform settings");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium leading-[32px] tracking-[-0.44px] text-sd-grey-12">
          Platform settings
        </h3>
        <p className="max-w-[510px] text-[14px] font-normal leading-[24px] text-sd-grey-11">
          Configure operational rules that govern creator and course behavior
        </p>
      </div>

      <div className="flex flex-col gap-[40px]">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]"
          >
            <div className="flex flex-col gap-[20px]">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                {section.title}
              </span>

              <div className="flex flex-col gap-[18px]">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-start justify-between gap-[24px]"
                  >
                    <div className="flex max-w-[430px] flex-col gap-[4px]">
                      <h4 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                        {field.title}
                      </h4>
                      <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                        {field.description}
                      </p>
                    </div>

                    <div className="w-[146px] shrink-0">
                      <FormInput
                        name={field.key}
                        type="number"
                        inputMode="numeric"
                        min={String(minimumValues[field.key])}
                        value={values[field.key]}
                        error={errors[field.key]}
                        disabled={isLoading}
                        rightElement={
                          <span className="text-[12px] text-sd-grey-10">
                            {field.unit}
                          </span>
                        }
                        onChange={(event) => {
                          setValues((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }));
                          setErrors((current) => ({
                            ...current,
                            [field.key]: undefined,
                          }));
                        }}
                        className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white pr-[58px] text-[14px] text-sd-grey-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-[12px]">
        <AppButton
          type="button"
          variant="outline"
          size="app"
          disabled={!isDirty || isLoading}
          onClick={() => {
            setValues(baseline);
            setErrors({});
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

export const PlatformTab = () => {
  const { data, isLoading, isError, refetch } =
    useGetPlatformSettingsQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[32px]">
        <div className="h-[56px] w-[320px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[260px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
        <div className="h-[260px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-[16px]">
        <p className="text-[14px] text-sd-danger">
          Failed to load platform settings.
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

  return <PlatformSettingsForm key={JSON.stringify(data)} settings={data} />;
};
