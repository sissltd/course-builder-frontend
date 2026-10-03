"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardText,
  Clock,
  CloseCircle,
  DirectInbox,
  Filter,
  Refresh,
  Sort,
} from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/shared/Button";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { normalizeApiError } from "@/lib/api/errors";
import { adminSupportDetailRoute } from "@/lib/routes";
import { supportRequestColumns } from "@/modules/support/columns/supportRequests";
import {
  useGetSupportRequestsQuery,
  useSupportRequestCounts,
} from "@/modules/support/hooks";
import {
  SUPPORT_REQUEST_KIND_LABELS,
  SUPPORT_REQUEST_KINDS,
  SUPPORT_REQUEST_STATUS_LABELS,
  SUPPORT_REQUEST_STATUSES,
  type SupportRequestKind,
  type SupportRequestStatus,
} from "@/modules/support/types";

/*
  Filter options are built from the exported enums rather than a hand-kept list,
  so correcting an undocumented value is a one-line change in `types.ts`.

  "No filter" is expressed through `clearable` + `clearLabel`, which the select
  renders under an internal sentinel. The alternative — an `All` option with
  `value: ""` — is what this repo's convention forbids: Radix throws while
  mounting an item with an empty value, taking the whole page with it.
*/
const KIND_OPTIONS = SUPPORT_REQUEST_KINDS.map((kind) => ({
  label: SUPPORT_REQUEST_KIND_LABELS[kind],
  value: kind,
}));

const STATUS_OPTIONS = SUPPORT_REQUEST_STATUSES.map((status) => ({
  label: SUPPORT_REQUEST_STATUS_LABELS[status],
  value: status,
}));

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_datetime" },
  { label: "Oldest", value: "created_datetime" },
  { label: "Due soonest", value: "due_at" },
  { label: "Due latest", value: "-due_at" },
];

/**
 * The admin support queue over `GET /support/requests/`.
 *
 * The route is gated by `support.manage_requests` in `ADMIN_ACCESS` and by the
 * `AdminDashboardLayout` guard, so this view does not re-check the permission —
 * the same contract every other page in the area relies on.
 */
export const SupportQueueView = () => {
  const router = useRouter();

  const [kindFilter, setKindFilter] = useState<SupportRequestKind | "">("");
  const [statusFilter, setStatusFilter] = useState<SupportRequestStatus | "">("");
  const [ordering, setOrdering] = useState("-created_datetime");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
      ordering,
      ...(kindFilter ? { kind: kindFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    }),
    [page, pageSize, ordering, kindFilter, statusFilter],
  );

  const { data, isLoading, isFetching, error, refetch } =
    useGetSupportRequestsQuery(params);
  const { open, inProgress, total, isLoading: isLoadingCounts } =
    useSupportRequestCounts();

  const requests = data?.data?.results ?? [];
  const paginator = data?.data?.paginator;
  const totalPages = paginator?.total_pages ?? 1;

  const openDetail = (id: string) => {
    router.push(adminSupportDetailRoute(id));
  };

  if (error) {
    const { message } = normalizeApiError(error as Parameters<typeof normalizeApiError>[0]);
    return (
      <EmptyState
        title="We couldn't load the support queue"
        description={message ?? undefined}
        actionLabel="Try again"
        onAction={() => void refetch()}
        icon={<CloseCircle size={24} variant="Linear" color="#FF5025" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[24px] font-medium leading-[32px] tracking-[-0.48px] text-[#202020]">
            Support requests
          </h1>
          <p className="text-[16px] font-normal leading-[24px] text-[#606060]">
            Tickets and appeals raised by creators and visitors.
          </p>
        </div>
        <Button
          type="button"
          variant="app-outline"
          size="app"
          leftIcon={
            <Refresh
              size={16}
              variant="Linear"
              color="#606060"
              className={isFetching ? "animate-spin" : ""}
            />
          }
          className="h-[40px] shrink-0 rounded-[8px] border-sd-grey-6 bg-white px-[16px] font-normal text-sd-grey-11"
          onClick={() => void refetch()}
        >
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-[16px]">
        <StatCard
          label="Open"
          value={isLoadingCounts ? "—" : String(open)}
          icon={<DirectInbox variant="Bold" size={20} color="#202020" />}
        />
        <StatCard
          label="In progress"
          value={isLoadingCounts ? "—" : String(inProgress)}
          icon={<Clock variant="Bold" size={20} color="#202020" />}
        />
        <StatCard
          label="All requests"
          value={isLoadingCounts ? "—" : String(total)}
          icon={<ClipboardText variant="Bold" size={20} color="#202020" />}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : (
        <>
          <BaseTable
            title="Support requests"
            showHeader={false}
            showPagination={false}
            selectable={false}
            emptyIcon={<DirectInbox size={24} variant="Linear" color="currentColor" />}
            emptyText="No support requests match these filters"
            columns={supportRequestColumns({ showRequester: true })}
            data={requests}
            filters={[
              {
                label: "Kind",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                options: KIND_OPTIONS,
                value: kindFilter,
                clearable: true,
                clearLabel: "All kinds",
                onValueChange: (val) => {
                  setKindFilter(val as SupportRequestKind);
                  setPage(1);
                },
              },
              {
                label: "Status",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                options: STATUS_OPTIONS,
                value: statusFilter,
                clearable: true,
                clearLabel: "All statuses",
                onValueChange: (val) => {
                  setStatusFilter(val as SupportRequestStatus);
                  setPage(1);
                },
              },
              {
                label: "Sort",
                icon: <Sort size={20} variant="Linear" color="#606060" />,
                options: SORT_OPTIONS,
                value: ordering,
                onValueChange: (val) => {
                  setOrdering(val);
                  setPage(1);
                },
              },
            ]}
            onRowClick={(row) => openDetail(row.id)}
          />

          {requests.length > 0 && (
            <Pagination
              pageIndex={page - 1}
              pageSize={pageSize}
              pageCount={totalPages}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              previousPage={() => setPage((p) => Math.max(1, p - 1))}
              nextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
              setPageIndex={(idx) => setPage(idx + 1)}
              setPageSize={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          )}
        </>
      )}
    </div>
  );
};
