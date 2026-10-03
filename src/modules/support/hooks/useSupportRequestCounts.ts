"use client";

import { useGetSupportRequestsQuery } from "../api/supportApi";
import {
  SUPPORT_REQUEST_STATUSES,
  type SupportRequestStatus,
} from "../types";

/**
 * Per-status totals for the queue's KPI cards.
 *
 * `GET /support/requests/` has no aggregate route, so each figure comes from a
 * `page_size: 1` request whose rows are discarded and only `paginator.count`
 * read — the same approach `useSubmissionStatusCounts` uses for MIE.
 *
 * One query is written out per status rather than mapped over
 * `SUPPORT_REQUEST_STATUSES`, because a hook inside a `.map()` callback trips the
 * rules-of-hooks lint. Adding a status to the enum therefore needs a matching
 * line here — the `Record` below stops the hook compiling until both are in
 * step, so a card can never quietly report 0.
 *
 * These are whole-queue totals: they deliberately ignore the queue's own filters
 * so the card labels stay stable while an operator is filtering.
 */
export const useSupportRequestCounts = () => {
  const open = useGetSupportRequestsQuery({
    page: 1,
    page_size: 1,
    status: SUPPORT_REQUEST_STATUSES[0],
  });
  const inProgress = useGetSupportRequestsQuery({
    page: 1,
    page_size: 1,
    status: SUPPORT_REQUEST_STATUSES[1],
  });
  const resolved = useGetSupportRequestsQuery({
    page: 1,
    page_size: 1,
    status: SUPPORT_REQUEST_STATUSES[2],
  });
  const closed = useGetSupportRequestsQuery({
    page: 1,
    page_size: 1,
    status: SUPPORT_REQUEST_STATUSES[3],
  });

  const counts: Record<SupportRequestStatus, number> = {
    [SUPPORT_REQUEST_STATUSES[0]]: open.data?.data?.paginator?.count ?? 0,
    [SUPPORT_REQUEST_STATUSES[1]]: inProgress.data?.data?.paginator?.count ?? 0,
    [SUPPORT_REQUEST_STATUSES[2]]: resolved.data?.data?.paginator?.count ?? 0,
    [SUPPORT_REQUEST_STATUSES[3]]: closed.data?.data?.paginator?.count ?? 0,
  };

  return {
    counts,
    total: Object.values(counts).reduce((sum, value) => sum + value, 0),
    /** Requests still awaiting a decision — the ones Resolve acts on. */
    open: counts[SUPPORT_REQUEST_STATUSES[0]],
    inProgress: counts[SUPPORT_REQUEST_STATUSES[1]],
    isLoading:
      open.isLoading || inProgress.isLoading || resolved.isLoading || closed.isLoading,
  };
};
