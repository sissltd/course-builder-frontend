import React from "react";
import { ApePipelineView } from "@/modules/admin/ape-pipeline/ApePipelineView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "APE Pipeline",
};

export default function ApePipelinePage() {
  return <ApePipelineView />;
}
