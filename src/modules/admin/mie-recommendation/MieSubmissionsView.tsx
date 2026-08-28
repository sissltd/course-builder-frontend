"use client";

import React from "react";
import { endOfDay, startOfDay } from "date-fns";
import { toast } from "sonner";
import {
  CloseCircle,
  Danger,
  Filter,
  Profile2User,
  TickCircle,
  Timer1,
} from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Button } from "@/components/shared/Button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { TabBar } from "@/components/shared/TabBar";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { normalizeApiError } from "@/lib/api/errors";
import { MieWorkspaceHeader } from "./components/MieWorkspaceNav";
import { SubmissionDetailsDrawer } from "./components/SubmissionDetailsDrawer";
import { RejectSubmissionModal } from "./components/RejectSubmissionModal";
import { submissionColumns } from "./columns/submissions";
import {
  useApproveMieSubmissionMutation,
  useDebouncedValue,
  useGetMieDevelopersQuery,
  useGetMieSubmissionsQuery,
  useServerPagination,
  useSubmissionStatusCounts,
} from "./hooks";
import {
  duplicateStatuses,
  payoutBypassOptions,
  submissionStatusLabels,
} from "./utils/format";
import {
  SubmissionStatus,
  type MieSubmission,
  type MieSubmissionsListParams,
} from "./types";

/** `""` is the "everything" tab — it maps to sending no `status` at all. */
const TABS: { key: string; label: string }[] = [
  { key: "", label: "All" },
  ...Object.values(SubmissionStatus).map((status) => ({
    key: status,
    label: submissionStatusLabels[status],
  })),
];

