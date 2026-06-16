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

  return (
    <div className="min-h-screen bg-sd-grey-3/80">
      {!isKyc && <DashboardSidebar />}
      <div className="flex flex-col min-h-screen">
        {!isKyc && <DashboardHeader />}
        <main className={cn("flex-1 overflow-auto", isKyc ? "p-0 ml-0" : "ml-[225px] p-[20px] bg-sd-grey-1/50")}>
          {children}
        </main>
      </div>
    </div>
  );
};
