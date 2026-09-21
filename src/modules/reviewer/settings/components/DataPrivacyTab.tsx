"use client";

import React from "react";
import { CloudDownload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useLazyExportActivityLogQuery,
  useLazyExportAuditLogQuery,
} from "../api/reviewerSettingsApi";

/** Saves a fetched blob under a filename, then releases the object URL. */
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const DataPrivacyTab = () => {
  const [exportActivityLog, { isFetching: isExportingActivity }] =
    useLazyExportActivityLogQuery();
  const [exportAuditLog, { isFetching: isExportingAudit }] =
    useLazyExportAuditLogQuery();

  const download = async (
    trigger: () => Promise<{ data?: Blob; error?: unknown }>,
    filename: string,
    label: string,
  ) => {
    try {
      const { data, error } = await trigger();
      if (error || !data) {
        const { message } = normalizeApiError(error as never);
        toast.error(message ?? `Could not download the ${label}`);
        return;
      }
      saveBlob(data, filename);
      toast.success(`${label} downloaded`);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? `Could not download the ${label}`);
    }
  };

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
            disabled={isExportingActivity}
            onClick={() =>
              void download(
                exportActivityLog,
                "activity-log.csv",
                "Activity log",
              )
            }
            className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border-sd-grey-3 px-[16px] text-[14px] font-medium text-sd-grey-12 hover:bg-sd-grey-2 disabled:opacity-50"
          >
            {isExportingActivity ? "Preparing..." : "Download log"}
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
            disabled={isExportingAudit}
            onClick={() =>
              void download(exportAuditLog, "audit-log.csv", "Audit trail")
            }
            className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border-sd-grey-3 px-[16px] text-[14px] font-medium text-sd-grey-12 hover:bg-sd-grey-2 disabled:opacity-50"
          >
            {isExportingAudit ? "Preparing..." : "Download log"}
            <CloudDownload size={18} strokeWidth={2} className="text-sd-grey-11" />
          </Button>
        </div>
      </div>
    </div>
  );
};
