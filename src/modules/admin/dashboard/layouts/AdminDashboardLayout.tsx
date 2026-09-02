"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Overview",
  "/admin/analytics": "Analytics",
  "/admin/mie-recommendation": "MIE Recommendation",
  "/admin/system-health": "System Health",
  "/admin/ape-pipeline": "APE Pipeline",
  "/admin/teams": "Teams",
  "/admin/courses": "Courses",
  "/admin/production": "Production",
  "/admin/published": "Published",
  "/admin/reservation": "Reservation",
  "/admin/categories": "Categories",
  "/admin/notifications": "Notification",
  "/admin/activity-log": "Activity Log",
  "/admin/settings": "Settings",
  "/admin/kyc-review": "KYC Review",
  "/admin/wallets": "Wallets",
};

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = pageTitles[pathname] || "";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader title={title} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <main className={cn("ml-0 md:ml-[237px] pt-[59px] p-[20px] min-h-screen")}>
        {children}
      </main>
    </div>
  );
};
