import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { AdminDashboardLayout } from "@/modules/admin/dashboard/layouts/AdminDashboardLayout";
import { Workspace } from "@/modules/auth/types/auth";
import { seatsForWorkspace } from "@/modules/auth/utils/workspace";

/** Admin, Super Admin, Writer and AI Reviewer — per `SEAT_WORKSPACE`. */
const adminSeats = seatsForWorkspace(Workspace.ADMIN_DASHBOARD);

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={adminSeats}>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </ProtectedRoute>
  );
}
