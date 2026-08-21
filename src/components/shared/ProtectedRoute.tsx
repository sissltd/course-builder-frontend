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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(AuthRoute.LOGIN);
      return;
    }

    if (
      status === "authenticated" &&
      allowedRoles &&
      allowedRoles.length > 0
    ) {
      const userRole = session?.user?.role;
      if (userRole && !allowedRoles.includes(userRole)) {
        const workspace = getWorkspaceForRole(userRole as never);
        router.replace(getDashboardRoute(workspace));
      }
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session?.user?.role;
    if (userRole && !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
