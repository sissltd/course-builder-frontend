"use client";

import React from "react";
import { toast } from "sonner";
import { ArrowDown2, DirectInbox } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { Switch } from "./Switch";
import { normalizeApiError } from "@/lib/api/errors";
import { useSettingsDraft } from "../hooks/useSettingsDraft";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/modules/creator/settings/api/notificationPreferencesApi";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "@/modules/auth/types/auth";

/**
 * Merged under the server value — a field the API omits should fall back to its
 * documented default rather than render as a false "off".
 *
 * The thresholds are `0`, not the 36/48 the design doc suggested: the live
 * response returns `0` for both, meaning "no override".
 */
const FALLBACK_PREFERENCES: NotificationPreferences = {
  id: "",
  new_course_assigned: true,
  escalation_assigned: true,
  creator_feedback: true,
  sla_amber_warning: true,
  sla_red_critical_alert: true,
  sla_breached: true,
  kyc_submission_alert: true,
  account_deletion_detection_alert: true,
  mie_recommendation_alert: true,
  mie_pipeline_alert: true,
  in_app_enabled: true,
  sla_amber_threshold_hours_override: 0,
  sla_red_threshold_hours_override: 0,
};

type ToggleKey = {
  [K in keyof NotificationPreferences]: NotificationPreferences[K] extends boolean
    ? K
    : never;
}[keyof NotificationPreferences];

const QUEUE_ALERTS: Array<{
  key: ToggleKey;
  label: string;
  description: string;
}> = [
  {
    key: "new_course_assigned",
    label: "New course assigned to me",
    description: "Get notified when a course is assigned to you",
  },
  {
    key: "escalation_assigned",
    label: "Escalation assigned to me",
    description: "QA Reviewer only — appeals escalated to you",
  },
  {
    key: "creator_feedback",
    label: "Creator feedback",
    description: "When a creator appeals for a course",
  },
];

const SLA_ALERTS: Array<{
  key: ToggleKey;
  label: string;
  description: string;
}> = [
  {
    key: "sla_amber_warning",
    label: "SLA Amber Warning",
    description: "When a course in your queue hits the amber threshold",
  },
  {
    key: "sla_red_critical_alert",
    label: "SLA Red Critical Alert",
    description: "When a course hits critical threshold",
  },
  {
    key: "sla_breached",
    label: "SLA Breached",
    description: "Fires immediately when 48h window is missed",
  },
];

/**
 * `0` is what the API returns when no override is set, so it needs an option of
 * its own — without one the `<select>` has no matching option and renders blank
 * for every account that has never changed this.
 */
const THRESHOLD_OPTIONS = [
  { value: 0, label: "Platform default" },
  { value: 24, label: "24h" },
  { value: 36, label: "36h" },
  { value: 48, label: "48h" },
] as const;

type ThresholdKey =
  | "sla_amber_threshold_hours_override"
  | "sla_red_threshold_hours_override";

const NotificationsForm = ({ server }: { server: NotificationPreferences }) => {
  const [updatePreferences, { isLoading: isSaving }] =
    useUpdateNotificationPreferencesMutation();

  const { draft, setField, isDirty, reset } = useSettingsDraft(server);

  const handleSave = async () => {
    if (!isDirty) {
      toast.info("Nothing to save");
      return;
    }
    try {
      const payload: UpdateNotificationPreferencesRequest = {
        new_course_assigned: draft.new_course_assigned,
        escalation_assigned: draft.escalation_assigned,
        creator_feedback: draft.creator_feedback,
        sla_amber_warning: draft.sla_amber_warning,
        sla_red_critical_alert: draft.sla_red_critical_alert,
        sla_breached: draft.sla_breached,
        kyc_submission_alert: draft.kyc_submission_alert,
        account_deletion_detection_alert:
          draft.account_deletion_detection_alert,
        mie_recommendation_alert: draft.mie_recommendation_alert,
        mie_pipeline_alert: draft.mie_pipeline_alert,
        in_app_enabled: draft.in_app_enabled,
        sla_amber_threshold_hours_override:
          draft.sla_amber_threshold_hours_override,
        sla_red_threshold_hours_override:
          draft.sla_red_threshold_hours_override,
      };
      await updatePreferences(payload).unwrap();
      toast.success("Notification settings updated");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not update notification settings");
    }
  };

  const renderAlertRow = (alert: (typeof QUEUE_ALERTS)[number]) => (
    <div key={String(alert.key)} className="flex items-center justify-between gap-[24px]">
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
          {alert.label}
        </span>
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {alert.description}
        </span>
      </div>
      <Switch
        checked={draft[alert.key]}
        disabled={isSaving}
        onChange={(checked) => setField(alert.key, checked)}
      />
    </div>
  );

  const renderThresholdRow = (
    label: string,
    description: string,
    key: ThresholdKey,
  ) => (
    <div className="flex items-center justify-between gap-[24px]">
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
          {label}
        </span>
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {description}
        </span>
      </div>
      <div className="relative flex w-[120px] items-center">
        <select
          value={draft[key]}
          disabled={isSaving}
          onChange={(e) => setField(key, Number(e.target.value))}
          className="flex h-[40px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[36px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer disabled:opacity-50"
        >
          {THRESHOLD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowDown2
          size={18}
          variant="Linear"
          color="var(--sd-grey-11)"
          className="absolute right-[12px] pointer-events-none"
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Notification settings
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Configure how your events demonstrate
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          QUEUE AND ASSIGNED ALERTS
        </h3>
        {QUEUE_ALERTS.map(renderAlertRow)}
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          SLA ALERTS
        </h3>
        {SLA_ALERTS.map(renderAlertRow)}
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          SLA THRESHOLDS
        </h3>
        {renderThresholdRow(
          "Amber warning",
          "Configure alert threshold",
          "sla_amber_threshold_hours_override",
        )}
        {renderThresholdRow(
          "Red Critical Threshold",
          "Configure alert threshold",
          "sla_red_threshold_hours_override",
        )}
      </div>

      <div className="flex items-center justify-between gap-[24px] px-[8px] pt-[8px]">
        <div className="flex items-center gap-[16px]">
          <DirectInbox size={24} variant="Linear" color="var(--sd-grey-11)" />
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              In-app notification
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Configure how you receive update
            </span>
          </div>
        </div>
        <Switch
          checked={draft.in_app_enabled}
          disabled={isSaving}
          onChange={(checked) => setField("in_app_enabled", checked)}
        />
      </div>

      <div className="flex justify-end gap-[12px] pt-[8px]">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || isSaving}
          onClick={reset}
          className="h-[44px] rounded-[8px] px-[24px] text-[14px] font-medium"
        >
          Discard
        </Button>
        <Button
          type="button"
          size="app"
          disabled={!isDirty || isSaving}
          onClick={handleSave}
          className="h-[44px] rounded-[8px] bg-[#0056D2] px-[24px] text-[14px] font-medium text-white hover:bg-[#0047B8] disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export const NotificationsTab = () => {
  const { data, isLoading } = useGetNotificationPreferencesQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[24px]">
        <div className="h-[40px] w-[280px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[200px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
        <div className="h-[200px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
      </div>
    );
  }

  return (
    <NotificationsForm server={{ ...FALLBACK_PREFERENCES, ...(data ?? {}) }} />
  );
};
