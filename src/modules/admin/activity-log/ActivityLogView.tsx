"use client";

import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetActivityLogQuery, ActivityLogItemApi } from "@/redux/slices/adminApi";
import { format, isToday, isYesterday, parseISO } from "date-fns";

type ActivityLogCategory =
  | "all"
  | "approval"
  | "production"
  | "publish"
  | "submission"
  | "alert"
  | "configuration";

type ActivityLogTab = {
  id: string;
  label: string;
  filterKey: ActivityLogCategory;
};

type ActivityLogItem = {
  id: string;
  title: string;
  meta: string;
  category: Exclude<ActivityLogCategory, "all">;
};

type ActivityLogGroup = {
  label: string;
  items: ActivityLogItem[];
};

const FILTERS: ActivityLogTab[] = [
  { id: "all", filterKey: "all", label: "All" },
  { id: "approval", filterKey: "approval", label: "Approval" },
  { id: "production", filterKey: "production", label: "Production" },
  { id: "publish", filterKey: "publish", label: "Publish" },
  { id: "submission", filterKey: "submission", label: "Submission" },
  { id: "alert", filterKey: "alert", label: "Alert" },
  { id: "configuration", filterKey: "configuration", label: "Configuration" },
];

const ActivityLogIcon = () => (
  <div className="flex size-[46px] shrink-0 items-center justify-center rounded-full border border-sd-grey-6 bg-white">
    <Check size={22} strokeWidth={2.25} color="var(--sd-grey-12)" />
  </div>
);

const groupActivityLogs = (results: ActivityLogItemApi[]): ActivityLogGroup[] => {
  const groups: Record<string, ActivityLogItem[]> = {};

  results.forEach((log) => {
    const date = parseISO(log.activity_datetime);
    let label = format(date, "MMM dd, yyyy");
    if (isToday(date)) label = "Today";
    else if (isYesterday(date)) label = "Yesterday";

    if (!groups[label]) groups[label] = [];

    const metaTime = isToday(date) ? `Today - ${format(date, "h:mm a")}` : format(date, "MMM dd, h:mm a");
    const actorName = log.actor ? `${log.actor.first_name} ${log.actor.last_name}`.trim() : "System";

    groups[label].push({
      id: log.id,
      title: log.summary || `${log.action} (${log.category})`,
      meta: `By ${actorName} - ${metaTime}`,
      category: log.category.toLowerCase() as Exclude<ActivityLogCategory, "all">,
    });
  });

  return Object.entries(groups).map(([label, items]) => ({ label, items }));
};

export const ActivityLogView = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const activeFilter = useMemo(
    () => FILTERS.find((filter) => filter.id === activeTab)?.filterKey ?? "all",
    [activeTab]
  );

  const { data, isLoading } = useGetActivityLogQuery(
    activeFilter !== "all" ? { category: activeFilter.toUpperCase() } : undefined
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
