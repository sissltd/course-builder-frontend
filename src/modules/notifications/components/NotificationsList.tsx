"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TickCircle, TickSquare } from "iconsax-react";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
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
  <div className="flex items-start justify-between gap-[16px] py-[18px] border-b border-[#F0F0F0] last:border-b-0">
    <div className="flex items-start gap-[12px]">
      {/* Check circle icon */}
      <div className="relative mt-[2px] shrink-0">
        <TickCircle
          size={24}
          variant="Outline"
          color="#B6B6B6"
          className="shrink-0"
        />
        {!item.isRead && (
          <span className="absolute -top-[2px] -right-[2px] size-[8px] rounded-full bg-[#0063EF] border-[1.5px] border-white" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[4px]">
        <p className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px] leading-[20px]">
          {item.title}
        </p>
        <p className="text-[14px] text-[#636363] leading-[20px] max-w-[480px]">{item.body}</p>
        <p className="text-[13px] text-[#B6B6B6] leading-[18px]">{item.time}</p>
      </div>
    </div>

    {!item.isRead && (
      <button
        onClick={() => onMarkRead(item.id)}
        className="text-[14px] text-[#606060] hover:text-[#0063EF] tracking-[-0.28px] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
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
    <p className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px] leading-[20px] mb-[4px]">
      {group.date}
    </p>
    {group.items.map((item) => (
      <NotificationRow key={item.id} item={item} onMarkRead={onMarkRead} />
    ))}
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
        time: "Today - 12 minutes ago",
        isRead: false,
      },
      {
        id: "2",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
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
        time: "Today - 12 minutes ago",
        isRead: false,
      },
      {
        id: "4",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
      },
      {
        id: "5",
        title: "Account approved",
        body: "Your account review has been approved! You can now proceed with your activities.",
        time: "Today - 12 minutes ago",
        isRead: false,
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
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] px-[24px] py-[20px] flex flex-col gap-[20px]">
      {/* Tabs + Mark all */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          {/* All tab */}
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "h-[36px] px-[16px] rounded-[8px] text-[14px] font-medium tracking-[-0.28px] transition-colors",
              activeTab === "all"
                ? "text-[#606060]"
                : "text-[#B6B6B6] hover:text-[#606060]"
            )}
          >
            All
          </button>
          {/* Unread tab */}
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "h-[36px] px-[16px] rounded-[8px] text-[14px] font-medium tracking-[-0.28px] transition-colors border",
              activeTab === "unread"
                ? "bg-white border-[#E8E8E8] text-[#202020]"
                : "border-transparent text-[#B6B6B6] hover:text-[#606060]"
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-[6px] text-[14px] text-[#606060] hover:text-[#0063EF] tracking-[-0.28px] transition-colors cursor-pointer"
          >
            <TickSquare size={18} variant="Linear" color="currentColor" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F0F0F0] -mx-[24px]" />

      {/* Grouped notifications */}
      <div className="flex flex-col gap-[24px]">
        {displayedGroups.length > 0 ? (
          displayedGroups.map((group) => (
            <NotificationGroupSection
              key={group.date}
              group={group}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <p className="text-[14px] text-[#B6B6B6] text-center py-[40px]">
            No notifications
          </p>
        )}
      </div>
    </div>
  );
};
