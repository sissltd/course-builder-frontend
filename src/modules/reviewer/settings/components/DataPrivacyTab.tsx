"use client";

import React from "react";
import { CloudDownload } from "lucide-react";
import { Button } from "@/components/shared/Button";

export const DataPrivacyTab = () => {
  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Data and privacy
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Download your activity data
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        {/* Download activity log */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Download activity log
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Your full review history, decision, and feedback in CSV format
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border-sd-grey-3 px-[16px] text-[14px] font-medium text-sd-grey-12 hover:bg-sd-grey-2"
          >
            Download log
            <CloudDownload size={18} strokeWidth={2} className="text-sd-grey-11" />
          </Button>
        </div>

        {/* Download audit trail entries */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Download audit trail entries
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              All logged platform actions attributed to your account
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border-sd-grey-3 px-[16px] text-[14px] font-medium text-sd-grey-12 hover:bg-sd-grey-2"
          >
            Download log
            <CloudDownload size={18} strokeWidth={2} className="text-sd-grey-11" />
          </Button>
        </div>
      </div>
    </div>
  );
};
