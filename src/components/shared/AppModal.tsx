import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AppModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const AppModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
}: AppModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn("sm:max-w-[500px] p-[24px] rounded-[24px] bg-white border-none", className)}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader className="gap-[8px]">
            {title && (
              <DialogTitle className="text-[28px] font-semibold text-[#202020] leading-tight">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-[14px] text-[#606060] leading-normal">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="py-[8px]">
          {children}
        </div>
        {footer && (
          <DialogFooter className="mt-[16px]">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
