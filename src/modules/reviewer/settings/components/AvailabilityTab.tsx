"use client";

import React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ArrowDown2, Calendar } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { Switch } from "./Switch";
import { normalizeApiError } from "@/lib/api/errors";
import { useSettingsDraft } from "../hooks/useSettingsDraft";
import {
  useGetReviewerAvailabilityQuery,
  useUpdateReviewerAvailabilityMutation,
  UNAVAILABILITY_REASONS,
  type ReviewerAvailability,
} from "../api/reviewerSettingsApi";

/**
 * The schema marks every read field required, so this only covers the window
 * before the query resolves and the shape of a defaulted first-call row.
 */
const FALLBACK_AVAILABILITY: ReviewerAvailability = {
  id: "",
  is_available: false,
  unavailability_reason: null,
  return_date: null,
  auto_return_enabled: false,
  is_effectively_available: false,
};

const AvailabilityForm = ({ server }: { server: ReviewerAvailability }) => {
  const [updateAvailability, { isLoading: isSaving }] =
    useUpdateReviewerAvailabilityMutation();

  const { draft, setField, isDirty, reset } = useSettingsDraft(server);

  const handleSave = async () => {
    if (!isDirty) {
      toast.info("Nothing to save");
      return;
    }
    try {
      // Built by hand: `id` and `is_effectively_available` are read-only, so
      // they never go back up.
      await updateAvailability({
        is_available: draft.is_available,
        unavailability_reason: draft.unavailability_reason,
        return_date: draft.return_date,
        auto_return_enabled: draft.auto_return_enabled,
      }).unwrap();
      toast.success("Availability updated");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not update availability");
    }
  };

  // The reason and return date only mean anything while unavailable.
  const isUnavailable = !draft.is_available;

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Availability
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Control whether courses are assigned to your queue.
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        {/* Availability Status */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Availability Status
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Toggle to set your availability status
            </span>
          </div>
          <Switch
            checked={draft.is_available}
            disabled={isSaving}
            onChange={(checked) => setField("is_available", checked)}
          />
        </div>

        {/*
          Derived by the server from the *saved* row, so it is read off `server`
          rather than the draft. It only earns its place when it disagrees with
          the toggle — otherwise it just restates it.
        */}
        {server.is_effectively_available !== server.is_available && (
          <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            Currently:{" "}
            <span className="font-medium text-sd-grey-12">
              {server.is_effectively_available
                ? "available for assignment"
                : "not available for assignment"}
            </span>
          </p>
        )}

        {isUnavailable && (
          <>
            {/* Inputs */}
            <div className="flex items-start gap-[16px]">
              <div className="flex flex-1 flex-col gap-[8px]">
                <label className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  Reason for unavailability
                </label>
                <div className="relative flex items-center">
                  <select
                    value={draft.unavailability_reason ?? ""}
                    disabled={isSaving}
                    onChange={(e) =>
                      // Resolved through the list rather than cast, so the value
                      // is always one of the enum members the API accepts.
                      setField(
                        "unavailability_reason",
                        UNAVAILABILITY_REASONS.find(
                          (reason) => reason.value === e.target.value,
                        )?.value ?? null,
                      )
                    }
                    className="flex h-[44px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[40px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled hidden>
                      Select option
                    </option>
                    {UNAVAILABILITY_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                  <ArrowDown2
                    size={18}
                    variant="Linear"
                    color="var(--sd-grey-11)"
                    className="absolute right-[16px] pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-[8px]">
                <label className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  Return date
                </label>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    value={draft.return_date?.slice(0, 10) ?? ""}
                    disabled={isSaving}
                    onChange={(e) => setField("return_date", e.target.value || null)}
                    className="flex h-[44px] w-full rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[40px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue disabled:opacity-50"
                  />
                  <Calendar
                    size={18}
                    variant="Linear"
                    color="var(--sd-grey-11)"
                    className="absolute right-[16px] pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Auto-return */}
            <div className="flex items-center justify-between gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                  Auto-return on return date
                </span>
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  Automatically set availability back to active on the return date
                </span>
              </div>
              <Switch
                checked={draft.auto_return_enabled}
                disabled={isSaving}
                onChange={(checked) => setField("auto_return_enabled", checked)}
              />
            </div>
          </>
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

export const AvailabilityTab = () => {
  const { data, isLoading } = useGetReviewerAvailabilityQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[24px]">
        <div className="h-[40px] w-[220px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[220px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
      </div>
    );
  }

  return (
    <AvailabilityForm server={{ ...FALLBACK_AVAILABILITY, ...(data ?? {}) }} />
  );
};
