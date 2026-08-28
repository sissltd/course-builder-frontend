import React from "react";
import type { Metadata } from "next";
import { MieSubmissionsView } from "@/modules/admin/mie-recommendation/MieSubmissionsView";

export const metadata: Metadata = {
  title: "MIE Submissions",
};

export default function MieSubmissionsPage() {
  return <MieSubmissionsView />;
}
