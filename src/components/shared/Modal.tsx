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

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "max-h-[calc(100dvh-24px)] min-w-0 overflow-y-auto rounded-[24px] border-none bg-white p-[16px] sm:max-w-[500px] sm:p-[24px]",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader className="min-w-0 gap-[8px] pr-[16px] sm:pr-0">
            {title && (
              <DialogTitle className="break-words text-[24px] font-semibold leading-tight text-[#202020] sm:text-[28px]">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="break-words text-[14px] leading-normal text-[#606060]">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="min-w-0 py-[8px]">
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
