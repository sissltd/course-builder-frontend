"use client";

import React from "react";
import {
  Book,
  DirectInbox,
  Money,
  TickCircle,
  Notification,
  Warning2,
  Danger,
  ShieldTick,
  SearchNormal1,
  Monitor,
} from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../api/notificationPreferencesApi";
import type { NotificationPreferences } from "@/modules/auth/types/auth";

type ToggleKey = keyof Omit<
  NotificationPreferences,
  "id" | "in_app_enabled" | "sla_amber_threshold_hours_override" | "sla_red_threshold_hours_override"
>;

type ToggleDef = {
  key: ToggleKey;
  label: string;
  description: string;
  Icon: React.ElementType;
};

const toggleItems: ToggleDef[] = [
  { key: "new_course_assigned", label: "Course assigned", description: "Get notified when a new course is assigned to you", Icon: Book },
  { key: "escalation_assigned", label: "Escalation assigned", description: "Get notified when an escalation is assigned to you", Icon: Warning2 },
  { key: "creator_feedback", label: "Creator feedback", description: "Get notified when you receive feedback on your courses", Icon: DirectInbox },
  { key: "sla_amber_warning", label: "SLA amber warning", description: "Get notified when a task approaches its SLA deadline", Icon: Money },
  { key: "sla_red_critical_alert", label: "SLA critical alert", description: "Get notified when a task has crossed the critical SLA threshold", Icon: Danger },
  { key: "sla_breached", label: "SLA breached", description: "Get notified when an SLA has been breached", Icon: TickCircle },
  { key: "kyc_submission_alert", label: "KYC submission alert", description: "Get notified about KYC submission status updates", Icon: ShieldTick },
  { key: "account_deletion_detection_alert", label: "Account deletion alert", description: "Get notified if an account deletion is detected", Icon: Danger },
  { key: "mie_recommendation_alert", label: "MIE recommendation", description: "Get notified when there are new MIE recommendations", Icon: SearchNormal1 },
  { key: "mie_pipeline_alert", label: "MIE pipeline alert", description: "Get notified about changes in the MIE pipeline", Icon: Monitor },
];

const AppToggle = ({
  enabled,
  onToggle,
  disabled,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    role="switch"
    aria-checked={enabled}
    className={cn(
      "relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
      enabled ? "bg-[#0063EF]" : "bg-[#D9D9D9]",
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block size-[20px] transform rounded-full bg-white ring-0 transition-transform duration-200",
        enabled ? "translate-x-[22px]" : "translate-x-[0px]",
      )}
    />
  </button>
);

export const NotificationsSettingsTab = () => {
  const { data: prefs, isLoading } = useGetNotificationPreferencesQuery();
  const [updatePrefs, { isLoading: isSaving }] =
    useUpdateNotificationPreferencesMutation();

  const handleToggle = (key: ToggleKey) => {
    if (!prefs) return;
    updatePrefs({ [key]: !prefs[key] });
  };

  const handleInAppToggle = () => {
    if (!prefs) return;
    updatePrefs({ in_app_enabled: !prefs.in_app_enabled });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
            Notification settings
          </h2>
          <p className="text-[16px] text-[#636363] leading-[24px]">
            Configure your account notifications
          </p>
        </div>
        <p className="text-[14px] text-[#636363]">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          Notification settings
        </h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">
          Configure your account notifications
        </p>
      </div>

      {/* Master in-app toggle */}
      <div className="flex items-start justify-between gap-[16px] py-[24px] border-b border-[#F0F0F0]">
        <div className="flex items-start gap-[16px]">
          <div className="size-[48px] rounded-[12px] bg-sd-grey-1 flex items-center justify-center shrink-0 border border-[#F0F0F0]">
            <Notification size={24} variant="Linear" color="#606060" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">
              In-app notifications
            </p>
            <p className="text-[14px] text-[#636363] leading-[20px]">
              Enable or disable all in-app notifications
            </p>
          </div>
        </div>
        <div className="pt-[12px]">
          <AppToggle
            enabled={prefs?.in_app_enabled ?? true}
            onToggle={handleInAppToggle}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Individual toggles */}
      <div className="flex flex-col">
        {toggleItems.map(({ key, label, description, Icon }, i) => (
          <div
            key={key}
            className={cn(
              "flex items-start justify-between gap-[16px] py-[24px]",
              i < toggleItems.length - 1 && "border-b border-[#F0F0F0]",
            )}
          >
            <div className="flex items-start gap-[16px]">
              <div className="size-[48px] rounded-[12px] bg-sd-grey-1 flex items-center justify-center shrink-0 border border-[#F0F0F0]">
                <Icon size={24} variant="Linear" color="#606060" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">
                  {label}
                </p>
                <p className="text-[14px] text-[#636363] leading-[20px]">
                  {description}
                </p>
              </div>
            </div>
            <div className="pt-[12px]">
              <AppToggle
                enabled={prefs?.[key] ?? false}
                onToggle={() => handleToggle(key)}
                disabled={isSaving}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
