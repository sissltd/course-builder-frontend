import type { Metadata } from "next";

import { PrivacyPolicyView } from "@/modules/website/views/PrivacyPolicyView";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return <PrivacyPolicyView />;
}
