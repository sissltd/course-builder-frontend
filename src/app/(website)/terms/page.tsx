import type { Metadata } from "next";

import { TermsOfUseView } from "@/modules/website/views/TermsOfUseView";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return <TermsOfUseView />;
}
