import React from "react";
import { FolderOpen } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Optional recovery action — usually "Try again" on a failed read. */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * The repo's empty panel, promoted to a shared primitive.
 *
 * `BaseTable` carries its own inline empty row, so this is for the places it
 * cannot reach: a drawer, a detail page, or a list rendered as cards. It follows
 * the `NotificationsEmptyState` layout — a 48px grey circle over a title and a
 * one-line explanation — so the three read as the same component.
 */
export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[12px] py-[64px] px-[16px] text-center",
        className,
      )}
    >
      <div className="size-[48px] rounded-full bg-sd-grey-2 flex items-center justify-center text-sd-grey-11">
        {icon ?? <FolderOpen size={24} variant="Linear" color="currentColor" />}
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <h3 className="text-[16px] font-semibold text-sd-grey-12 tracking-[-0.32px]">
          {title}
        </h3>
        {description && (
          <p className="max-w-[420px] text-[14px] text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="app-primary"
          size="app"
          className="h-[40px] mt-[4px]"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
