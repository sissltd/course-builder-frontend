"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthRoute } from "@/lib/routes";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * The seats this dashboard admits. Pass `seatsForWorkspace(...)` rather than
   * a hand-written list, so the gate and the seat→workspace map can't disagree.
   */
  allowedRoles?: string[];
}

/**
 * A plain membership test, deliberately.
 *
 * This used to also pass any Super Admin, and to treat "any reviewer seat" as
 * matching if the list contained any reviewer seat. Both were removed when the
 * seat→workspace map became explicit: the family rule is what would otherwise
 * keep letting an AI Reviewer — now an admin-dashboard seat — into the reviewer
 * studio, and Super Admin is already named in the admin list it needs.
 */
function checkIsRoleAllowed(role?: string, allowedRoles?: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;

  const userRoleNorm = role.trim().toUpperCase();
  return allowedRoles.some((r) => r.trim().toUpperCase() === userRoleNorm);
}

/**
 * How long an `unauthenticated` report has to hold before it is believed.
 *
 * `next-auth` reports `unauthenticated` both when the cookie is genuinely gone
 * and when a session read simply failed — a window-focus refetch on a flaky
 * connection, or a tab the browser throttled. Those are momentary, and
 * redirecting on them threw a signed-in user onto the login page. Waiting one
 * beat lets the in-flight read settle; a real sign-out is still unauthenticated
 * after it, and `auth` is only reached client-side after the proxy has already
 * let the request through.
 */
const UNAUTHENTICATED_CONFIRM_MS = 500;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  // The redirect is decided once. Repeating it on every report stacked
  // navigations and re-fired the login page on top of itself.
  const hasRedirected = useRef(false);

  const userRole = session?.user?.role;
  const isAllowed = checkIsRoleAllowed(userRole, allowedRoles);

  useEffect(() => {
    if (status !== "unauthenticated" || hasRedirected.current) return;

    // Listing `status` as a dependency is what makes this safe: if the session
    // recovers, cleanup cancels the timer before it can fire.
    const timeoutId = setTimeout(() => {
      if (hasRedirected.current) return;

      hasRedirected.current = true;
      // Keep the destination so signing back in returns the user where they
      // were rather than dumping them on the dashboard.
      router.replace(
        `${AuthRoute.LOGIN}?callbackUrl=${encodeURIComponent(pathname ?? "/")}`,
      );
    }, UNAUTHENTICATED_CONFIRM_MS);

    return () => clearTimeout(timeoutId);
  }, [status, router, pathname]);

  useEffect(() => {
    if (hasRedirected.current) return;

    if (status === "authenticated" && !isAllowed) {
      hasRedirected.current = true;
      const workspace = getWorkspaceForRole(userRole as never);
      const target = getDashboardRoute(workspace);
      if (typeof window !== "undefined" && window.location.pathname !== target) {
        router.replace(target);
      }
    }
  }, [status, isAllowed, userRole, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sd-grey-1">
        <div className="flex items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
          <span className="text-[14px] text-sd-grey-11">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sd-grey-1">
        <div className="flex items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
          <span className="text-[14px] text-sd-grey-11">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sd-grey-1">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
          <span className="text-[14px] text-sd-grey-11">Redirecting to your workspace...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

