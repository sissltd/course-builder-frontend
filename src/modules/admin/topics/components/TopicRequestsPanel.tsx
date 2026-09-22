"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { TabBar, TabBarItem } from "@/components/shared/TabBar";
import { Button as AppButton } from "@/components/shared/Button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useApproveTopicRequestMutation,
  useGetTopicRequestsQuery,
  useRejectTopicRequestMutation,
  type TopicRequest,
  type TopicRequestsParams,
} from "../api/topicRequestsApi";
import { formatCategoryDate } from "@/modules/categories/lib/format";
import { RejectTopicRequestModal } from "./RejectTopicRequestModal";

type RequestTabKey = "all" | "PENDING" | "APPROVED" | "REJECTED";

const tabs: TabBarItem[] = [
  { key: "all", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

const STATUS_CHIP_STYLES: Record<string, string> = {
  PENDING: "bg-[var(--sd-warning-bg)] text-[var(--sd-warning-text)]",
  APPROVED: "bg-[var(--sd-success-bg)] text-[var(--sd-success-text)]",
  REJECTED: "bg-[var(--sd-danger-soft)] text-[var(--sd-danger)]",
};

const StatusChip = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-[8px] px-[8px] py-[3px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] ${
      STATUS_CHIP_STYLES[status] ?? "bg-sd-grey-3 text-sd-grey-11"
    }`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

const requesterName = (request: TopicRequest) => {
  const name =
    `${request.requested_by.first_name} ${request.requested_by.last_name}`.trim();
  return name || request.requested_by.email;
};

/**
 * The topic-request queue on `/admin/topic-requests/`.
 *
 * Only Pending requests carry actions — the endpoint approves a request into a
 * topic and reserves it, so offering that on an already-decided request would be
 * meaningless. Unlike the topic table, this endpoint does support `search`, so
 * the search box drives the query rather than filtering the loaded page.
 */
export const TopicRequestsPanel = () => {
  const [activeTab, setActiveTab] = useState<RequestTabKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [approving, setApproving] = useState<TopicRequest | null>(null);
  const [rejecting, setRejecting] = useState<TopicRequest | null>(null);

  const queryParams = useMemo<TopicRequestsParams>(
    () => ({
      ...(activeTab !== "all" ? { status: activeTab } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      ordering: "-created_datetime",
      page,
      // Note `page_size`, not `size` — this endpoint names it differently to
      // `/topics/`.
      page_size: pageSize,
    }),
    [activeTab, search, page, pageSize],
  );

  const { data, isLoading } = useGetTopicRequestsQuery(queryParams);
  const [approveRequest, { isLoading: isApproving }] =
    useApproveTopicRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectTopicRequestMutation();

  const requests = useMemo(() => data?.data?.results ?? [], [data]);
  const totalPages = data?.data?.paginator?.total_pages ?? 1;

  const handleApprove = async () => {
    if (!approving) return;
    try {
      await approveRequest(approving.id).unwrap();
      toast.success("Request approved — topic created and reserved");
      setApproving(null);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not approve the request");
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejecting) return;
    try {
      await rejectRequest({
        id: rejecting.id,
        rejection_reason: reason || undefined,
      }).unwrap();
      toast.success("Request rejected");
      setRejecting(null);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not reject the request");
    }
  };

  const columns: ColumnDef<TopicRequest>[] = [
    {
      accessorKey: "name",
      header: "Requested topic",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.name}
        </span>
      ),
      size: 220,
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.category?.name ?? "—"}
        </span>
      ),
      size: 180,
    },
    {
      id: "requested_by",
      header: "Requested by",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
            {requesterName(row.original)}
          </span>
          <span className="text-[12px] font-normal text-sd-grey-9 leading-[18px]">
            {row.original.requested_by.email}
          </span>
        </div>
      ),
      size: 220,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-[2px]">
          <StatusChip status={row.original.status} />
          {row.original.status === "REJECTED" &&
            row.original.rejection_reason && (
              <span
                className="max-w-[200px] truncate text-[12px] text-sd-grey-9"
                title={row.original.rejection_reason}
              >
                {row.original.rejection_reason}
              </span>
            )}
        </div>
      ),
      size: 200,
    },
    {
      // Null until approval — the topic does not exist before then.
      id: "topic",
      header: "Topic created",
      cell: ({ row }) =>
        row.original.topic ? (
          <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
            Yes
          </span>
        ) : (
          <span className="text-[14px] font-normal text-sd-grey-9 tracking-[-0.28px] leading-[20px]">
            —
          </span>
        ),
      size: 120,
    },
    {
      accessorKey: "created_datetime",
      header: "Requested",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {formatCategoryDate(row.original.created_datetime)}
        </span>
      ),
      size: 200,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) =>
        row.original.status === "PENDING" ? (
          <div className="flex items-center gap-[8px]">
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              className="h-[32px] rounded-[8px] border-sd-grey-4 px-[12px] text-[13px] font-normal text-sd-grey-12"
              onClick={(event) => {
                event.stopPropagation();
                setApproving(row.original);
              }}
            >
              Approve
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              className="h-[32px] rounded-[8px] px-[12px] text-[13px] font-normal text-[var(--sd-danger)] hover:bg-[var(--sd-danger-soft)]"
              onClick={(event) => {
                event.stopPropagation();
                setRejecting(row.original);
              }}
            >
              Reject
            </AppButton>
          </div>
        ) : (
          <span className="text-[13px] text-sd-grey-9">Decided</span>
        ),
      size: 180,
    },
  ];

  return (
    <>
      <ConfirmModal
        key={approving?.id ?? "approve-request"}
        isOpen={!!approving}
        onOpenChange={(open) => {
          if (!open && isApproving) return;
          if (!open) setApproving(null);
        }}
        title="Approve topic request"
        description={
          approving
            ? `Approving “${approving.name}” creates it as a topic under ${approving.category?.name ?? "its category"} and reserves it for ${requesterName(approving)}. No price is set here — the new topic inherits the category's beginner creator price, so reprice it from the Topics tab if that is not right.`
            : undefined
        }
        confirmLabel={isApproving ? "Approving..." : "Approve request"}
        cancelLabel="Cancel"
        isLoading={isApproving}
        onConfirm={handleApprove}
      />
      <RejectTopicRequestModal
        key={rejecting?.id ?? "reject-request"}
        isOpen={!!rejecting}
        onOpenChange={(open) => {
          if (!open) setRejecting(null);
        }}
        requestName={rejecting?.name}
        isLoading={isRejecting}
        onConfirm={handleReject}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          <BaseTable
            title="Topic requests"
            columns={columns}
            data={requests}
            className="border-none bg-transparent p-0 shadow-none rounded-none gap-[18px]"
            toolbarClassName="gap-0"
            contentClassName="rounded-[12px] overflow-hidden"
            headerRowClassName="border-none bg-[var(--sd-grey-16)] hover:bg-[var(--sd-grey-16)]"
            headerCellClassName="h-[40px] bg-[var(--sd-grey-16)] px-[12px] text-[14px] font-normal text-[var(--sd-grey-14)] leading-[20px] tracking-[-0.28px]"
            rowClassName="h-[48px] bg-transparent hover:bg-transparent"
            cellClassName="px-[12px] py-[12px]"
            showHeader={false}
            searchPlaceholder="Search requests"
            // This endpoint does have a `search` param, so the box drives the query.
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            showPagination={false}
            tableOptions={{ state: { pagination: { pageIndex: 0, pageSize } } }}
            ignoreRowClickColumns={["actions"]}
            emptyText="No topic requests found"
            topContent={
              <TabBar
                tabs={tabs}
                activeKey={activeTab}
                onChange={(key) => {
                  setActiveTab(key as RequestTabKey);
                  setPage(1);
                }}
                className="border-sd-grey-6"
                tabClassName="h-[38px] px-[14px] text-[14px] font-normal leading-[20px]"
                activeTabClassName="text-sd-grey-12"
                inactiveTabClassName="text-sd-grey-8"
                indicatorClassName="h-[2px] bg-sd-grey-12"
              />
            }
          />

          {requests.length > 0 && (
            <Pagination
              pageIndex={page - 1}
              pageSize={pageSize}
              pageCount={totalPages}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              previousPage={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              nextPage={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              setPageIndex={(index) => setPage(index + 1)}
              setPageSize={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          )}
        </div>
      )}
    </>
  );
};
