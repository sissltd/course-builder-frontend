"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const userRole = session?.user?.role;
  const isAllowed = checkIsRoleAllowed(userRole, allowedRoles);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(AuthRoute.LOGIN);
      return;
    }

    if (status === "authenticated" && !isAllowed) {
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

