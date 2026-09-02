"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NotificationsEmptyState } from "./NotificationsEmptyState";
import {
  useGetNotificationsQuery,
  useToggleNotificationReadMutation,
  NotificationItem as ApiNotificationItem,
} from "@/redux/slices/notificationApi";
import { format, isToday, isYesterday, parseISO } from "date-fns";

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

/* ─── Map API notification to UI notification ─── */
const mapApiNotification = (notif: ApiNotificationItem): NotificationItem => {
  const date = parseISO(notif.created_datetime);
  const isAccountType =
    notif.metadata?.action?.includes("account") ||
    notif.metadata?.action?.includes("kyc");

  return {
    id: notif.id,
    title: notif.title,
    body: notif.content,
    time: isToday(date)
      ? `Today - ${format(date, "h:mm a")}`
      : isYesterday(date)
        ? `Yesterday - ${format(date, "h:mm a")}`
        : format(date, "MMM dd, yyyy - h:mm a"),
    isRead: notif.is_read,
    type: isAccountType ? "account" : "course",
  };
};

/* ─── Notifications list ─── */
export const NotificationsList = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [toggleRead] = useToggleNotificationReadMutation();

  const { data, isLoading } = useGetNotificationsQuery(
    activeTab === "unread" ? { is_read: false } : undefined
  );

  const allNotifications = useMemo(() => {
    if (!data?.data?.results) return [];
    return data.data.results.map(mapApiNotification);
  }, [data]);

  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.isRead).length,
    [allNotifications]
  );

  const groups = useMemo(() => {
    const grouped: Record<string, NotificationItem[]> = {};
    allNotifications.forEach((notif) => {
      let label = "Older";
      if (notif.time.startsWith("Today")) label = "Today";
      else if (notif.time.startsWith("Yesterday")) label = "Yesterday";

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(notif);
    });
    return Object.entries(grouped).map(([date, items]) => ({ date, items }));
  }, [allNotifications]);

  const displayedGroups = activeTab === "unread"
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((i) => !i.isRead) }))
        .filter((g) => g.items.length > 0)
    : groups;

  const handleMarkRead = async (id: string) => {
    try {
      await toggleRead({ notification_id: id, read_status: true }).unwrap();
    } catch {
      // error handled by RTK Query
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = allNotifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);
    try {
      await Promise.all(
        unreadIds.map((id) =>
          toggleRead({ notification_id: id, read_status: true }).unwrap()
        )
      );
    } catch {
      // error handled by RTK Query
    }
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center py-[40px]">
              <p className="text-[14px] text-[#606060]">Loading notifications...</p>
            </div>
          ) : displayedGroups.length > 0 ? (
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