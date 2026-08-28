import React from "react";
import type { Metadata } from "next";
import { MieRejectionReasonsView } from "@/modules/admin/mie-recommendation/MieRejectionReasonsView";

export const metadata: Metadata = {
  title: "MIE Rejection Reasons",
};

export default function MieRejectionReasonsPage() {
  return <MieRejectionReasonsView />;
}
