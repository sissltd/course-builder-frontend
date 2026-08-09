import React from "react";
import { ReservationView } from "@/modules/creator/reservation/ReservationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation",
};

export default function ReservationPage() {
  return <ReservationView />;
}
