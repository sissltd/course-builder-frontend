import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/modules/creator/dashboard/layouts/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
