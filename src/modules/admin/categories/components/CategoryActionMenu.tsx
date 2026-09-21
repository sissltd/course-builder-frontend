"use client";

import React from "react";
import { Archive, Edit2, Trash, RefreshCircle } from "iconsax-react";
import { Button as AppButton } from "@/components/shared/Button";
import { CategoryStatus } from "@/modules/categories/types";

export type CategoryAction = "edit" | "archive" | "unarchive" | "delete";

interface CategoryActionMenuProps {
  onClose: () => void;
  onAction: (action: CategoryAction) => void;

  status: CategoryStatus;
}

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  action: CategoryAction;
  colorClassName: string;
  hoverClassName: string;
}

export const CategoryActionMenu = ({
  onClose,
  onAction,
  status,
}: CategoryActionMenuProps) => {
  const isArchived = status === CategoryStatus.ARCHIVED;

  const archiveItem: ActionItem = isArchived
    ? {
        icon: <RefreshCircle variant="Linear" size={18} color="var(--sd-grey-11)" />,
        label: "Unarchive category",
        action: "unarchive",
        colorClassName: "text-sd-grey-11",
        hoverClassName: "hover:bg-sd-grey-1",
      }
    : {
        icon: <Archive variant="Linear" size={18} color="var(--sd-grey-11)" />,
        label: "Archive category",
        action: "archive",
        colorClassName: "text-sd-grey-11",
        hoverClassName: "hover:bg-sd-grey-1",
      };

  const items: ActionItem[] = [
    {
      icon: <Edit2 variant="Linear" size={18} color="var(--sd-grey-11)" />,
      label: "Edit category",
      action: "edit",
      colorClassName: "text-sd-grey-11",
      hoverClassName: "hover:bg-sd-grey-1",
    },
    archiveItem,
    {
      icon: <Trash variant="Linear" size={18} color="var(--sd-danger)" />,
      label: "Delete category",
      action: "delete",
      colorClassName: "text-[var(--sd-danger)]",
      hoverClassName: "hover:bg-[var(--sd-danger-soft)]",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-[36px] right-0 z-50 w-[171px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
        <div className="flex flex-col gap-[2px]">
          {items.map((item) => (
            <AppButton
              key={item.action}
              type="button"
              variant="ghost"
              size="sm"
              className={`flex h-[34px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-left transition-colors cursor-pointer ${item.hoverClassName}`}
              onClick={() => {
                onAction(item.action);
                onClose();
              }}
            >
              {item.icon}
              <span className={`text-[12px] font-normal leading-[16px] ${item.colorClassName}`}>
                {item.label}
              </span>
            </AppButton>
          ))}
        </div>
      </div>
    </>
  );
};
