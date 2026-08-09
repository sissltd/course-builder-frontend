import React from "react";
import { ActivityLogView } from "@/modules/admin/activity-log/ActivityLogView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Log",
};

export default function ActivityLogPage() {
  return <ActivityLogView />;
}
