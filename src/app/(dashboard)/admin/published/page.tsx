import React from "react";
import { PublishedView } from "@/modules/admin/published/PublishedView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Published",
};

export default function PublishedPage() {
  return <PublishedView />;
}
