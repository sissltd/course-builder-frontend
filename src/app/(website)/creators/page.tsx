import type { Metadata } from "next";

import { CreatorsView } from "@/modules/website/views/CreatorsView";

export const metadata: Metadata = {
  title: "Creators",
};

export default function CreatorsPage() {
  return <CreatorsView />;
}
