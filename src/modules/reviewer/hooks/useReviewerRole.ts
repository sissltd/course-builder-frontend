"use client";

import { PERMISSION } from "@/modules/auth/permissions";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { UserRole } from "@/modules/auth/types/auth";

/**
 * What the current user may do on a review-queue item, derived from
 * `Me.permissions` plus their seat.
 *
 * This replaced two hardcoded role arrays, which were wrong in both
 * directions: a custom role created through `/admin/roles/` and granted
 * `courses.publish` was hidden, while a built-in role stripped of that
 * permission still saw the button. The comment that used to sit here claimed
 * "the API does not enforce the reviewer/approver split — a plain reviewer
 * calling `publish` succeeds". It does enforce it, per action, and the schema
 * spells out the rule for each one.
 *
 * Only the QA half of the seat rules is expressible here, and it is exact:
 * `qa-approve` / `qa-claim` / `qa-reject` need the QA Reviewer base role plus
 * `courses.approve`/`courses.reject`, or `courses.assign` for any seat. For
 * content review the required seat depends on the stage the course is in
 * (Creator Reviewer for First and Second Review, Verifier for Verification),
 * and the item's stage is not reliably exposed to us — so that half stays
 * server-enforced as a 400, exactly as the ownership check noted in
 * `ReviewerCourseOverviewView` already is.
 */
export function useReviewerRole() {
  const { can, role, isLoading } = usePermissions();

  /*
    `courses.assign` holders — Admin, Approver and Super Admin by default — may
    take any seat, which is the backend's own override for every seat-specific
    rule. It stands in for the seat half of those rules throughout.
  */
  const canTakeAnySeat = can(PERMISSION.COURSES_ASSIGN);

  return {
    role,
    isLoading,
    canPublish: can(PERMISSION.COURSES_PUBLISH),
    canApprove: canTakeAnySeat || can(PERMISSION.COURSES_APPROVE),
    canReject: canTakeAnySeat || can(PERMISSION.COURSES_REJECT),
    canClaim:
      canTakeAnySeat ||
      can(PERMISSION.COURSES_APPROVE) ||
      can(PERMISSION.COURSES_REJECT),
    canQa:
      canTakeAnySeat ||
      (role === UserRole.QA_REVIEWER && can(PERMISSION.COURSES_APPROVE)),
  };
}
