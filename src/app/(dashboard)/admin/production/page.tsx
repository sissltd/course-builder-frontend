import React from "react";
import { ProductionView } from "@/modules/admin/production/ProductionView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production",
};

export default function ProductionPage() {
  return <ProductionView />;
}
