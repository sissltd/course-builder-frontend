"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  heading: string;
  nav: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  navClassName?: string;
  contentClassName?: string;
}

export const SettingsLayout = ({
  heading,
  nav,
  children,
  className,
  navClassName,
  contentClassName,
}: SettingsLayoutProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-display-xs font-semibold text-sd-grey-12">
        {heading}
      </h1>
      <div
        className={cn(
          "w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] flex overflow-hidden min-h-[600px]",
          className
        )}
      >
        <div
          className={cn(
            "w-full md:w-[326px] shrink-0 border-r border-[#F0F0F0] px-[16px] py-[20px]",
            navClassName
          )}
        >
          {nav}
        </div>
        <div
          className={cn(
            "flex-1 px-[40px] py-[32px] overflow-auto",
            contentClassName
          )}
        >
          <div className="max-w-[900px] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
