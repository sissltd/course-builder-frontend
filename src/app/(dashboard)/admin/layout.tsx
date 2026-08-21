import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { AdminDashboardLayout } from "@/modules/admin/dashboard/layouts/AdminDashboardLayout";
import { UserRole } from "@/modules/auth/types/auth";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={[UserRole.SUPER_ADMIN, UserRole.STAFF]}
    >
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </ProtectedRoute>
  );
}
