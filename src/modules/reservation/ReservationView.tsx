"use client";

import React, { useState } from "react";
import { ReservationStats } from "./components/ReservationStats";
import { ReservationTable } from "./components/ReservationTable";
import { ReservationDrawer } from "./components/ReservationDrawer";
import { RequestTopicModal } from "./components/RequestTopicModal";
import { RequestSuccessModal } from "./components/RequestSuccessModal";
import { Reservation } from "./columns/reservation";
import { AppButton } from "@/components/shared/AppButton";
import { Add } from "iconsax-react";

export const ReservationView = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleRowClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleActionClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleRequestSuccess = () => {
    setIsRequestModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[28px] font-semibold text-[#202020] tracking-[-0.56px]">
            Reservation
          </h1>
          <p className="text-[16px] text-[#606060]">
            Reserve a topic of interested to further work on
          </p>
        </div>
        
        <AppButton 
          variant="app-primary" 
          leftIcon={<Add size={20} variant="Linear" color="currentColor" />}
          onClick={() => setIsRequestModalOpen(true)}
        >
          Request topic
        </AppButton>
      </div>

      {/* Stats Cards */}
      <ReservationStats />

      {/* Reservation Table */}
      <div className="mt-[8px]">
        <ReservationTable 
          onRowClick={handleRowClick} 
          onActionClick={handleActionClick} 
        />
      </div>

      {/* Side Drawer for Details */}
      <ReservationDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        reservation={selectedReservation}
      />

      {/* Modals */}
      <RequestTopicModal
        isOpen={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSuccess={handleRequestSuccess}
      />

      <RequestSuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  );
};
