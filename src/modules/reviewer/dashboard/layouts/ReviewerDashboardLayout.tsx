"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReviewerHeader } from "../components/ReviewerHeader";
import { ReviewerSidebar } from "../components/ReviewerSidebar";
import { ReviewerRoute } from "@/lib/routes";

interface ReviewerDashboardLayoutProps {
  children: React.ReactNode;
}

export const ReviewerDashboardLayout = ({
  children,
}: ReviewerDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const titleMap: Record<string, string> = {
    [ReviewerRoute.DASHBOARD]: "REVIEWER DASHBOARD",
    [ReviewerRoute.PENDING]: "PENDING",
    [ReviewerRoute.APPROVED_COURSES]: "APPROVED",
    [ReviewerRoute.IN_REVIEW]: "IN REVIEW",
    [ReviewerRoute.PUBLISHED_COURSES]: "PUBLISHED COURSES",
    [ReviewerRoute.ACTIVITY_LOG]: "ACTIVITY LOG",
    [ReviewerRoute.NOTIFICATIONS]: "NOTIFICATION",
    [ReviewerRoute.SETTINGS]: "SETTING",
  };

  return (
    <div className="min-h-screen bg-sd-footer-bg">
      <ReviewerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ReviewerHeader
        title={titleMap[pathname] ?? "REVIEWER DASHBOARD"}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <main
        className={cn(
          "ml-0 md:ml-[237px] pt-[59px] min-h-screen bg-sd-grey-1",
          "px-[16px] py-[24px] md:px-[24px] md:py-[33px]",
        )}
      >
        {children}
      </main>
    </div>
  );
};
