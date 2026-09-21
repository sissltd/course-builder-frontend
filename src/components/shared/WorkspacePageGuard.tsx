"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface WorkspacePageGuardProps {
  children: React.ReactNode;
  /**
   * Whether the page is open to this caller, decided by the caller from its own
   * area's access table. Passed in rather than computed here so the rule keeps
   * living in exactly one place per area.
   */
  isAllowed: boolean;
  /** True while the permission set is still resolving — the gate fails closed. */
  isLoading: boolean;
  /** Where to send a blocked caller, or `null` when the area holds nothing for them. */
  fallback: string | null;
  /** Shown when there is nowhere to send them, e.g. "no access to the review queue". */
  strandedMessage: string;
  /** Shown briefly above the spinner while a blocked caller is redirected. */
  redirectMessage?: string;
}

/**
 * Page-level gating for routes that sit *outside* a `(dashboard)` group.
 *
 * `/admin/course-overview/[courseId]` and `/reviewer/course-overview/[courseId]`
 * are full-page views with their own chrome, so they inherit no layout and no
 * access check from the dashboards they belong to — middleware authenticates
 * them, nothing authorises them. Their layouts wrap the page in this instead of
 * growing a second copy of the dashboard guard.
 */
export const WorkspacePageGuard = ({
  children,
  isAllowed,
  isLoading,
  fallback,
  strandedMessage,
  redirectMessage = "You do not have access to this page — taking you somewhere you do.",
}: WorkspacePageGuardProps) => {
  const router = useRouter();
  const isBlocked = !isLoading && !isAllowed;

  useEffect(() => {
    if (isBlocked && fallback && fallback !== window.location.pathname) {
      router.replace(fallback);
    }
  }, [isBlocked, fallback, router]);

  const shell = (children: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-sd-grey-1 px-[16px]">
      {children}
    </div>
  );

  if (isLoading) {
    return shell(
      <div className="flex items-center gap-3">
        <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
        <span className="text-[14px] text-sd-grey-11">Loading…</span>
      </div>,
    );
  }

  if (isBlocked) {
    return shell(
      fallback ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
          <span className="text-[14px] text-sd-grey-11">{redirectMessage}</span>
        </div>
      ) : (
        <span className="max-w-[420px] text-center text-[14px] text-sd-grey-11">
          {strandedMessage}
        </span>
      ),
    );
  }

  return <>{children}</>;
};
