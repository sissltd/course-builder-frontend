"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppSideDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  side?: "right" | "left" | "top" | "bottom";
  showCloseButton?: boolean;
}

export const AppSideDrawer = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  side = "right",
  showCloseButton = true,
}: AppSideDrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("w-full sm:!w-[30%] sm:!max-w-[30%] p-0 flex flex-col bg-white border-none", className)}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <SheetHeader className="px-[24px] py-[20px] border-b border-[#F0F0F0] gap-[8px]">
            {title && (
              <SheetTitle className="text-[20px] font-semibold text-[#202020] leading-[28px]">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="text-[14px] text-[#606060] leading-[20px]">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto px-[24px] py-[20px]">
          {children}
        </div>
        {footer && (
          <SheetFooter className="px-[24px] py-[20px] border-t border-[#F0F0F0]">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
