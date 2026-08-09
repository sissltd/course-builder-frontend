import React from "react";
import { SystemHealthView } from "@/modules/admin/system-health/SystemHealthView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Health",
};

export default function SystemHealthPage() {
  return <SystemHealthView />;
}
