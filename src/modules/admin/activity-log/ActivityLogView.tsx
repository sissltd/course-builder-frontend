"use client";

import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetActivityLogQuery } from "@/redux/slices/adminApi";
import {
  groupActivityLogs,
  type ActivityCategory,
} from "@/lib/activityLog";

/**
 * The admin screen's own tab set — deliberately narrower than the 13 categories
 * the API accepts. Omitting `category` is what makes All send no filter.
 */
const FILTERS: Array<{
  id: string;
  label: string;
  category?: ActivityCategory;
}> = [
  { id: "all", label: "All" },
  { id: "approval", label: "Approval", category: "APPROVAL" },
  { id: "production", label: "Production", category: "PRODUCTION" },
  { id: "publish", label: "Publish", category: "PUBLISH" },
  { id: "submission", label: "Submission", category: "SUBMISSION" },
  { id: "alert", label: "Alert", category: "ALERT" },
  { id: "configuration", label: "Configuration", category: "CONFIGURATION" },
];

const ActivityLogIcon = () => (
  <div className="flex size-[46px] shrink-0 items-center justify-center rounded-full border border-sd-grey-6 bg-white">
    <Check size={22} strokeWidth={2.25} color="var(--sd-grey-12)" />
  </div>
);

export const ActivityLogView = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const activeFilter = useMemo(
    () => FILTERS.find((filter) => filter.id === activeTab),
    [activeTab]
  );

  const { data, isLoading } = useGetActivityLogQuery(
    activeFilter?.category ? { category: activeFilter.category } : undefined
  );

  const displayedGroups = useMemo(() => {
    if (!data?.data?.results) return [];
    return groupActivityLogs(data.data.results);
  }, [data]);

  return (
    <div className="min-h-[calc(100vh-140px)]">
      <div className="overflow-x-auto pt-[42px] pl-[clamp(24px,22vw,257px)]">
        <div className="flex min-w-max items-center gap-[12px] pr-[24px]">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveTab(filter.id)}
              className={cn(
                "flex h-[40px] items-center rounded-[10px] border px-[16px] whitespace-nowrap text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
                activeTab === filter.id
                  ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                  : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full pt-[38px] pl-[clamp(24px,22vw,257px)]">
        <div className="max-w-[688px]">
          {isLoading && (
            <p className="text-sd-grey-11">Loading activity log...</p>
          )}
          {!isLoading && displayedGroups.length === 0 && (
            <p className="text-sd-grey-11">No activity found.</p>
          )}
          {!isLoading && displayedGroups.map((group, groupIndex) => (
            <div key={group.label} className={cn(groupIndex > 0 && "pt-[32px]")}>
              {groupIndex > 0 && <div className="mb-[26px] h-px w-full bg-sd-grey-6" />}
              <h2 className="mb-[28px] text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {group.label}
              </h2>

              <div className="flex flex-col gap-[42px]">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-[14px]">
                    <ActivityLogIcon />

                    <div className="flex flex-col gap-[8px] pt-[2px]">
                      <h3 className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                        {item.title}
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
