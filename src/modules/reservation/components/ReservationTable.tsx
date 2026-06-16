"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { reservationColumns, Reservation } from "../columns/reservation";
import { Sort } from "iconsax-react";

const reservations: Reservation[] = [
  { id: "1", topic: "Introduction to Software Development", category: "Information technology", status: "Approved", dateRequested: "23 Mar 2026, 10:34 PM" },
  { id: "2", topic: "Version Control and Collaboration", category: "Artificial intelligence", status: "Pending", dateRequested: "23 Mar 2026, 10:34 PM" },
  { id: "3", topic: "Fundamentals of Programming Languages", category: "Cloud computing", status: "Approved", dateRequested: "23 Mar 2026, 10:34 PM" },
  { id: "4", topic: "Network Infrastructure Maintenance", category: "Information technology", status: "Approved", dateRequested: "23 Mar 2026, 10:34 PM" },
  { id: "5", topic: "Debugging and Testing Techniques", category: "Information technology", status: "Rejected", dateRequested: "23 Mar 2026, 10:34 PM" },
  { id: "6", topic: "Version Control and Collaboration", category: "Cybersecurity", status: "Approved", dateRequested: "23 Mar 2026, 10:34 PM" },
];

interface ReservationTableProps {
  onRowClick: (reservation: Reservation) => void;
  onActionClick: (reservation: Reservation) => void;
}

export const ReservationTable = ({ onRowClick, onActionClick }: ReservationTableProps) => {
  return (
    <BaseTable
      title="Reservation"
      columns={reservationColumns(onActionClick)}
      data={reservations}
      searchPlaceholder="Search topic"
      filters={[
        {
          label: "Category",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Information technology", value: "IT" },
            { label: "Artificial intelligence", value: "AI" },
            { label: "Cloud computing", value: "Cloud" },
          ],
          onValueChange: (val) => console.log("Category filter:", val),
        },
        {
          label: "Status",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending",  value: "Pending" },
            { label: "Rejected", value: "Rejected" },
          ],
          onValueChange: (val) => console.log("Status filter:", val),
        },
      ]}
      showDateFilter
      showHeader={false}
      showPagination
      onRowClick={onRowClick}
    />
  );
};
