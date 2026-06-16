"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NotificationsEmptyState } from "./NotificationsEmptyState";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: "account" | "course";
};

export type NotificationGroup = {
  date: string;
  items: NotificationItem[];
};

/* ─── Single notification row ─── */
interface NotificationRowProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}

const NotificationRow = ({ item, onMarkRead }: NotificationRowProps) => (
  <div className="flex items-start justify-between gap-[16px] py-[16px] border-b border-[#F0F0F0] last:border-b-0 group">
    <div className="flex items-start gap-[16px]">
      {/* Icon with frame and unread dot */}
      <div className="relative shrink-0 flex">
        <div className="size-[46px] rounded-[322px] border border-[#D9D9D9] flex items-center justify-center bg-white overflow-hidden shrink-0 relative">
          {item.type === "account" ? (
             <Image src="/assets/notifications/check_regular.svg" alt="Account" width={24} height={24} />
          ) : (
             <Image src="/assets/notifications/book.svg" alt="Course" width={24} height={24} />
          )}
        </div>
        {!item.isRead && (
          <div className="absolute top-[8px] right-0 size-[10px] bg-[#0A60E1] rounded-full translate-x-1/2 -translate-y-1/2" />
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-[8px]">
        <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">
          {item.title}
        </p>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[14px] text-[#606060] font-normal tracking-[-0.28px] leading-[20px] max-w-[480px]">
            {item.body}
          </p>
          <p className="text-[14px] text-[#606060] font-normal tracking-[-0.28px] leading-[20px]">
            {item.time}
          </p>
        </div>
      </div>
    </div>

    {!item.isRead && (
      <button
        onClick={() => onMarkRead(item.id)}
        className="h-[44px] px-[16px] rounded-[8px] border border-[#F0F0F0] flex items-center justify-center text-[16px] font-normal text-[#606060] hover:bg-sd-grey-2 transition-colors cursor-pointer shrink-0"
      >
        Mark as read
      </button>
    )}
  </div>
);

/* ─── Notification group (Today / Yesterday / …) ─── */
interface NotificationGroupSectionProps {
  group: NotificationGroup;
  onMarkRead: (id: string) => void;
}

const NotificationGroupSection = ({ group, onMarkRead }: NotificationGroupSectionProps) => (
  <div className="flex flex-col">
    <div className="h-[40px] flex items-center pt-[10px]">
       <p className="text-[16px] font-normal text-[#202020] leading-[24px]">
        {group.date}
      </p>
    </div>
    <div className="flex flex-col">
      {group.items.map((item) => (
        <NotificationRow key={item.id} item={item} onMarkRead={onMarkRead} />
      ))}
    </div>
  </div>
);

/* ─── Notifications list ─── */
const INITIAL_GROUPS: NotificationGroup[] = [
  {
    date: "Today",
    items: [
      {
        id: "1",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minuites ago",
        isRead: false,
        type: "course",
      },
      {
        id: "2",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minuites ago",
        isRead: false,
        type: "account",
      },
    ],
  },
  {
    date: "Yesterday",
    items: [
      {
        id: "3",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minuites ago",
        isRead: false,
        type: "course",
      },
      {
        id: "4",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minuites ago",
        isRead: false,
        type: "account",
      },
      {
        id: "5",
        title: "Congratulations! your course has been approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minuites ago",
        isRead: false,
        type: "account",
      },
    ],
  },
];

export const NotificationsList = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [groups, setGroups] = useState<NotificationGroup[]>(INITIAL_GROUPS);

  const unreadCount = groups.flatMap((g) => g.items).filter((i) => !i.isRead).length;

  const handleMarkRead = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        ),
      }))
    );
  };

  const handleMarkAllRead = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((item) => ({ ...item, isRead: true })),
      }))
    );
  };

  const displayedGroups =
    activeTab === "unread"
      ? groups
          .map((g) => ({ ...g, items: g.items.filter((i) => !i.isRead) }))
          .filter((g) => g.items.length > 0)
      : groups;

  return (
    <div className="w-full flex flex-col gap-[16px]">
      <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-[20px] flex flex-col gap-[16px]">
        {/* Tabs + Sorting */}
        <div className="flex items-center justify-between h-[44px]">
          <div className="flex items-center gap-[16px] h-full">
            {/* Tabs */}
            <div className="flex items-center h-full">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "h-full px-[16px] rounded-[8px] text-[16px] font-normal leading-[24px] transition-colors",
                  activeTab === "all"
                    ? "bg-[#FCFDFF] text-[#202020] border border-[#F0F0F0]"
                    : "text-[#B6B6B6] hover:text-[#606060] border border-transparent"
                )}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={cn(
                  "h-full px-[16px] rounded-[8px] text-[16px] font-normal leading-[24px] transition-colors ml-[8px]",
                  activeTab === "unread"
                    ? "bg-[#FCFDFF] text-[#202020] border border-[#F0F0F0]"
                    : "text-[#B6B6B6] hover:text-[#606060] border border-transparent"
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-[12px] h-full px-[16px] rounded-[8px] border border-[#F0F0F0] text-[14px] font-medium text-[#202020] hover:bg-sd-grey-2 transition-colors cursor-pointer"
          >
            <Image src="/assets/notifications/check_regular.svg" alt="Mark all" width={24} height={24} className="text-[#202020]" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Grouped notifications */}
        <div className="flex flex-col max-w-[1020px] w-full">
          {displayedGroups.length > 0 ? (
            displayedGroups.map((group, idx) => (
              <React.Fragment key={group.date}>
                {idx > 0 && <div className="h-[1px] bg-[#F0F0F0] w-full mt-[16px]" />}
                <NotificationGroupSection
                  group={group}
                  onMarkRead={handleMarkRead}
                />
              </React.Fragment>
            ))
          ) : (
            <NotificationsEmptyState />
          )}
        </div>
      </div>
    </div>
  );
};