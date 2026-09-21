"use client";

import React from "react";
import { Edit2, Trash, TickCircle, CloseCircle, Refresh2 } from "iconsax-react";
import { Button as AppButton } from "@/components/shared/Button";
import { TopicStatus, type Topic } from "@/modules/topics/types";

export type TopicAction =
  | "edit"
  | "activate"
  | "deactivate"
  | "release"
  | "delete";

interface TopicActionMenuProps {
  topic: Topic;
  onClose: () => void;
  onAction: (action: TopicAction) => void;
}

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  action: TopicAction;
  colorClassName: string;
  hoverClassName: string;
  /** Set when the action is a no-op in the topic's current state. */
  disabled?: boolean;
  /** Explains the disabled state on hover. */
  title?: string;
}

export const TopicActionMenu = ({
  topic,
  onClose,
  onAction,
}: TopicActionMenuProps) => {
  const isActive = topic.status === TopicStatus.ACTIVE;

  /*
    Status is not the same axis as archive on a category: closing a topic stops
    new submissions but leaves courses already using it alone, so the labels say
    that rather than implying removal.
  */
  const statusItem: ActionItem = isActive
    ? {
        icon: <CloseCircle variant="Linear" size={18} color="var(--sd-grey-11)" />,
        label: "Close to submissions",
        action: "deactivate",
        colorClassName: "text-sd-grey-11",
        hoverClassName: "hover:bg-sd-grey-1",
      }
    : {
        icon: <TickCircle variant="Linear" size={18} color="var(--sd-grey-11)" />,
        label: "Open to submissions",
        action: "activate",
        colorClassName: "text-sd-grey-11",
        hoverClassName: "hover:bg-sd-grey-1",
      };

  const items: ActionItem[] = [
    {
      icon: <Edit2 variant="Linear" size={18} color="var(--sd-grey-11)" />,
      label: "Edit topic",
      action: "edit",
      colorClassName: "text-sd-grey-11",
      hoverClassName: "hover:bg-sd-grey-1",
    },
    statusItem,
    {
      icon: <Refresh2 variant="Linear" size={18} color="var(--sd-grey-11)" />,
      label: "Release reservation",
      action: "release",
      colorClassName: "text-sd-grey-11",
      hoverClassName: "hover:bg-sd-grey-1",
      /*
        Releasing an unreserved topic is documented as a no-op rather than an
        error, so offering it here would let an admin fire an action that
        silently does nothing and still reports success.
      */
      disabled: !topic.is_currently_reserved,
      title: topic.is_currently_reserved
        ? undefined
        : "This topic has no active reservation to release",
    },
    {
      icon: <Trash variant="Linear" size={18} color="var(--sd-danger)" />,
      label: "Delete topic",
      action: "delete",
      colorClassName: "text-[var(--sd-danger)]",
      hoverClassName: "hover:bg-[var(--sd-danger-soft)]",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-[36px] right-0 z-50 w-[196px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
        <div className="flex flex-col gap-[2px]">
          {items.map((item) => (
            <AppButton
              key={item.action}
              type="button"
              variant="ghost"
              size="sm"
              disabled={item.disabled}
              title={item.title}
              className={`flex h-[34px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-left transition-colors ${
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : `cursor-pointer ${item.hoverClassName}`
              }`}
              onClick={() => {
                if (item.disabled) return;
                onAction(item.action);
                onClose();
              }}
            >
              {item.icon}
              <span
                className={`text-[13px] font-normal leading-[18px] tracking-[-0.26px] ${item.colorClassName}`}
              >
                {item.label}
              </span>
            </AppButton>
          ))}
        </div>
      </div>
    </>
  );
};
