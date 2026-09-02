"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Reservation } from "../columns/reservation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { TopicReservationStatus } from "../types";
import { useDeleteTopicReservationMutation } from "../hooks";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

interface ReservationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

const StatusChip = ({ status }: { status: TopicReservationStatus }) => {
  const styles: Record<TopicReservationStatus, string> = {
    [TopicReservationStatus.APPROVED]: "bg-[#ECFDF3] text-[#027A48]",
    [TopicReservationStatus.PENDING]: "bg-[#FFFAEB] text-[#B54708]",
    [TopicReservationStatus.REJECTED]: "bg-[#FEF3F2] text-[#B42318]",
  };

  const labels: Record<TopicReservationStatus, string> = {
    [TopicReservationStatus.APPROVED]: "Approved",
    [TopicReservationStatus.PENDING]: "Pending",
    [TopicReservationStatus.REJECTED]: "Rejected",
  };

  return (
    <div className={cn("px-[8px] py-[2px] rounded-[16px] text-[12px] font-medium w-fit", styles[status])}>
      {labels[status]}
    </div>
  );
};

export const ReservationDrawer = ({ isOpen, onOpenChange, reservation }: ReservationDrawerProps) => {
  const [deleteReservation, { isLoading: isDeleting }] = useDeleteTopicReservationMutation();
  const [showConfirm, setShowConfirm] = React.useState(false);

  if (!reservation) return null;

  const handleWithdraw = async () => {
    if (!reservation) return;
    try {
      await deleteReservation(reservation.id).unwrap();
      setShowConfirm(false);
      onOpenChange(false);
    } catch {
      // error handled by RTK Query
    }
  };

  return (
    <>
      <SideDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Topic details"
      >
        <div className="flex flex-col gap-[32px]">
          {/* Topic Details Section */}
          <div className="flex flex-col gap-[20px]">
            <h3 className="text-[12px] font-semibold text-[#B6B6B6] tracking-[0.06em] uppercase">
              TOPIC DETAILS
            </h3>
            
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#606060]">Status</span>
                <StatusChip status={reservation.status} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#606060]">Title</span>
                <span className="text-[14px] text-[#202020] font-medium text-right max-w-[240px]">
                  {reservation.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#606060]">Category</span>
                <span className="text-[14px] text-[#202020] font-medium text-right">
                  {reservation.category.name}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#F0F0F0] w-full" />

          {/* Rejection Reason Section (shown when rejected) */}
          {reservation.status === TopicReservationStatus.REJECTED && reservation.rejection_reason && (
            <div className="flex flex-col gap-[12px]">
              <h3 className="text-[12px] font-semibold text-[#B6B6B6] tracking-[0.06em] uppercase">
                REJECTION REASON
              </h3>
              <p className="text-[14px] text-[#606060] leading-[20px]">
                {reservation.rejection_reason}
              </p>
            </div>
          )}

          {/* Action Button (only for pending requests) */}
          {reservation.status === TopicReservationStatus.PENDING && (
            <div className="mt-[20px]">
              <Button 
                variant="app-outline" 
                className="w-full border-[#FF5025] text-[#FF5025] hover:bg-[#FEF3F2] hover:text-[#B42318] hover:border-[#B42318]"
                onClick={() => setShowConfirm(true)}
                isLoading={isDeleting}
              >
                Withdraw Request
              </Button>
            </div>
          )}
        </div>
      </SideDrawer>

      <ConfirmModal
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        title="Withdraw request?"
        description="Are you sure you want to withdraw this topic request? This action cannot be undone."
        confirmLabel="Yes, withdraw"
        variant="danger"
        onConfirm={handleWithdraw}
      />
    </>
  );
};
