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
  allowedRoles?: string[];
}

const REVIEWER_ROLES = [
  "REVIEWER",
  "STAFF_WRITER",
  "STAFF_VERIFIER",
  "STAFF_APPROVER",
  "CREATOR_REVIEWER",
  "AI_REVIEWER",
  "QA_REVIEWER",
];

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "STAFF"];

function checkIsRoleAllowed(role?: string, allowedRoles?: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;

  const userRoleNorm = role.trim().toUpperCase();
  const allowedNorm = allowedRoles.map((r) => r.trim().toUpperCase());

  // Direct match
  if (allowedNorm.includes(userRoleNorm)) return true;

  // Super Admin has full platform access
  if (userRoleNorm === "SUPER_ADMIN") return true;

  // Match if user is any Reviewer variant and allowedRoles accepts Reviewer
  if (
    REVIEWER_ROLES.includes(userRoleNorm) &&
    allowedNorm.some((r) => REVIEWER_ROLES.includes(r))
  ) {
    return true;
  }

  // Match if user is any Admin/Staff variant and allowedRoles accepts Admin/Staff
  if (
    ADMIN_ROLES.includes(userRoleNorm) &&
    allowedNorm.some((r) => ADMIN_ROLES.includes(r))
  ) {
    return true;
  }

  return false;
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

