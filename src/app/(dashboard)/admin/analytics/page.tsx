import React from "react";
import { AnalyticsView } from "@/modules/admin/analytics/AnalyticsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
