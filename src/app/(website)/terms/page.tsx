import type { Metadata } from "next";

import { LegalView } from "@/modules/website/views/LegalView";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return <LegalView />;
}
