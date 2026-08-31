"use client";

import { useGetMieSubmissionsQuery } from "../api/mieApi";
import { SubmissionStatus } from "../types";

/**
 * Per-status totals for the KPI cards and tab labels.
 *
 * The list endpoint has no aggregate/count route, so each figure comes from a
 * `size: 1` page — the rows are thrown away and only `paginator.count` is used.
 * Every query carries the `MieSubmission` tag, so a decision anywhere in the
 * module refreshes all of them.
 *
 * These are whole-queue totals: they deliberately ignore the search box and date
 * filter so the tab labels stay stable while an operator is typing.
 */
export const useSubmissionStatusCounts = () => {
  const pendingReview = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.PENDING_REVIEW,
  });
  const duplicateInQueue = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.DUPLICATE_IN_QUEUE,
  });
  const duplicateExisting = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.DUPLICATE_EXISTING,
  });
  const previouslyRejected = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.PREVIOUSLY_REJECTED,
  });
  const approved = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.APPROVED,
  });
  const rejected = useGetMieSubmissionsQuery({
    size: 1,
    status: SubmissionStatus.REJECTED,
  });

  const counts: Record<SubmissionStatus, number> = {
    [SubmissionStatus.PENDING_REVIEW]:
      pendingReview.data?.data?.paginator?.count ?? 0,
    [SubmissionStatus.DUPLICATE_IN_QUEUE]:
      duplicateInQueue.data?.data?.paginator?.count ?? 0,
    [SubmissionStatus.DUPLICATE_EXISTING]:
      duplicateExisting.data?.data?.paginator?.count ?? 0,
    [SubmissionStatus.PREVIOUSLY_REJECTED]:
      previouslyRejected.data?.data?.paginator?.count ?? 0,
    [SubmissionStatus.APPROVED]: approved.data?.data?.paginator?.count ?? 0,
    [SubmissionStatus.REJECTED]: rejected.data?.data?.paginator?.count ?? 0,
  };

  // The six statuses are exhaustive, so their sum is the queue total — no extra
  // unfiltered request needed.
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const flaggedByDedup =
    counts[SubmissionStatus.DUPLICATE_IN_QUEUE] +
    counts[SubmissionStatus.DUPLICATE_EXISTING] +
    counts[SubmissionStatus.PREVIOUSLY_REJECTED];

  return {
    counts,
    total,
    flaggedByDedup,
    isLoading:
      pendingReview.isLoading ||
      duplicateInQueue.isLoading ||
      duplicateExisting.isLoading ||
      previouslyRejected.isLoading ||
      approved.isLoading ||
      rejected.isLoading,
  };
};
