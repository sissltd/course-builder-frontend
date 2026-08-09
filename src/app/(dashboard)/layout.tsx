import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "SoluDesk",
    template: "%s | SoluDesk",
  },
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
