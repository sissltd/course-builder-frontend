import React from "react";
import { AdminNotificationsView } from "@/modules/admin/notifications/AdminNotificationsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function AdminNotificationsPage() {
  return <AdminNotificationsView />;
}
