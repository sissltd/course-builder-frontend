"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as AppButton } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import {
  useGetNotificationsQuery,
  useToggleNotificationReadMutation,
  NotificationItem as ApiNotificationItem,
} from "@/redux/slices/notificationApi";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { toast } from "sonner";

type ReviewerNotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: "approval" | "review";
};

type ReviewerNotificationGroup = {
  label: string;
  items: ReviewerNotificationItem[];
};

const NotificationIcon = ({ type, isRead }: { type: ReviewerNotificationItem["type"]; isRead: boolean }) => (
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

const groupNotifications = (notifications: ApiNotificationItem[]): ReviewerNotificationGroup[] => {
  const groups: Record<string, ReviewerNotificationItem[]> = {};

  notifications.forEach((notif) => {
    const date = parseISO(notif.created_datetime);
    let label = format(date, "MMM dd, yyyy");
    if (isToday(date)) label = "Today";
    else if (isYesterday(date)) label = "Yesterday";

    if (!groups[label]) groups[label] = [];

    groups[label].push({
      id: notif.id,
      title: notif.title,
      body: notif.content,
      time: isToday(date) ? `Today - ${format(date, "h:mm a")}` : format(date, "h:mm a"),
      isRead: notif.is_read,
      type: notif.metadata?.action?.includes("approv") ? "approval" : "review",
    });
  });

  return Object.entries(groups).map(([label, items]) => ({ label, items }));
};

export const ReviewerNotificationsView = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] =
    useState<ReviewerNotificationItem | null>(null);
  const [locallyReadIds, setLocallyReadIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [toggleNotificationRead] = useToggleNotificationReadMutation();
  const { data, isLoading } = useGetNotificationsQuery(
    activeTab === "unread" ? { is_read: false } : undefined
  );

  const notifications = useMemo(
    () =>
      (data?.data?.results ?? []).map((notification) =>
        locallyReadIds.has(notification.id)
          ? { ...notification, is_read: true }
          : notification,
      ),
    [data, locallyReadIds],
  );

  const groups = useMemo(() => {
    const visibleNotifications =
      activeTab === "unread"
        ? notifications.filter((notification) => !notification.is_read)
        : notifications;
    return groupNotifications(visibleNotifications);
  }, [activeTab, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const displayedGroups = groups;

  const setIdsAsLocallyRead = (ids: string[]) => {
    setLocallyReadIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setSelectedNotification((current) =>
      current && ids.includes(current.id) ? { ...current, isRead: true } : current,
    );
  };

  const restoreUnreadIds = (ids: string[]) => {
    setLocallyReadIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedNotification((current) =>
      current && ids.includes(current.id) ? { ...current, isRead: false } : current,
    );
  };

  const handleMarkAsRead = async (id: string) => {
    if (pendingIds.has(id)) return;

    setIdsAsLocallyRead([id]);
    setPendingIds((current) => new Set(current).add(id));

    try {
      await toggleNotificationRead({
        notification_id: id,
        read_status: true,
      }).unwrap();
      toast.success("Notification marked as read");
    } catch {
      restoreUnreadIds([id]);
      toast.error("Could not mark the notification as read");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;

    setIsMarkingAll(true);
    setIdsAsLocallyRead(unreadIds);

    const results = await Promise.allSettled(
      unreadIds.map((id) =>
        toggleNotificationRead({
          notification_id: id,
          read_status: true,
        }).unwrap(),
      ),
    );
    const failedIds = results.flatMap((result, index) =>
      result.status === "rejected" ? [unreadIds[index]] : [],
    );

    if (failedIds.length > 0) {
      restoreUnreadIds(failedIds);
      toast.error(
        failedIds.length === unreadIds.length
          ? "Could not mark notifications as read"
          : "Some notifications could not be marked as read",
      );
    } else {
      toast.success("All notifications marked as read");
    }

    setIsMarkingAll(false);
  };

  return (
    <>
      <Modal
        isOpen={selectedNotification !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null);
        }}
        title={selectedNotification?.title}
        className="sm:max-w-[560px]"
      >
        {selectedNotification && (
          <div className="flex flex-col gap-[20px]">
            <p className="whitespace-pre-wrap text-[14px] font-normal text-sd-grey-11 leading-[22px] tracking-[-0.28px]">
              {selectedNotification.body}
            </p>
            <div className="flex items-center justify-between gap-[16px]">
              <span className="text-[13px] text-sd-grey-9">
                {selectedNotification.time}
              </span>
              {!selectedNotification.isRead && (
                <AppButton
                  type="button"
                  variant="outline"
                  size="app"
                  disabled={pendingIds.has(selectedNotification.id)}
                  className="h-[40px] rounded-[10px] border-sd-grey-3 bg-white px-[16px] text-[14px] font-normal text-sd-grey-11"
                  onClick={() => void handleMarkAsRead(selectedNotification.id)}
                >
                  {pendingIds.has(selectedNotification.id)
                    ? "Marking..."
                    : "Mark as read"}
                </AppButton>
              )}
            </div>
          </div>
        )}
      </Modal>

      <div className="min-h-[calc(100vh-140px)]">
      <div className="flex w-full items-start justify-between gap-[24px] pt-[42px] pl-[clamp(24px,22vw,257px)] pr-[clamp(24px,18vw,258px)]">
        <div className="flex items-center gap-[12px]">
          <AppButton
            type="button"
            variant="ghost"
            size="default"
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
              activeTab === "all"
                ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
            )}
          >
            All
          </AppButton>
          <AppButton
            type="button"
            variant="ghost"
            size="default"
            onClick={() => setActiveTab("unread")}
            className={cn(
              "flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
              activeTab === "unread"
                ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
            )}
          >
            Unread ({unreadCount})
          </AppButton>
        </div>

        {activeTab === "unread" && unreadCount > 0 && (
          <AppButton
            type="button"
            variant="outline"
            size="app"
            className="h-[44px] rounded-[10px] border-sd-grey-3 bg-white px-[18px] text-[14px] font-normal text-sd-grey-12"
            disabled={isMarkingAll}
            onClick={() => void handleMarkAllAsRead()}
          >
            <div className="mr-[12px] flex items-center">
              <Check size={22} strokeWidth={2.25} color="var(--sd-grey-12)" />
            </div>
            {isMarkingAll ? "Marking all..." : "Mark all as read"}
          </AppButton>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center pt-[176px]">
          <span className="text-[14px] text-sd-grey-11">Loading notifications...</span>
        </div>
      ) : displayedGroups.length === 0 ? (
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
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="default"
                        className="h-auto items-start gap-[14px] rounded-[8px] p-0 text-left hover:bg-transparent active:scale-100"
                        aria-label={`Open notification: ${item.title}`}
                        onClick={() => setSelectedNotification(item)}
                      >
                        <NotificationIcon type={item.type} isRead={item.isRead} />

                        <div className="flex max-w-[430px] flex-col gap-[8px] pt-[2px]">
                          <span className="text-[16px] font-semibold text-sd-grey-12 leading-[24px] tracking-[-0.32px]">
                            {item.title}
                          </span>
                          <span className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
                            {item.body}
                          </span>
                          <span className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
                            {item.time}
                          </span>
                        </div>
                      </AppButton>

                      {!item.isRead && (
                        <AppButton
                          type="button"
                          variant="outline"
                          size="app"
                          disabled={pendingIds.has(item.id)}
                          className="h-[40px] min-w-[116px] rounded-[10px] border-sd-grey-3 bg-white px-[16px] text-[14px] font-normal text-sd-grey-11"
                          onClick={() => void handleMarkAsRead(item.id)}
                        >
                          {pendingIds.has(item.id) ? "Marking..." : "Mark as read"}
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
    </>
  );
};
