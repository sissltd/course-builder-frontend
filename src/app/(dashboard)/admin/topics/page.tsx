import React from "react";
import { TopicsView } from "@/modules/admin/topics/TopicsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics",
};

export default function TopicsPage() {
  return <TopicsView />;
}
