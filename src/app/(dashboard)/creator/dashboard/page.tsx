import React from "react";
import { DashboardView } from "@/modules/creator/dashboard/DashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <DashboardView />;
}
