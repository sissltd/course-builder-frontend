"use client";

import React from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { WorkspacePageGuard } from "@/components/shared/WorkspacePageGuard";
import { Workspace } from "@/modules/auth/types/auth";
import { seatsForWorkspace } from "@/modules/auth/utils/workspace";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import {
  canOpenReviewerEntry,
  firstAllowedReviewerRoute,
  reviewerAccessForPath,
} from "@/modules/reviewer/access";
import { ReviewerRoute } from "@/lib/routes";

/** Creator Reviewer, Verifier, Approver and QA Reviewer — per `SEAT_WORKSPACE`. */
const reviewerSeats = seatsForWorkspace(Workspace.REVIEWER_STUDIO);

/**
 * This route sits outside the `(dashboard)` group, so it inherits neither the
 * seat gate nor the access table from `src/app/(dashboard)/reviewer/layout.tsx`.
 * Both are applied here instead, through the same `REVIEWER_ACCESS` table the
 * sidebar and the dashboard guard read.
 */
export default function ReviewerCourseOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canAny, role, isLoading } = usePermissions();
  const required = reviewerAccessForPath(ReviewerRoute.COURSE_OVERVIEW);
  const isAllowed = !required || canOpenReviewerEntry(required, canAny, role);

  return (
    <ProtectedRoute allowedRoles={reviewerSeats}>
      <WorkspacePageGuard
        isAllowed={isAllowed}
        isLoading={isLoading}
        fallback={
          isLoading ? null : firstAllowedReviewerRoute(canAny, role)
        }
        strandedMessage="Your account does not have access to the review queue yet. Ask a Super Admin to grant you permissions for the pages you need."
      >
        {children}
      </WorkspacePageGuard>
    </ProtectedRoute>
  );
}
