"use client";

import { useGetMieDevelopersQuery } from "../api/mieApi";
import { DeveloperAccountStatus } from "../types";

/**
 * Per-status account totals for the KPI cards and tab labels. Same shape as
 * [useSubmissionStatusCounts] — one `size: 1` page per status, kept fresh by the
 * `MieDeveloper` tag whenever a decision is recorded.
 */
export const useDeveloperStatusCounts = () => {
  const pending = useGetMieDevelopersQuery({
    size: 1,
    status: DeveloperAccountStatus.PENDING,
  });
  const approved = useGetMieDevelopersQuery({
    size: 1,
    status: DeveloperAccountStatus.APPROVED,
  });
  const rejected = useGetMieDevelopersQuery({
    size: 1,
    status: DeveloperAccountStatus.REJECTED,
  });
  const suspended = useGetMieDevelopersQuery({
    size: 1,
    status: DeveloperAccountStatus.SUSPENDED,
  });

  const counts: Record<DeveloperAccountStatus, number> = {
    [DeveloperAccountStatus.PENDING]: pending.data?.data?.paginator?.count ?? 0,
    [DeveloperAccountStatus.APPROVED]:
      approved.data?.data?.paginator?.count ?? 0,
    [DeveloperAccountStatus.REJECTED]:
      rejected.data?.data?.paginator?.count ?? 0,
    [DeveloperAccountStatus.SUSPENDED]:
      suspended.data?.data?.paginator?.count ?? 0,
  };

  // The four statuses are exhaustive, so their sum is every registered account.
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return {
    counts,
    total,
    isLoading:
      pending.isLoading ||
      approved.isLoading ||
      rejected.isLoading ||
      suspended.isLoading,
  };
};
