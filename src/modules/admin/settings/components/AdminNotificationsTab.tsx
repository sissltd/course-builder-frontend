"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/modules/creator/settings/api/notificationPreferencesApi";

interface AdminNotificationSettings {
  in_app_enabled: boolean;
  sla_red_critical_alert: boolean;
  course_update: boolean;
}

const Toggle = ({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-label={label}
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

const NotificationRow = ({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-[24px]">
    <div className="max-w-[436px]">
      <p className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
        {title}
      </p>
      <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
        {description}
      </p>
    </div>
    <Toggle
      label={title}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  </div>
);

const NotificationsForm = ({
  initialSettings,
}: {
  initialSettings: AdminNotificationSettings;
}) => {
  const [baseline, setBaseline] =
    React.useState<AdminNotificationSettings>(initialSettings);
  const [settings, setSettings] =
    React.useState<AdminNotificationSettings>(initialSettings);
  const [updatePreferences, { isLoading }] =
    useUpdateNotificationPreferencesMutation();

  const isDirty = (
    Object.keys(settings) as Array<keyof AdminNotificationSettings>
  ).some((key) => settings[key] !== baseline[key]);

  const setField = (
    key: keyof AdminNotificationSettings,
    value: boolean,
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!isDirty) {
      toast.info("Nothing to save");
      return;
    }

    try {
      const updated = await updatePreferences(settings).unwrap();
      const savedSettings = {
        in_app_enabled: updated.in_app_enabled,
        sla_red_critical_alert: updated.sla_red_critical_alert,
        course_update: updated.course_update,
      };
      setBaseline(savedSettings);
      setSettings(savedSettings);
      toast.success("Notification settings updated");
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Could not update notification settings");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div>
        <h3 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Notification settings
        </h3>
        <p className="text-[14px] font-normal leading-[24px] text-sd-grey-11">
          Configure the in-app alerts you want to receive
        </p>
      </div>

      <div className="flex flex-col gap-[32px]">
        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="mb-[20px] block text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            NOTIFICATION CHANNELS
          </span>
          <NotificationRow
            title="In-app Notifications"
            description="Receive notifications in-app"
            checked={settings.in_app_enabled}
            disabled={isLoading}
            onChange={(checked) => setField("in_app_enabled", checked)}
          />
        </div>

        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="mb-[20px] block text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            SYSTEM
          </span>
          <NotificationRow
            title="Review SLA Breach Alert"
            description="Notify admin when a course passes the review SLA red threshold"
            checked={settings.sla_red_critical_alert}
            disabled={isLoading}
            onChange={(checked) =>
              setField("sla_red_critical_alert", checked)
            }
          />
        </div>

        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="mb-[20px] block text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
            PREFERENCE
          </span>
          <NotificationRow
            title="Course Update"
            description="Notify admin when another user submits, approves, rejects or publishes a course"
            checked={settings.course_update}
            disabled={isLoading}
            onChange={(checked) => setField("course_update", checked)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-[12px]">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || isLoading}
          onClick={() => setSettings(baseline)}
          className="h-[44px] px-[24px] text-[14px]"
        >
          Discard
        </Button>
        <Button
          type="button"
          disabled={!isDirty || isLoading}
          isLoading={isLoading}
          onClick={() => void handleSave()}
          className="h-[44px] px-[32px] text-[14px]"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export const AdminNotificationsTab = () => {
  const { data, isLoading, isError, refetch } =
    useGetNotificationPreferencesQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[24px]">
        <div className="h-[56px] w-[300px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[160px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
        <div className="h-[160px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-[16px]">
        <p className="text-[14px] text-sd-danger">
          Failed to load notification settings.
        </p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const initialSettings: AdminNotificationSettings = {
    in_app_enabled: data.in_app_enabled,
    sla_red_critical_alert: data.sla_red_critical_alert,
    course_update: data.course_update ?? false,
  };

  return (
    <NotificationsForm
      key={JSON.stringify(initialSettings)}
      initialSettings={initialSettings}
    />
  );
};
