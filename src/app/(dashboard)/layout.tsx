import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "SoluDesks",
    template: "%s | SoluDesks",
  },
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
