"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { adminAccessForPath, firstAllowedAdminRoute } from "@/modules/admin/access";
import { AdminRoute } from "@/lib/routes";

const pageTitles: Record<string, string> = {
  [AdminRoute.OVERVIEW]: "Overview",
  [AdminRoute.ANALYTICS]: "Analytics",
  [AdminRoute.MIE_RECOMMENDATION]: "MIE Recommendation",
  [AdminRoute.SYSTEM_HEALTH]: "System Health",
  [AdminRoute.APE_PIPELINE]: "APE Pipeline",
  [AdminRoute.TEAMS]: "Teams",
  [AdminRoute.COURSES]: "Courses",
  [AdminRoute.PRODUCTION]: "Production",
  [AdminRoute.PUBLISHED]: "Published",
  [AdminRoute.RESERVATION]: "Reservation",
  [AdminRoute.CATEGORIES]: "Categories",
  [AdminRoute.TOPICS]: "Topics",
  [AdminRoute.NOTIFICATIONS]: "Notification",
  [AdminRoute.ACTIVITY_LOG]: "Activity Log",
  [AdminRoute.SETTINGS]: "Settings",
  [AdminRoute.KYC_REVIEW]: "KYC Review",
  [AdminRoute.WALLETS]: "Wallets",
  [AdminRoute.USERS]: "Users",
};

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { canAny, isLoading: isPermissionsLoading } = usePermissions();
  const title = pageTitles[pathname] || "";

  /*
    Route-level gating.

    The sidebar hides links the caller cannot use, but nothing stops a typed URL
    or a stale bookmark — so the same table decides here whether the page may
    render at all. A blocked deep link redirects to the first admin page the
    caller *can* open, rather than to Overview, which they may not have either.

    Held until the permission set resolves: `canAny` fails closed while loading,
    and redirecting on that would bounce everyone off their own landing page.
  */
  const required = adminAccessForPath(pathname);
  const isBlocked =
    !isPermissionsLoading && !!required && !canAny(required);
  /*
    Where a blocked caller is sent. `null` means the admin area holds nothing for
    them at all — now reachable, since Writers and AI Reviewers can enter — and
    redirecting then would only bounce them between pages they cannot open, so
    the layout stops and says so instead.
  */
  const fallback = isPermissionsLoading ? null : firstAllowedAdminRoute(canAny);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isBlocked && fallback && fallback !== pathname) router.replace(fallback);
  }, [isBlocked, fallback, pathname, router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader title={title} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <main className={cn("ml-0 md:ml-[237px] pt-[59px] p-[20px] min-h-screen")}>
        {isBlocked ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-[16px]">
            {fallback ? (
              <>
                <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
                <span className="text-[14px] text-sd-grey-11">
                  You do not have access to this page — taking you somewhere you do.
                </span>
              </>
            ) : (
              <span className="max-w-[420px] text-center text-[14px] text-sd-grey-11">
                Your account does not have access to this area yet. Ask a Super
                Admin to grant you permissions for the pages you need.
              </span>
            )}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};
