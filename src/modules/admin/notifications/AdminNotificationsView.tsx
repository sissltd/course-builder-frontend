"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as AppButton } from "@/components/shared/Button";

type AdminNotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: "approval" | "review";
};

type AdminNotificationGroup = {
  label: string;
  items: AdminNotificationItem[];
};

const initialGroups: AdminNotificationGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "1",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
        type: "approval",
      },
      {
        id: "2",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
        type: "approval",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "3",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
        type: "approval",
      },
      {
        id: "4",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
        type: "approval",
      },
      {
        id: "5",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
        type: "approval",
      },
    ],
  },
];

const NotificationIcon = ({ type, isRead }: { type: AdminNotificationItem["type"]; isRead: boolean }) => (
  <div className="relative shrink-0">
    <div className="flex size-[46px] items-center justify-center rounded-full border border-sd-grey-6 bg-white">
      {type === "approval" ? (
        <Check size={22} strokeWidth={2.25} color="var(--sd-grey-12)" />
      ) : (
        <Image
          src="/assets/notifications/book.svg"
          alt="Review notification"
          width={22}
          height={22}
          className="object-contain"
        />
      )}
    </div>
    {!isRead && (
      <span className="absolute right-0 top-[8px] size-[10px] rounded-full bg-[var(--sd-blue-dark)]" />
    )}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center pt-[176px]">
    <div className="relative h-[58px] w-[70px]">
      <Image
        src="/assets/drafts/empty-drafts.png"
        alt="No notifications"
        fill
        className="object-contain"
        priority
      />
    </div>
    <div className="mt-[18px] flex flex-col items-center gap-[2px]">
      <h2 className="text-[22px] font-medium text-sd-grey-12 leading-[32px] tracking-[-0.44px]">
        No notifications
      </h2>
      <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
        Please come back later
      </p>
    </div>
  </div>
);

export const AdminNotificationsView = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [groups, setGroups] = useState(initialGroups);

  const unreadCount = useMemo(
    () => groups.flatMap((group) => group.items).filter((item) => !item.isRead).length,
    [groups]
  );

  const displayedGroups = useMemo(() => {
    if (activeTab === "all") return groups;

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.isRead),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeTab, groups]);

  const handleMarkAsRead = (id: string) => {
    setGroups((current) =>
      current.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      }))
    );
  };

  const handleMarkAllAsRead = () => {
    setGroups((current) =>
      current.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, isRead: true })),
      }))
    );
  };

  return (
    <div className="min-h-[calc(100vh-140px)]">
      <div className="flex w-full items-start justify-between gap-[24px] pt-[42px] pl-[clamp(24px,22vw,257px)] pr-[clamp(24px,18vw,258px)]">
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
              activeTab === "all"
                ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={cn(
              "flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
              activeTab === "unread"
                ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {activeTab === "unread" && unreadCount > 0 && (
          <AppButton
            type="button"
            variant="outline"
            size="app"
            className="h-[44px] rounded-[10px] border-sd-grey-3 bg-white px-[18px] text-[14px] font-normal text-sd-grey-12"
            onClick={handleMarkAllAsRead}
          >
            <div className="mr-[12px] flex items-center">
              <Check size={22} strokeWidth={2.25} color="var(--sd-grey-12)" />
            </div>
            Mark all as read
          </AppButton>
        )}
      </div>

      {displayedGroups.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full pt-[34px] pl-[clamp(24px,22vw,257px)]">
          <div className="max-w-[688px]">
            {displayedGroups.map((group, groupIndex) => (
              <div key={group.label} className={cn(groupIndex > 0 && "pt-[28px]")}>
                {groupIndex > 0 && <div className="mb-[22px] h-px w-full bg-sd-grey-6" />}
                <h2 className="mb-[24px] text-[16px] font-semibold text-sd-grey-12 leading-[24px] tracking-[-0.32px]">
                  {group.label}
                </h2>

                <div className="flex flex-col gap-[34px]">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-[24px]">
                      <div className="flex items-start gap-[14px]">
                        <NotificationIcon type={item.type} isRead={item.isRead} />

                        <div className="flex max-w-[430px] flex-col gap-[8px] pt-[2px]">
                          <h3 className="text-[16px] font-semibold text-sd-grey-12 leading-[24px] tracking-[-0.32px]">
                            {item.title}
                          </h3>
                          <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
                            {item.body}
                          </p>
                          <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      {!item.isRead && (
                        <AppButton
                          type="button"
                          variant="outline"
                          size="app"
                          className="h-[40px] min-w-[116px] rounded-[10px] border-sd-grey-3 bg-white px-[16px] text-[14px] font-normal text-sd-grey-11"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          Mark as read
                        </AppButton>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
