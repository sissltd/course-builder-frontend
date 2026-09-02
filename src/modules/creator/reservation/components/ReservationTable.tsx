"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { reservationColumns, Reservation } from "../columns/reservation";
import { Sort } from "iconsax-react";

interface ReservationTableProps {
  data: Reservation[];
  onRowClick: (reservation: Reservation) => void;
  onActionClick: (reservation: Reservation) => void;
}

export const ReservationTable = ({ data, onRowClick, onActionClick }: ReservationTableProps) => {
  return (
    <BaseTable
      title="Reservation"
      columns={reservationColumns(onActionClick)}
      data={data}
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
