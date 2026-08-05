import type { Metadata } from "next";

import { LegalView } from "@/modules/website/views/LegalView";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return <LegalView />;
}
