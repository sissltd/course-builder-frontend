import React from "react";
import { TeamsView } from "@/modules/admin/teams/TeamsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams",
};

export default function TeamsPage() {
  return <TeamsView />;
}
