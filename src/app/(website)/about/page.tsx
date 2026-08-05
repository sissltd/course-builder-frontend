import type { Metadata } from "next";

import { AboutView } from "@/modules/website/views/AboutView";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <AboutView />;
}
