"use client";

import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { WorkspacePageGuard } from "@/components/shared/WorkspacePageGuard";
import { Workspace } from "@/modules/auth/types/auth";
import { seatsForWorkspace } from "@/modules/auth/utils/workspace";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { adminAccessForPath, firstAllowedAdminRoute } from "@/modules/admin/access";
import { AdminRoute } from "@/lib/routes";

/** Admin, Super Admin, Writer and AI Reviewer — per `SEAT_WORKSPACE`. */
const adminSeats = seatsForWorkspace(Workspace.ADMIN_DASHBOARD);

/**
 * This route sits outside the `(dashboard)` group, so it inherits neither the
 * seat gate nor the access table from `src/app/(dashboard)/admin/layout.tsx`.
 * Both are applied here instead.
 *
 * The rule is looked up by path rather than hardcoded: it is the same
 * `COURSE_OVERVIEW` row of `ADMIN_SUB_PAGE_ACCESS` that guards the course
 * overview opened from a row inside the dashboard, and routing both through
 * `adminAccessForPath` keeps them from drifting apart.
 */
export default function AdminCourseOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canAny, isLoading } = usePermissions();
  const required = adminAccessForPath(AdminRoute.COURSE_OVERVIEW);
  const isAllowed = !required || canAny(required);

  return (
    <ProtectedRoute allowedRoles={adminSeats}>
      <WorkspacePageGuard
        isAllowed={isAllowed}
        isLoading={isLoading}
        fallback={isLoading ? null : firstAllowedAdminRoute(canAny)}
        strandedMessage="Your account does not have access to course review yet. Ask a Super Admin to grant you permissions for the pages you need."
      >
        {children}
      </WorkspacePageGuard>
    </ProtectedRoute>
  );
}
