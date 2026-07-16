"use client";

import React from "react";
import { FolderOpen } from "iconsax-react";

export const NotificationsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-[12px] py-[100px]">
      <div className="size-[48px] rounded-full bg-sd-grey-2 flex items-center justify-center text-sd-grey-11">
        <FolderOpen size={24} variant="Linear" color="currentColor" />
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <h3 className="text-[16px] font-semibold text-sd-grey-12 tracking-[-0.32px]">
          No notifications
        </h3>
        <p className="text-[14px] text-sd-grey-11 tracking-[-0.28px]">
          Please come back later
        </p>
      </div>
    </div>
  );
};
