"use client";

import React from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Edit2, TickSquare, Wallet, CloseSquare } from "iconsax-react";

export const ReservationStats = () => {
  const stats = [
    {
      label: "Total request",
      value: "4",
      icon: <Edit2 size={24} variant="Bulk" color="#0063EF" />,
    },
    {
      label: "Approved",
      value: "4",
      icon: <TickSquare size={24} variant="Bulk" color="#008500" />,
    },
    {
      label: "Pending approval",
      value: "2",
      icon: <Wallet size={24} variant="Bulk" color="#FF6B00" />,
    },
    {
      label: "Rejected",
      value: "2",
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
