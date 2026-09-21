"use client";

import React from "react";
import { toast } from "sonner";
import { ArrowDown2 } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { Switch } from "./Switch";
import { normalizeApiError } from "@/lib/api/errors";
import { useSettingsDraft } from "../hooks/useSettingsDraft";
import {
  useGetReviewerQueuePreferencesQuery,
  useUpdateReviewerQueuePreferencesMutation,
  QUEUE_SORT_OPTIONS,
  EFFECTIVE_TRACK_LABELS,
  type ReviewerQueuePreferences,
  type ReviewQueueSortOrder,
} from "../api/reviewerSettingsApi";

/** Fallback for the window before the query resolves; the toggles default on. */
const FALLBACK_PREFERENCES: ReviewerQueuePreferences = {
  id: "",
  show_ai_track: true,
  show_creator_track: true,
  show_both_track: true,
  effective_track_filter: "ALL",
  default_sort_order: "ALL",
  auto_advance_enabled: false,
};

const TRACK_TOGGLES: Array<{
  key: "show_ai_track" | "show_creator_track" | "show_both_track";
  label: string;
  description: string;
}> = [
  {
    key: "show_ai_track",
    label: "Show AI track courses",
    description: "Include APE-produced course in your queue",
  },
  {
    key: "show_creator_track",
    label: "Show creator track courses",
    description: "Include human-submitted courses in your queue",
  },
  {
    key: "show_both_track",
    label: "Show both track",
    description: "Include all type of courses in your queue",
  },
];

type TrackToggleKey = (typeof TRACK_TOGGLES)[number]["key"];

const QueuePreferencesForm = ({ server }: { server: ReviewerQueuePreferences }) => {
  const [updatePreferences, { isLoading: isSaving }] =
    useUpdateReviewerQueuePreferencesMutation();

  const { draft, setField, isDirty, reset } = useSettingsDraft(server);

  /**
   * The effective filter describes the *saved* toggles, so it is read from the
   * server value — never from the local draft, which the server has not
   * accepted yet.
   */
  const effectiveFilter = server.effective_track_filter;
  const setTrack = (key: TrackToggleKey, value: boolean) => setField(key, value);

  const handleSave = async () => {
    if (!isDirty) {
      toast.info("Nothing to save");
      return;
    }
    try {
     
      await updatePreferences({
        show_ai_track: draft.show_ai_track,
        show_creator_track: draft.show_creator_track,
        show_both_track: draft.show_both_track,
        default_sort_order: draft.default_sort_order,
        auto_advance_enabled: draft.auto_advance_enabled,
      }).unwrap();
      toast.success("Queue behaviour updated");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not update queue behaviour");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Queue Behaviour
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Control how courses are sorted and surfaced in your review queue
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        {/* Default sort order */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Default sort order
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              How courses are ordered when you open the queue
            </span>
          </div>
          <div className="relative flex w-[240px] items-center">
            <select
              value={draft.default_sort_order}
              disabled={isSaving}
              onChange={(e) =>
                setField("default_sort_order", e.target.value as ReviewQueueSortOrder)
              }
              className="flex h-[40px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[36px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer disabled:opacity-50"
            >
              {QUEUE_SORT_OPTIONS.map((option) => (
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

        {/* Auto-advance */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Auto-advance on decision
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Load next course immediately after approval or rejection
            </span>
          </div>
          <Switch
            checked={draft.auto_advance_enabled}
            disabled={isSaving}
            onChange={(checked) => setField("auto_advance_enabled", checked)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          TRACK PREFERENCE
        </h3>

        <div className="flex flex-col gap-[24px]">
          {TRACK_TOGGLES.map((track) => (
            <div
              key={track.key}
              className="flex items-center justify-between gap-[24px]"
            >
              <div className="flex flex-col gap-[4px]">
                <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  {track.label}
                </span>
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  {track.description}
                </span>
              </div>
              <Switch
                checked={draft[track.key]}
                disabled={isSaving}
                onChange={(checked) => setTrack(track.key, checked)}
              />
            </div>
          ))}
        </div>

        {/* The server derives the effective filter — never re-derive it here. */}
        <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          Effective filter:{" "}
          <span className="font-medium text-sd-grey-12">
            {EFFECTIVE_TRACK_LABELS[effectiveFilter] ?? effectiveFilter}
          </span>
        </p>

        {/* All three off is a deliberately empty queue — say so, or it reads as a bug. */}
        {effectiveFilter === "NONE" && (
          <div className="rounded-[8px] border border-sd-warning-text/30 bg-sd-warning-bg px-[16px] py-[12px] text-[14px] leading-[20px] text-sd-warning-text">
            Every track is switched off, so your queue will stay empty until you
            turn one back on.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-[12px]">
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

export const QueueBehaviourTab = () => {
  const { data, isLoading } = useGetReviewerQueuePreferencesQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[24px]">
        <div className="h-[40px] w-[260px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[160px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
        <div className="h-[260px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
      </div>
    );
  }

  return <QueuePreferencesForm server={{ ...FALLBACK_PREFERENCES, ...(data ?? {}) }} />;
};
