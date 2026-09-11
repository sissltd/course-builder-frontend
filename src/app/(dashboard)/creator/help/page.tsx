import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HelpView } from "@/modules/creator/help/HelpView";

export const metadata: Metadata = {
  title: "Help",
};

export default function HelpPage() {
  return (
    <Suspense>
      <HelpView />
    </Suspense>
  );
}
