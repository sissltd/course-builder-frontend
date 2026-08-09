import React from "react";
import type { Metadata } from "next";
import BuilderView from "@/modules/builder/BuilderView";

export const metadata: Metadata = {
  title: "Course Builder",
};

export default function BuilderPage() {
  return <BuilderView />;
}
