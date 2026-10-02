import React from "react";
import type { Metadata } from "next";
import { SupportQueueView } from "@/modules/admin/support/SupportQueueView";

export const metadata: Metadata = {
  title: "Support Requests | SoluDesks Admin",
  description: "Creator tickets and appeals awaiting a decision",
};

export default function AdminSupportPage() {
  return <SupportQueueView />;
}
