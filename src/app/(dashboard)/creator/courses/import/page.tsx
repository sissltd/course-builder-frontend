import type { Metadata } from "next";
import DocumentImportView from "@/modules/creator/courses/DocumentImportView";

export const metadata: Metadata = {
  title: "Import Course from Document",
};

export default function DocumentImportPage() {
  return <DocumentImportView />;
}
