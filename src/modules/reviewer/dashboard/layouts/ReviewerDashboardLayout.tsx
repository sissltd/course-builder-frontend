"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReviewerHeader } from "../components/ReviewerHeader";
import { ReviewerSidebar } from "../components/ReviewerSidebar";
import { ReviewerRoute } from "@/lib/routes";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import {
  canOpenReviewerEntry,
  firstAllowedReviewerRoute,
  reviewerAccessForPath,
} from "@/modules/reviewer/access";

const titleMap: Record<string, string> = {
  [ReviewerRoute.DASHBOARD]: "REVIEWER DASHBOARD",
  [ReviewerRoute.PENDING]: "PENDING",
  [ReviewerRoute.APPROVED_COURSES]: "APPROVED",
  [ReviewerRoute.IN_REVIEW]: "IN REVIEW",
  [ReviewerRoute.PUBLISHED_COURSES]: "PUBLISHED COURSES",
  [ReviewerRoute.COURSES]: "COURSES",
  [ReviewerRoute.REVIEW_QUEUE]: "REVIEW QUEUE",
  [ReviewerRoute.COURSE_OVERVIEW]: "COURSE OVERVIEW",
  [ReviewerRoute.FEEDBACK]: "FEEDBACK",
  [ReviewerRoute.ACTIVITY_LOG]: "ACTIVITY LOG",
  [ReviewerRoute.NOTIFICATIONS]: "NOTIFICATION",
  [ReviewerRoute.SETTINGS]: "SETTING",
};

/**
 * The header title for a path — an exact hit, or the parent of a sub-route, so
 * `/reviewer/course-overview/42` reads as "COURSE OVERVIEW" rather than falling
 * back to the dashboard title.
 */
function titleFor(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];

  const parent = Object.keys(titleMap)
    .filter((route) => pathname.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (parent && titleMap[parent]) || "REVIEWER DASHBOARD";
}

interface ReviewerDashboardLayoutProps {
  children: React.ReactNode;
}

export const ReviewerDashboardLayout = ({
  children,
}: ReviewerDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { canAny, role, isLoading: isPermissionsLoading } = usePermissions();

  /*
    Route-level gating, the counterpart to `AdminDashboardLayout`.

    The sidebar hides links the caller cannot use, but nothing stops a typed URL
    or a stale bookmark — so the same table decides here whether the page may
    render at all. Two things this area needs that the admin one does not:

    - The rule is checked through `canOpenReviewerEntry` rather than against
      `permissions` alone, because `/reviewer/dashboard` is gated on the *seat*
      (`GET /reviewer/overview/` is Creator Reviewer or Verifier, enforced in the
      service layer) and carries no permission to test.
    - `role` is part of the test, so this stays held until the profile resolves
      for the same reason `canAny` does: both fail closed while loading, and
      redirecting on that would bounce people off their own landing page.

    An Approver arriving at `/reviewer/dashboard` is therefore redirected to
    Pending rather than shown a page the API would refuse.
  */
  const required = reviewerAccessForPath(pathname);
  const isBlocked =
    !isPermissionsLoading &&
    !!required &&
    !canOpenReviewerEntry(required, canAny, role);
  /*
    Where a blocked caller is sent, or `null` when this area holds nothing for
    them — a seat with none of the queue permissions. Redirecting then would
    only bounce them between pages they cannot open, so the layout stops and
    says so instead.
  */
  const fallback = isPermissionsLoading
    ? null
    : firstAllowedReviewerRoute(canAny, role);

  useEffect(() => {
    if (isBlocked && fallback && fallback !== pathname) router.replace(fallback);
  }, [isBlocked, fallback, pathname, router]);

  return (
    <div className="min-h-screen bg-sd-footer-bg">
      <ReviewerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ReviewerHeader
        title={titleFor(pathname)}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <main
        className={cn(
          "ml-0 md:ml-[237px] pt-[59px] min-h-screen bg-sd-grey-1",
          "px-[16px] py-[24px] md:px-[24px] md:py-[33px]",
        )}
      >
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
                Your account does not have access to the review queue yet. Ask a
                Super Admin to grant you permissions for the pages you need.
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