export const MieSubmissionsView = () => {
  const { page, size, pagination, onPaginationChange, resetPage } =
    useServerPagination();

  const [activeStatus, setActiveStatus] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState("");
  const [payoutFilter, setPayoutFilter] = React.useState("");
  const [developerFilter, setDeveloperFilter] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const search = useDebouncedValue(searchInput);

  // Any filter change re-slices the result set, so page 2 of the old set is
  // meaningless — go back to the first page before the next request goes out.
  React.useEffect(() => {
    resetPage();
  }, [activeStatus, search, payoutFilter, developerFilter, selectedDate, resetPage]);

  const queryParams: MieSubmissionsListParams = {
    page,
    size,
    ordering: "-created_datetime",
    status: activeStatus as SubmissionStatus | "",
    search,
    developer: developerFilter,
    // Only send the flag when a choice is made — `false` is a real filter value,
    // so it cannot be folded into the empty case.
    ...(payoutFilter === "" ? {} : { payout_bypass: payoutFilter === "true" }),
    // The picker is a single day; the API takes a range, so bracket that day.
    ...(selectedDate
      ? {
          created_after: startOfDay(selectedDate).toISOString(),
          created_before: endOfDay(selectedDate).toISOString(),
        }
      : {}),
  };

  const {
    data: response,
    isLoading,
    error,
  } = useGetMieSubmissionsQuery(queryParams);

  const { counts, total, flaggedByDedup } = useSubmissionStatusCounts();

  // Powers the developer filter — emails are what an operator recognises.
  const { data: developersResponse } = useGetMieDevelopersQuery({
    size: 100,
    ordering: "email",
  });

  const [approveSubmission, { isLoading: isApproving }] =
    useApproveMieSubmissionMutation();

  // Memoised because the drawer's lookup below depends on it — a fresh `[]`
  // fallback on every render would defeat that memo.
  const submissions = React.useMemo(
    () => response?.data?.results ?? [],
    [response],
  );
  const paginator = response?.data?.paginator;
  const developers = developersResponse?.data?.results ?? [];

  const [selectedRow, setSelectedRow] = React.useState<MieSubmission | null>(
    null,
  );
  const [approveTarget, setApproveTarget] = React.useState<MieSubmission | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = React.useState<MieSubmission | null>(
    null,
  );

  // The drawer edits signals and payout in place, so it must read the refetched
  // row. The row clicked on is only the fallback, for when the active filters no
  // longer include it.
  const selected = React.useMemo(
    () =>
      selectedRow
        ? (submissions.find((row) => row.id === selectedRow.id) ?? selectedRow)
        : null,
    [submissions, selectedRow],
  );

  const confirmApprove = async () => {
    if (!approveTarget) return;

    try {
      const result = await approveSubmission({ id: approveTarget.id }).unwrap();
      toast.success(result.detail || "Submission approved");
      setApproveTarget(null);
      // The decision is made — close the drawer instead of leaving it showing a
      // row that the active tab may no longer contain.
      setSelectedRow(null);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to approve submission");
    }
  };

  const approveCopy = React.useMemo(() => {
    if (!approveTarget) return { title: "Approve submission", description: "" };

    const parts: string[] = [];

    if (approveTarget.status === SubmissionStatus.REJECTED) {
      parts.push(
        "This clears the rejection on record and re-links any course the idea already produced.",
      );
    } else if (duplicateStatuses.includes(approveTarget.status)) {
      parts.push(
        `The dedup engine flagged this as "${submissionStatusLabels[approveTarget.status]}". Approving overrides that call.`,
      );
    } else {
      parts.push("This accepts the idea into production.");
    }

    parts.push(
      approveTarget.payout_bypass
        ? "Payout is bypassed on this idea, so no wallet credit is issued."
        : "The developer is credited according to their plan.",
    );
    parts.push("Their webhook fires either way, and the decision is reversible.");

    return {
      title:
        approveTarget.status === SubmissionStatus.REJECTED
          ? "Re-approve submission"
          : "Approve submission",
      description: parts.join(" "),
    };
  }, [approveTarget]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-sd-grey-11">
          Failed to load MIE submissions. Please try again.
        </p>
        <Button
          variant="app-primary"
          onClick={() => window.location.reload()}
          className="h-[40px]"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] pb-[20px]">
      <MieWorkspaceHeader
        title="MIE submissions"
        subtitle="Course ideas sent in by external developers. Every decision is reversible and every decision notifies the developer."
      />

      {/* KPIs — whole-queue totals, independent of the filters below */}
      <div className="flex flex-wrap gap-[16px]">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Pending review"
          value={String(counts[SubmissionStatus.PENDING_REVIEW])}
          trend={`${total} submissions in total`}
        />
        <AdminStatCard
          icon={
            <Danger variant="Bold" size={20} color="var(--sd-warning-text)" />
          }
          label="Flagged by dedup"
          value={String(flaggedByDedup)}
          trend="Held on a title clash — override or reject"
          className={
            flaggedByDedup > 0
              ? "border-sd-warning-text/40 bg-sd-warning-bg"
              : undefined
          }
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#008500" />}
          label="Approved"
          value={String(counts[SubmissionStatus.APPROVED])}
          trend="Accepted into production"
        />
        <AdminStatCard
          icon={<CloseCircle variant="Bold" size={20} color="#D54800" />}
          label="Rejected"
          value={String(counts[SubmissionStatus.REJECTED])}
          trend="Declined with a reason on record"
        />
      </div>

      {/* Status tabs */}
      <TabBar
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label:
            tab.key === ""
              ? `All (${total})`
              : `${tab.label} (${counts[tab.key as SubmissionStatus]})`,
        }))}
        activeKey={activeStatus}
        onChange={setActiveStatus}
      />

      {/* Queue */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : (
        <BaseTable
          title="MIE submissions"
          columns={submissionColumns({
            onApprove: setApproveTarget,
            onReject: setRejectTarget,
          })}
          data={submissions}
          searchPlaceholder="Search title, reference, developer"
          onSearchChange={setSearchInput}
          onRowClick={setSelectedRow}
          ignoreRowClickColumns={["actions"]}
          selectable={false}
          emptyText={
            search || payoutFilter || developerFilter || selectedDate
              ? "No submissions match these filters"
              : activeStatus
                ? `No submissions are ${submissionStatusLabels[activeStatus as SubmissionStatus].toLowerCase()}`
                : "No submissions have arrived yet"
          }
          filters={[
            {
              label: "Developer",
              icon: <Profile2User size={20} variant="Linear" color="#606060" />,
              options: developers.map((developer) => ({
                label: developer.email,
                value: developer.id,
              })),
              value: developerFilter,
              onValueChange: setDeveloperFilter,
              searchable: true,
              searchPlaceholder: "Search developers",
              clearable: true,
              clearLabel: "All developers",
            },
            {
              label: "Payout",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              options: payoutBypassOptions,
              value: payoutFilter,
              onValueChange: setPayoutFilter,
              clearable: true,
              clearLabel: "Any payout state",
            },
          ]}
          showDateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          showPagination
          showHeader={false}
          // Filtering, sorting by arrival and paging all happen on the server —
          // the table renders exactly the page it is handed.
          tableOptions={{
            manualPagination: true,
            manualFiltering: true,
            pageCount: paginator?.total_pages ?? 1,
            state: { pagination },
            onPaginationChange,
          }}
        />
      )}

      <SubmissionDetailsDrawer
        isOpen={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelectedRow(null);
        }}
        submission={selected}
        onApprove={setApproveTarget}
        onReject={setRejectTarget}
        isApproving={isApproving}
      />

      <RejectSubmissionModal
        isOpen={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        submission={rejectTarget}
        onRejected={() => setSelectedRow(null)}
      />

      <ConfirmModal
        isOpen={!!approveTarget}
        onOpenChange={(open) => {
          if (!open) setApproveTarget(null);
        }}
        title={approveCopy.title}
        description={approveCopy.description}
        confirmLabel={
          approveTarget?.status === SubmissionStatus.REJECTED
            ? "Re-approve"
            : "Approve"
        }
        onConfirm={confirmApprove}
        isLoading={isApproving}
        icon={<TickCircle variant="Bold" size={24} color="#008500" />}
      />
    </div>
  );
};
