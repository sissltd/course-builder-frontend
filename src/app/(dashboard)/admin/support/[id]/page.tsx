import React from "react";
import type { Metadata } from "next";
import { SupportRequestDetailView } from "@/modules/admin/support/SupportRequestDetailView";

export const metadata: Metadata = {
  title: "Support Request | SoluDesks Admin",
  description: "Full record and conversation for one support request",
};

export default async function AdminSupportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SupportRequestDetailView requestId={decodeURIComponent(id)} />;
}
