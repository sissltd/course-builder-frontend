"use client";

import React from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Edit2, TickSquare, Wallet, CloseSquare } from "iconsax-react";
import type { TopicReservation } from "../types";
import { TopicReservationStatus } from "../types";

interface ReservationStatsProps {
  reservations: TopicReservation[];
}

export const ReservationStats = ({ reservations }: ReservationStatsProps) => {
  const total = reservations.length;
  const approved = reservations.filter((r) => r.status === TopicReservationStatus.APPROVED).length;
  const pending = reservations.filter((r) => r.status === TopicReservationStatus.PENDING).length;
  const rejected = reservations.filter((r) => r.status === TopicReservationStatus.REJECTED).length;

  const stats = [
    {
      label: "Total request",
      value: String(total),
      icon: <Edit2 size={24} variant="Bulk" color="#0063EF" />,
    },
    {
      label: "Approved",
      value: String(approved),
      icon: <TickSquare size={24} variant="Bulk" color="#008500" />,
    },
    {
      label: "Pending approval",
      value: String(pending),
      icon: <Wallet size={24} variant="Bulk" color="#FF6B00" />,
    },
    {
      label: "Rejected",
      value: String(rejected),
      icon: <CloseSquare size={24} variant="Bulk" color="#FF5025" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};
