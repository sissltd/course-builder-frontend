import React from "react";
import { AdminDashboardLayout } from "@/modules/admin/dashboard/layouts/AdminDashboardLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
