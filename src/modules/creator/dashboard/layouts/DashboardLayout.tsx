"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const isKyc = pathname === CreatorRoute.KYC;
  const isBuilder = pathname.startsWith(CreatorRoute.COURSES_BUILDER);
  const isCreateCourse = pathname === CreatorRoute.COURSES_CREATE;
  const isHelpSubPage =
    pathname === CreatorRoute.HELP &&
    (searchParams.has("category") ||
      searchParams.has("article") ||
      searchParams.get("view") === "appeal" ||
      searchParams.get("view") === "appeal-success");
  const hideSidebarAndHeader = isKyc || isBuilder || isCreateCourse || isHelpSubPage;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div
      className={cn(
        "bg-sd-grey-3/80",
        isBuilder ? "fixed inset-0 overflow-hidden" : "min-h-screen",
      )}
    >
      {!hideSidebarAndHeader && (
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <div
        className={cn(
          "flex flex-col",
          isBuilder ? "h-full min-h-0 overflow-hidden" : "min-h-screen",
        )}
      >
        {!hideSidebarAndHeader && (
          <DashboardHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          hideSidebarAndHeader ? "p-0 ml-0 bg-[#FDFDFD]" : "ml-0 md:ml-[225px] p-[20px] bg-sd-grey-1/50",
          isBuilder && "h-full min-h-0 overflow-hidden"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
