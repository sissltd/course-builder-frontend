import React from "react";
import { AdminReservationView } from "@/modules/admin/reservation/AdminReservationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation",
};

export default function AdminReservationPage() {
  return <AdminReservationView />;
}
