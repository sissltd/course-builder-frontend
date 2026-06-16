"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const isKyc = pathname === "/kyc";
  const isBuilder = pathname.startsWith("/courses/builder");
  const hideSidebarAndHeader = isKyc || isBuilder;

  return (
    <div className={cn("min-h-screen bg-sd-grey-3/80", isBuilder && "h-screen overflow-hidden")}>
      {!hideSidebarAndHeader && <DashboardSidebar />}
      <div className={cn("flex flex-col min-h-screen", isBuilder && "h-screen overflow-hidden")}>
        {!hideSidebarAndHeader && <DashboardHeader />}
        <main className={cn("flex-1 overflow-auto", hideSidebarAndHeader ? "p-0 ml-0 bg-[#FDFDFD]" : "ml-[225px] p-[20px] bg-sd-grey-1/50", isBuilder && "h-full overflow-hidden")}>
          {children}
        </main>
      </div>
    </div>
  );
};
