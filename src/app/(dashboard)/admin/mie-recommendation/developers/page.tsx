import React from "react";
import type { Metadata } from "next";
import { MieDevelopersView } from "@/modules/admin/mie-recommendation/MieDevelopersView";

export const metadata: Metadata = {
  title: "MIE Developers",
};

export default function MieDevelopersPage() {
  return <MieDevelopersView />;
}
