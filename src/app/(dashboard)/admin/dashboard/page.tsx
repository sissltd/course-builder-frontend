import React from "react";
import { AdminDashboardView } from "@/modules/admin/dashboard/AdminDashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
