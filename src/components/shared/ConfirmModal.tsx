import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { TickCircle, CloseCircle } from "iconsax-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: "primary" | "danger";
  icon?: React.ReactNode;
}

const defaultIcons: Record<"primary" | "danger", React.ReactNode> = {
  primary: <TickCircle variant="Bold" size={48} color="#008500" />,
  danger: <CloseCircle variant="Bold" size={48} color="#D54800" />,
};

export const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading,
  variant = "primary",
  icon,
}: ConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col items-center gap-[16px] pt-[8px]">
        {icon ?? defaultIcons[variant]}
        <div className="flex flex-col items-center gap-[4px] text-center">
          <span className="text-[28px] font-semibold text-[#202020] leading-tight">
            {title}
          </span>
          {description && (
            <p className="text-[14px] text-[#606060] leading-normal max-w-[320px]">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-[12px] w-full pt-[8px]">
          <Button
            variant="outline"
            className="flex-1 h-[44px] text-[14px]"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "app-primary"}
            className="flex-1 h-[44px] text-[14px]"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
