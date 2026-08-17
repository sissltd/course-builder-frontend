import type { Metadata } from "next";
import { ReviewerSettingsView } from "@/modules/reviewer/settings/ReviewerSettingsView";

export const metadata: Metadata = {
  title: "Reviewer Settings",
};

export default function ReviewerSettingsPage() {
  return <ReviewerSettingsView />;
}
