"use client";

import React from "react";
import { format } from "date-fns";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button } from "@/components/shared/Button";
import { TickCircle, CloseCircle, Calendar2, User, Tag, DollarCircle } from "iconsax-react";
import {
  useGetActiveReservationDetailQuery,
  useGetReservationRequestDetailQuery,
} from "@/redux/slices/adminApi";

interface ReservationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeReservationId: string | null;
  requestId: string | null;
  onApproveRequest?: (id: string) => void;
  onRejectRequest?: (id: string) => void;
  onReleaseActive?: (id: string) => void;
}

export const ReservationDrawer = ({
  isOpen,
  onOpenChange,
  activeReservationId,
  requestId,
  onApproveRequest,
  onRejectRequest,
  onReleaseActive,
}: ReservationDrawerProps) => {
  const { data: activeDetail, isLoading: isLoadingActive } =
    useGetActiveReservationDetailQuery(activeReservationId || "", {
      skip: !activeReservationId || !isOpen,
    });

  const { data: requestDetail, isLoading: isLoadingRequest } =
    useGetReservationRequestDetailQuery(requestId || "", {
      skip: !requestId || !isOpen,
    });

  const isLoading = Boolean(
    (activeReservationId && isLoadingActive) || (requestId && isLoadingRequest)
  );

  const isRequest = Boolean(requestId);
  const detail = isRequest ? requestDetail : activeDetail;

  const topicName = isRequest
    ? requestDetail?.name || requestDetail?.topic?.name || "No topic name"
    : activeDetail?.name || "No topic name";

  const categoryName = isRequest
    ? requestDetail?.category?.name || requestDetail?.topic?.category?.name || "No category"
    : activeDetail?.category?.name || "No category";

  const user = isRequest ? requestDetail?.requested_by : activeDetail?.reserved_by;
  const status = isRequest ? requestDetail?.status : activeDetail?.status;
  const creatorPrice = isRequest
    ? requestDetail?.topic?.creator_price
    : activeDetail?.creator_price;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
      return dateStr;
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isRequest ? "Reservation Request Details" : "Active Reservation Details"}
      description="Inspect reservation metadata, creator information, and administrative actions."
    >
      <div className="flex flex-col gap-[20px] p-[24px] overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center text-sd-grey-11 text-[14px]">
            Loading details...
          </div>
        ) : !detail ? (
          <div className="flex h-[200px] items-center justify-center text-sd-grey-11 text-[14px]">
            No reservation details found.
          </div>
        ) : (
          <>
            {/* Top Topic Card */}
            <div className="flex flex-col gap-[10px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-2/50 p-[16px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-sd-grey-11">
                  Topic Information
                </span>
                <span
                  className={`rounded-full px-[10px] py-[2px] text-[11px] font-semibold uppercase ${
                    status === "APPROVED" || status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : status === "REJECTED"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {status || "UNKNOWN"}
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-sd-grey-12">{topicName}</h3>
              <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-sd-grey-11">
                <span className="flex items-center gap-[4px]">
                  <Tag size={14} variant="Linear" color="currentColor" />
                  <span>Category: <strong className="text-sd-grey-12">{categoryName}</strong></span>
                </span>
                {creatorPrice && (
                  <span className="flex items-center gap-[4px]">
                    <DollarCircle size={14} variant="Linear" color="currentColor" />
                    <span>Price: <strong className="text-sd-grey-12">${Number(creatorPrice).toLocaleString()}</strong></span>
                  </span>
                )}
              </div>
            </div>

            {/* Creator / Requester Details */}
            <div className="flex flex-col gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-sd-grey-11">
                {isRequest ? "Requested By" : "Reserved By"}
              </span>
              <div className="flex items-center gap-[12px]">
                <div className="flex size-[40px] items-center justify-center rounded-full bg-sd-blue/10 text-sd-blue font-bold text-[14px]">
                  {user ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}` : "U"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-sd-grey-12">
                    {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : "No name provided"}
                  </span>
                  <span className="text-[12px] text-sd-grey-11 truncate">
                    {user?.email || "No email available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps & Dates */}
            <div className="flex flex-col gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-sd-grey-11">
                Timeline &amp; Dates
              </span>
              <div className="flex flex-col gap-[10px] text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-sd-grey-11">Created:</span>
                  <span className="font-medium text-sd-grey-12">{formatDate(detail.created_datetime)}</span>
                </div>

                {!isRequest && activeDetail?.reserved_until && (
                  <div className="flex items-center justify-between">
                    <span className="text-sd-grey-11">Reserved Until:</span>
                    <span className="font-medium text-sd-blue">{formatDate(activeDetail.reserved_until)}</span>
                  </div>
                )}

                {isRequest && requestDetail?.reviewed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sd-grey-11">Reviewed At:</span>
                    <span className="font-medium text-sd-grey-12">{formatDate(requestDetail.reviewed_at)}</span>
                  </div>
                )}

                {isRequest && requestDetail?.reviewed_by && (
                  <div className="flex items-center justify-between">
                    <span className="text-sd-grey-11">Reviewed By:</span>
                    <span className="font-medium text-sd-grey-12">
                      {requestDetail.reviewed_by.first_name} {requestDetail.reviewed_by.last_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason if present */}
            {isRequest && requestDetail?.rejection_reason && (
              <div className="flex flex-col gap-[8px] rounded-[10px] border border-red-200 bg-red-50/50 p-[16px]">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-red-700">
                  Rejection Reason
                </span>
                <p className="text-[13px] text-red-800 leading-[20px]">
                  {requestDetail.rejection_reason}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer Action Footer */}
      <div className="border-t border-sd-grey-3 p-[16px] flex items-center justify-end gap-[10px] bg-sd-grey-1">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-[40px] px-[16px]"
        >
          Close
        </Button>

        {isRequest && status === "PENDING" && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                if (requestId && onRejectRequest) onRejectRequest(requestId);
              }}
              className="h-[40px] px-[16px] border-[#D54800] text-[#D54800] hover:bg-[#FFF0ED]"
            >
              Reject Request
            </Button>
            <Button
              variant="app-primary"
              onClick={() => {
                onOpenChange(false);
                if (requestId && onApproveRequest) onApproveRequest(requestId);
              }}
              className="h-[40px] px-[16px]"
            >
              Approve Request
            </Button>
          </>
        )}

        {!isRequest && activeReservationId && onReleaseActive && (
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onReleaseActive(activeReservationId);
            }}
            className="h-[40px] px-[16px] border-[#D54800] text-[#D54800] hover:bg-[#FFF0ED]"
          >
            Release Reservation
          </Button>
        )}
      </div>
    </SideDrawer>
  );
};
