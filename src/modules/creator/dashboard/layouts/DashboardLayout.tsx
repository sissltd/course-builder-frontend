"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreatorRoute } from "@/lib/routes";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isKyc = pathname === CreatorRoute.KYC;
  const isBuilder = pathname.startsWith(CreatorRoute.COURSES_BUILDER);
  const isCreateCourse = pathname === CreatorRoute.COURSES_CREATE;
  const hideSidebarAndHeader = isKyc || isBuilder || isCreateCourse;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={cn("min-h-screen bg-sd-grey-3/80", isBuilder && "h-screen overflow-hidden")}>
      {!hideSidebarAndHeader && (
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <div className={cn("flex flex-col min-h-screen", isBuilder && "h-screen overflow-hidden")}>
        {!hideSidebarAndHeader && (
          <DashboardHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          hideSidebarAndHeader ? "p-0 ml-0 bg-[#FDFDFD]" : "ml-0 md:ml-[225px] p-[20px] bg-sd-grey-1/50",
          isBuilder && "h-full overflow-hidden"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
