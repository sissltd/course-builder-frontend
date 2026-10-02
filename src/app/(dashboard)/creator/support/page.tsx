import React from "react";
import type { Metadata } from "next";
import { CreatorSupportView } from "@/modules/creator/support/CreatorSupportView";

export const metadata: Metadata = {
  title: "My support requests",
};

export default function CreatorSupportPage() {
  return <CreatorSupportView />;
}
