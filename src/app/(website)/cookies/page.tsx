import type { Metadata } from "next";

import { CookiePolicyView } from "@/modules/website/views/CookiePolicyView";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiesPage() {
  return <CookiePolicyView />;
}
