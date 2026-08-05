import type { Metadata } from "next";

import { CompanyView } from "@/modules/website/views/CompanyView";

export const metadata: Metadata = {
  title: "Company",
};

export default function CompanyPage() {
  return <CompanyView />;
}
