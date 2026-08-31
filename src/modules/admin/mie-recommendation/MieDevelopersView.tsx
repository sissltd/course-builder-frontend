"use client";

import React from "react";
import { toast } from "sonner";
import {
  Add,
  CloseCircle,
  Filter,
  PauseCircle,
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
import { OnboardDeveloperModal } from "./components/OnboardDeveloperModal";
import { ApiKeyRevealModal } from "./components/ApiKeyRevealModal";
import { DeveloperDetailsDrawer } from "./components/DeveloperDetailsDrawer";
import { developerColumns } from "./columns/developers";
import {
  useApproveMieDeveloperMutation,
  useDebouncedValue,
  useDeveloperStatusCounts,
  useGetMieDevelopersQuery,
  useRejectMieDeveloperMutation,
  useServerPagination,
  useSuspendMieDeveloperMutation,
} from "./hooks";
import { developerStatusLabels, planTypeOptions } from "./utils/format";
import {
  DeveloperAccountStatus,
  type DeveloperApprovalResponse,
  type MieDeveloper,
  type MieDevelopersListParams,
} from "./types";

/** `""` is the "everything" tab — it maps to sending no `status` at all. */
const TABS: { key: string; label: string }[] = [
  { key: "", label: "All" },
  ...Object.values(DeveloperAccountStatus).map((status) => ({
    key: status,
    label: developerStatusLabels[status],
  })),
];

type PendingAction = { kind: "reject" | "suspend"; developer: MieDeveloper };

export const MieDevelopersView = () => {
  const { page, size, pagination, onPaginationChange, resetPage } =
    useServerPagination();

  const [activeStatus, setActiveStatus] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState("");
  const [planFilter, setPlanFilter] = React.useState("");

  const search = useDebouncedValue(searchInput);

  React.useEffect(() => {
    resetPage();
  }, [activeStatus, search, planFilter, resetPage]);

  const queryParams: MieDevelopersListParams = {
    page,
    size,
    ordering: "-created_datetime",
    status: activeStatus as DeveloperAccountStatus | "",
    plan_type: planFilter as MieDevelopersListParams["plan_type"],
    search,
  };

  const {
    data: response,
    isLoading,
    error,
  } = useGetMieDevelopersQuery(queryParams);

  const { counts, total } = useDeveloperStatusCounts();

  const [approveDeveloper, { isLoading: isApproving }] =
    useApproveMieDeveloperMutation();
  const [rejectDeveloper, { isLoading: isRejecting }] =
    useRejectMieDeveloperMutation();
  const [suspendDeveloper, { isLoading: isSuspending }] =
    useSuspendMieDeveloperMutation();

  // Memoised because the drawer's lookup below depends on it — a fresh `[]`
  // fallback on every render would defeat that memo.
  const developers = React.useMemo(
    () => response?.data?.results ?? [],
    [response],
  );
  const paginator = response?.data?.paginator;

  const [isOnboardOpen, setIsOnboardOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<MieDeveloper | null>(
    null,
  );
  const [approveTarget, setApproveTarget] = React.useState<MieDeveloper | null>(
    null,
  );
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(
    null,
  );
  /** Holds the approval response so the one-time key can be revealed. */
  const [approval, setApproval] =
    React.useState<DeveloperApprovalResponse | null>(null);

  // The drawer shows live credential state, so it reads the refetched row and
  // falls back to the clicked row only when the filters exclude it.
  const selected = React.useMemo(
    () =>
      selectedRow
        ? (developers.find((row) => row.id === selectedRow.id) ?? selectedRow)
        : null,
    [developers, selectedRow],
  );

  const confirmApprove = async () => {
    if (!approveTarget) return;

    try {
      const result = await approveDeveloper(approveTarget.id).unwrap();
      setApproveTarget(null);
      setSelectedRow(null);
      // The full key lives only in this response — hand it straight to the modal
      // instead of toasting, so it cannot scroll away before it is copied.
      setApproval(result);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to approve developer");
    }
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    const { kind, developer } = pendingAction;

    try {
      const result =
        kind === "reject"
          ? await rejectDeveloper(developer.id).unwrap()
          : await suspendDeveloper(developer.id).unwrap();

      toast.success(
        result.detail ||
          (kind === "reject" ? "Developer rejected" : "Developer suspended"),
      );
      setPendingAction(null);
      setSelectedRow(null);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(
        message ??
          (kind === "reject"
            ? "Failed to reject developer"
            : "Failed to suspend developer"),
      );
    }
  };

  const approveCopy = React.useMemo(() => {
    switch (approveTarget?.status) {
      case DeveloperAccountStatus.SUSPENDED:
        return {
          title: "Reactivate developer",
          description:
            "The suspension is lifted and the developer's existing API key starts working again. No new key is issued, so nothing needs resending.",
          confirmLabel: "Reactivate",
        };
      case DeveloperAccountStatus.REJECTED:
        return {
          title: "Reactivate developer",
          description:
            "This account was rejected, so its old key no longer exists. Approving issues a brand-new key, shown once on the next screen — copy it then, because nothing can retrieve it afterwards.",
          confirmLabel: "Reactivate",
        };
      default:
        return {
          title: "Approve developer",
          description:
            "Approving issues the API key that lets this developer submit ideas. It is shown once on the next screen — copy it then, because nothing can retrieve it afterwards.",
          confirmLabel: "Approve",
        };
    }
  }, [approveTarget]);

  const actionCopy = React.useMemo(() => {
    if (!pendingAction) return null;

    if (pendingAction.kind === "reject") {
      return {
        title: "Reject developer",
        description:
          "Submissions from this account are refused and the current API key stops working. Approving later issues a new key — the old one cannot be restored.",
        confirmLabel: "Reject developer",
        icon: <CloseCircle variant="Bold" size={24} color="#D54800" />,
      };
    }

    return {
      title: "Suspend developer",
      description:
        "Submissions are blocked immediately, but the key is kept intact. Reactivating restores access without resending anything.",
      confirmLabel: "Suspend developer",
      icon: (
        <PauseCircle variant="Bold" size={24} color="var(--sd-warning-text)" />
      ),
    };
  }, [pendingAction]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-sd-grey-11">
          Failed to load MIE developers. Please try again.
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
        title="MIE developers"
        subtitle="External developers who send in course ideas. Approving an account is what issues its API key."
        action={
          <Button
            variant="app-primary"
            leftIcon={<Add size={20} variant="Linear" color="#FFF" />}
            className="h-[40px] px-[16px] text-[14px] font-medium"
            onClick={() => setIsOnboardOpen(true)}
          >
            Onboard developer
          </Button>
        }
      />

      {/* KPIs — whole-directory totals, independent of the filters below */}
      <div className="flex flex-wrap gap-[16px]">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Awaiting approval"
          value={String(counts[DeveloperAccountStatus.PENDING])}
          trend={`${total} ${total === 1 ? "account" : "accounts"} registered`}
          className={
            counts[DeveloperAccountStatus.PENDING] > 0
              ? "border-sd-warning-text/40 bg-sd-warning-bg"
              : undefined
          }
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#008500" />}
          label="Active"
          value={String(counts[DeveloperAccountStatus.APPROVED])}
          trend="Holding a working API key"
        />
        <AdminStatCard
          icon={
            <PauseCircle
              variant="Bold"
              size={20}
              color="var(--sd-warning-text)"
            />
          }
          label="Suspended"
          value={String(counts[DeveloperAccountStatus.SUSPENDED])}
          trend="Blocked, key retained"
        />
        <AdminStatCard
          icon={<CloseCircle variant="Bold" size={20} color="#D54800" />}
          label="Rejected"
          value={String(counts[DeveloperAccountStatus.REJECTED])}
          trend="Blocked, key destroyed"
        />
      </div>

      {/* Status tabs */}
      <TabBar
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label:
            tab.key === ""
              ? `All (${total})`
              : `${tab.label} (${counts[tab.key as DeveloperAccountStatus]})`,
        }))}
        activeKey={activeStatus}
        onChange={setActiveStatus}
      />

      {/* Directory */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : (
        <BaseTable
          title="MIE developers"
          columns={developerColumns({
            onApprove: setApproveTarget,
            onReject: (developer) =>
              setPendingAction({ kind: "reject", developer }),
            onSuspend: (developer) =>
              setPendingAction({ kind: "suspend", developer }),
          })}
          data={developers}
          searchPlaceholder="Search email, webhook"
          onSearchChange={setSearchInput}
          onRowClick={setSelectedRow}
          ignoreRowClickColumns={["actions", "api_key_preview"]}
          selectable={false}
          emptyIcon={
            <Profile2User size={24} variant="Linear" color="currentColor" />
          }
          emptyText={
            search || planFilter
              ? "No developers match these filters"
              : activeStatus
                ? `No accounts are ${developerStatusLabels[activeStatus as DeveloperAccountStatus].toLowerCase()}`
                : "No developers have registered yet"
          }
          filters={[
            {
              label: "Payout plan",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              options: planTypeOptions,
              value: planFilter,
              onValueChange: setPlanFilter,
              clearable: true,
              clearLabel: "All plans",
            },
          ]}
          showPagination
          showHeader={false}
          tableOptions={{
            manualPagination: true,
            manualFiltering: true,
            pageCount: paginator?.total_pages ?? 1,
            state: { pagination },
            onPaginationChange,
          }}
        />
      )}

      <DeveloperDetailsDrawer
        isOpen={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelectedRow(null);
        }}
        developer={selected}
        onApprove={setApproveTarget}
        onReject={(developer) => setPendingAction({ kind: "reject", developer })}
        onSuspend={(developer) =>
          setPendingAction({ kind: "suspend", developer })
        }
        isApproving={isApproving}
      />

      <OnboardDeveloperModal
        isOpen={isOnboardOpen}
        onOpenChange={setIsOnboardOpen}
        // Registration only creates a PENDING account, so offer the approval that
        // actually issues the key rather than making the operator hunt the row.
        onCreated={setApproveTarget}
      />

      <ApiKeyRevealModal
        isOpen={!!approval}
        onOpenChange={(open) => {
          if (!open) setApproval(null);
        }}
        approval={approval}
      />

      <ConfirmModal
        isOpen={!!approveTarget}
        onOpenChange={(open) => {
          if (!open) setApproveTarget(null);
        }}
        title={approveCopy.title}
        description={`${approveTarget?.email ?? ""} — ${approveCopy.description}`}
        confirmLabel={approveCopy.confirmLabel}
        onConfirm={confirmApprove}
        isLoading={isApproving}
        icon={<TickCircle variant="Bold" size={24} color="#008500" />}
      />

      {actionCopy && (
        <ConfirmModal
          isOpen={!!pendingAction}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null);
          }}
          title={actionCopy.title}
          description={`${pendingAction?.developer.email ?? ""} — ${actionCopy.description}`}
          confirmLabel={actionCopy.confirmLabel}
          variant="danger"
          onConfirm={confirmPendingAction}
          isLoading={isRejecting || isSuspending}
          icon={actionCopy.icon}
        />
      )}
    </div>
  );
};
