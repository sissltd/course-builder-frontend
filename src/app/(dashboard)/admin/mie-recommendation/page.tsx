import React from "react";
import { MieRecommendationView } from "@/modules/admin/mie-recommendation/MieRecommendationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MIE Recommendation",
};

export default function MieRecommendationPage() {
  return <MieRecommendationView />;
}
