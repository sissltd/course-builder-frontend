"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetKycReviewListQuery,
  useApproveKycMutation,
  useRejectKycMutation,
  KycSubmission,
} from "@/redux/slices/adminApi";
import { KycReviewDetailsModal } from "./components/KycReviewDetailsModal";

export const KycReviewView = () => {
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmission | null>(null);

  const { data, isLoading } = useGetKycReviewListQuery({ status: activeTab });
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveKyc(id).unwrap();
      toast.success("KYC submission approved successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve KYC.");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectKyc({ id, rejection_reason: reason }).unwrap();
      toast.success("KYC submission rejected.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject KYC.");
    }
  };

  const submissions = data?.data?.results || [];

  return (
    <div className="w-full h-full flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        {["PENDING", "APPROVED", "REJECTED"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] transition-colors cursor-pointer",
              activeTab === tab
                ? "border-sd-grey-5 bg-sd-grey-3 text-sd-grey-12"
                : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-2"
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-[16px] border border-sd-grey-3">
        <div className="min-w-[1000px]">
          <div
            className={cn(
              "grid items-center border-b border-sd-grey-3 bg-sd-grey-2 px-[24px] py-[16px] text-[14px] font-medium text-sd-grey-12",
              "grid-cols-[minmax(200px,1.5fr)_minmax(150px,1fr)_minmax(180px,1fr)_minmax(150px,1fr)_minmax(180px,1fr)]",
            )}
          >
            <div className="truncate px-[8px]">User</div>
            <div className="truncate px-[8px]">Document Type</div>
            <div className="truncate px-[8px]">ID Number</div>
            <div className="truncate px-[8px]">Status</div>
            <div className="truncate px-[8px]">Date Submitted</div>
          </div>

          <div className="divide-y divide-sd-grey-3">
            {isLoading && (
              <div className="px-[32px] py-[24px] text-sd-grey-11 text-center">Loading...</div>
            )}
            {!isLoading && submissions.length === 0 && (
              <div className="px-[32px] py-[24px] text-sd-grey-11 text-center">No submissions found.</div>
            )}
            {!isLoading && submissions.map((row) => (
              <div
                key={row.id}
                className={cn(
                  "grid items-center px-[24px] py-[16px] text-[14px] font-normal text-sd-grey-11 transition-colors cursor-pointer hover:bg-sd-grey-2",
                  "grid-cols-[minmax(200px,1.5fr)_minmax(150px,1fr)_minmax(180px,1fr)_minmax(150px,1fr)_minmax(180px,1fr)]",
                )}
                onClick={() => setSelectedSubmission(row)}
              >
                <div className="truncate px-[8px] flex flex-col">
                  <span className="text-sd-grey-12 font-medium">{row.user.first_name} {row.user.last_name}</span>
                  <span className="text-[12px]">{row.user.email}</span>
                </div>
                <div className="truncate px-[8px]">{row.document_type}</div>
                <div className="truncate px-[8px]">{row.id_number}</div>
                <div className="truncate px-[8px]">
                  <span className={cn(
                    "px-2 py-1 rounded-[6px] text-[12px] font-medium",
                    row.status === "PENDING" ? "bg-[#FFC107]/20 text-[#D39E00]" :
                    row.status === "APPROVED" ? "bg-[#28A745]/20 text-[#218838]" :
                    "bg-[#DC3545]/20 text-[#C82333]"
                  )}>
                    {row.status}
                  </span>
                </div>
                <div className="truncate px-[8px]">
                  {format(parseISO(row.created_datetime), "MMM dd, yyyy")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <KycReviewDetailsModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  );
};
