"use client";

import React from "react";
import { AppSideDrawer } from "@/components/shared/AppSideDrawer";
import { Reservation } from "../columns/reservation";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/shared/AppButton";

interface ReservationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

const StatusChip = ({ status }: { status: Reservation["status"] }) => {
  const styles = {
    Approved: "bg-[#ECFDF3] text-[#027A48]",
    Pending: "bg-[#FFFAEB] text-[#B54708]",
    Rejected: "bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <div className={cn("px-[8px] py-[2px] rounded-[16px] text-[12px] font-medium w-fit", styles[status])}>
      {status}
    </div>
  );
};

export const ReservationDrawer = ({ isOpen, onOpenChange, reservation }: ReservationDrawerProps) => {
  if (!reservation) return null;

  return (
    <AppSideDrawer
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
                {reservation.topic}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#606060]">Category</span>
              <span className="text-[14px] text-[#202020] font-medium text-right">
                {reservation.category}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#F0F0F0] w-full" />

        {/* Reason Section */}
        <div className="flex flex-col gap-[12px]">
          <h3 className="text-[12px] font-semibold text-[#B6B6B6] tracking-[0.06em] uppercase">
            REASON
          </h3>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            I am interested in this topic because it aligns with my current career goals and I want to deepen my knowledge in software development fundamentals.
          </p>
        </div>

        {/* Suggested Topics Section */}
        <div className="flex flex-col gap-[12px]">
          <h3 className="text-[12px] font-semibold text-[#B6B6B6] tracking-[0.06em] uppercase">
            SUGGESTED TOPICS
          </h3>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[14px] text-[#202020] font-medium">Fundamentals of programming</p>
            <p className="text-[14px] text-[#202020] font-medium">Advanced software architecture</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-[20px]">
          <AppButton 
            variant="app-outline" 
            className="w-full border-[#FF5025] text-[#FF5025] hover:bg-[#FEF3F2] hover:text-[#B42318] hover:border-[#B42318]"
            onClick={() => onOpenChange(false)}
          >
            Withdraw Request
          </AppButton>
        </div>
      </div>
    </AppSideDrawer>
  );
};
