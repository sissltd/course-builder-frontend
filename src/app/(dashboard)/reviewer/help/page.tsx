import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HelpView } from "@/modules/creator/help/HelpView";
import { ReviewerRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Reviewer Help and Support",
};

export default function ReviewerHelpPage() {
  return (
    <Suspense>
      <HelpView baseRoute={ReviewerRoute.HELP} />
    </Suspense>
  );
}
