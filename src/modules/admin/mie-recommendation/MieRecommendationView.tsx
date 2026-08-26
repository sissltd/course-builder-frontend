"use client";

import React from "react";
import { toast } from "sonner";
import { Danger, MagicStar, Profile2User, Timer1 } from "iconsax-react";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { TabBar } from "@/components/shared/TabBar";
import {
  mieRecommendations,
  type MieRecommendation,
  type RecommendationStatus,
} from "./data/mockData";
import {
  countDuplicateRows,
  getClusterFor,
  groupDuplicates,
} from "./utils/duplicates";
import { MieRecommendationTable } from "./components/MieRecommendationTable";
import { RecommendationDetailsDrawer } from "./components/RecommendationDetailsDrawer";
import { DuplicateCompareDrawer } from "./components/DuplicateCompareDrawer";
import { sourceLabel } from "./components/SharedUI";

type TabKey = "all" | "pending" | "approved" | "rejected";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

type PendingAction =
  | { kind: "approve"; row: MieRecommendation; siblings: MieRecommendation[] }
  | { kind: "reject"; row: MieRecommendation }
  | { kind: "reject-all"; cluster: MieRecommendation[] }
  | { kind: "bulk-approve"; rows: MieRecommendation[]; conflicts: number };

const byOldestFirst = (a: MieRecommendation, b: MieRecommendation) =>
  new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();

export const MieRecommendationView = () => {
  const [rows, setRows] = React.useState<MieRecommendation[]>(mieRecommendations);
  const [activeTab, setActiveTab] = React.useState<TabKey>("pending");
  const [duplicatesOnly, setDuplicatesOnly] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("all");

  const [detailsIndex, setDetailsIndex] = React.useState(0);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [compareCluster, setCompareCluster] = React.useState<MieRecommendation[] | null>(null);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);

  /* ───────────────────────── Derived data ───────────────────────── */

  // Clusters are computed over pending rows only — once a clash is resolved the
  // remaining rows should stop being flagged.
  const clusters = React.useMemo(
    () => groupDuplicates(rows.filter((row) => row.status === "pending")),
    [rows],
  );

  const duplicateRowCount = React.useMemo(() => countDuplicateRows(clusters), [clusters]);

  const clusterSizeFor = React.useCallback(
    (row: MieRecommendation) => getClusterFor(row.id, clusters)?.length ?? 1,
    [clusters],
  );

  const isFirstIn = React.useCallback(
    (row: MieRecommendation) => getClusterFor(row.id, clusters)?.[0]?.id === row.id,
    [clusters],
  );

  const visibleRows = React.useMemo(() => {
    const filtered = rows.filter((row) => {
      if (activeTab !== "all" && row.status !== activeTab) return false;
      if (duplicatesOnly && clusterSizeFor(row) < 2) return false;
      if (categoryFilter && row.category !== categoryFilter) return false;
      if (difficultyFilter && row.difficultyLevel !== difficultyFilter) return false;
      if (sourceFilter !== "all" && row.source.kind !== sourceFilter) return false;
      return true;
    });

    // Oldest-first by default so whoever got there first surfaces at the top.
    // BaseTable controls its own sorting state, so the default has to live here.
    return [...filtered].sort(byOldestFirst);
  }, [
    rows,
    activeTab,
    duplicatesOnly,
    categoryFilter,
    difficultyFilter,
    sourceFilter,
    clusterSizeFor,
  ]);

  const stats = React.useMemo(() => {
    const pending = rows.filter((row) => row.status === "pending");
    const curatorRows = rows.filter((row) => row.source.kind === "curator");
    const activeCurators = new Set(
      curatorRows.map((row) => (row.source.kind === "curator" ? row.source.name : "")),
    );
    return {
      pending: pending.length,
      clusters: clusters.size,
      duplicateRows: duplicateRowCount,
      curator: curatorRows.length,
      activeCurators: activeCurators.size,
      ai: rows.filter((row) => row.source.kind === "ai").length,
    };
  }, [rows, clusters, duplicateRowCount]);

  /* ─────────────────────── Status transitions ────────────────────── */

  const applyStatuses = (
    updates: { id: string; status: RecommendationStatus; rejectedReason?: string }[],
  ) => {
    const byId = new Map(updates.map((update) => [update.id, update]));
    setRows((current) =>
      current.map((row) => {
        const update = byId.get(row.id);
        return update
          ? { ...row, status: update.status, rejectedReason: update.rejectedReason }
          : row;
      }),
    );
  };

  const approveWithSiblings = (row: MieRecommendation, siblings: MieRecommendation[]) => {
    const pendingSiblings = siblings.filter((sibling) => sibling.status === "pending");
    applyStatuses([
      { id: row.id, status: "approved" },
      ...pendingSiblings.map((sibling) => ({
        id: sibling.id,
        status: "rejected" as const,
        rejectedReason: `Duplicate of "${row.topic}" by ${sourceLabel(row.source)}`,
      })),
    ]);

    toast.success(
      pendingSiblings.length > 0
        ? `Approved "${row.topic}" — ${pendingSiblings.length} duplicate ${
            pendingSiblings.length === 1 ? "recommendation" : "recommendations"
          } rejected.`
        : `Approved "${row.topic}".`,
    );
  };

  /* ──────────────────────── Action requests ─────────────────────── */

  const requestApprove = (row: MieRecommendation) => {
    const cluster = getClusterFor(row.id, clusters);
    const siblings = cluster?.filter((sibling) => sibling.id !== row.id) ?? [];
    setPendingAction({ kind: "approve", row, siblings });
  };

  const requestReject = (row: MieRecommendation) => {
    setPendingAction({ kind: "reject", row });
  };

  const requestRejectAll = (cluster: MieRecommendation[]) => {
    setPendingAction({ kind: "reject-all", cluster });
  };

  const requestBulkApprove = (selected: MieRecommendation[]) => {
    if (selected.length === 0) return;

    // Two rows from the same cluster cannot both be approved — surface that first.
    const seenClusters = new Set<string>();
    let conflicts = 0;
    selected.forEach((row) => {
      const cluster = getClusterFor(row.id, clusters);
      if (!cluster) return;
      const key = cluster.map((entry) => entry.id).join("|");
      if (seenClusters.has(key)) conflicts += 1;
      else seenClusters.add(key);
    });

    setPendingAction({ kind: "bulk-approve", rows: selected, conflicts });
  };

  const openCompare = (row: MieRecommendation) => {
    const cluster = getClusterFor(row.id, clusters);
    if (!cluster) return;
    setCompareCluster(cluster);
    setCompareOpen(true);
  };

  const openDetails = (row: MieRecommendation) => {
    setDetailsIndex(visibleRows.findIndex((entry) => entry.id === row.id));
    setDetailsOpen(true);
  };

  /* ─────────────────────── Confirm modal copy ───────────────────── */

  const currentDetails = visibleRows[detailsIndex] ?? null;
  const detailsCluster = currentDetails ? getClusterFor(currentDetails.id, clusters) : null;

  // The compare drawer reads from live state so it reflects decisions immediately.
  const liveCompareCluster = React.useMemo(() => {
    if (!compareCluster) return null;
    const ids = new Set(compareCluster.map((row) => row.id));
    return rows.filter((row) => ids.has(row.id)).sort(byOldestFirst);
  }, [compareCluster, rows]);

  const confirmCopy = (): {
    title: string;
    description: string;
    confirmLabel: string;
    variant: "primary" | "danger";
  } | null => {
    if (!pendingAction) return null;

    switch (pendingAction.kind) {
      case "approve": {
        const { row, siblings } = pendingAction;
        const pendingSiblings = siblings.filter((sibling) => sibling.status === "pending");
        const isCurator = row.source.kind === "curator";
        const writeUp = isCurator
          ? ` This lets ${sourceLabel(row.source)} begin the full write-up.`
          : "";
        const dedupe =
          pendingSiblings.length > 0
            ? ` ${pendingSiblings.length} duplicate ${
                pendingSiblings.length === 1 ? "recommendation" : "recommendations"
              } will be rejected automatically.`
            : "";
        return {
          title: isCurator ? "Approve topic" : "Approve Recommendation",
          description: `Approve "${row.topic}".${writeUp}${dedupe}`,
          confirmLabel: isCurator ? "Approve topic" : "Approve",
          variant: "primary",
        };
      }
      case "reject":
        return {
          title: "Reject Recommendation",
          description: `Are you sure you want to reject "${pendingAction.row.topic}"?`,
          confirmLabel: "Reject",
          variant: "danger",
        };
      case "reject-all":
        return {
          title: "Reject all submissions",
          description: `This rejects all ${pendingAction.cluster.length} submissions for this topic. Nothing will be sent to production.`,
          confirmLabel: `Reject all ${pendingAction.cluster.length}`,
          variant: "danger",
        };
      case "bulk-approve":
        return {
          title: "Approve Recommendations",
          description:
            pendingAction.conflicts > 0
              ? `${pendingAction.conflicts} of the selected rows duplicate another selected row. Only the earliest submission in each clash will be approved; the rest will be rejected as duplicates.`
              : `Approve ${pendingAction.rows.length} selected ${
                  pendingAction.rows.length === 1 ? "recommendation" : "recommendations"
                }?`,
          confirmLabel: "Approve",
          variant: "primary",
        };
    }
  };

  const runPendingAction = () => {
    if (!pendingAction) return;

    switch (pendingAction.kind) {
      case "approve":
        approveWithSiblings(pendingAction.row, pendingAction.siblings);
        setCompareOpen(false);
        setDetailsOpen(false);
        break;

      case "reject":
        applyStatuses([{ id: pendingAction.row.id, status: "rejected" }]);
        toast.success(`Rejected "${pendingAction.row.topic}".`);
        setDetailsOpen(false);
        break;

      case "reject-all":
        applyStatuses(
          pendingAction.cluster.map((row) => ({ id: row.id, status: "rejected" as const })),
        );
        toast.success(`Rejected all ${pendingAction.cluster.length} submissions.`);
        setCompareOpen(false);
        break;

      case "bulk-approve": {
        // Within a clash, the earliest submission wins and the rest are rejected.
        const winners: MieRecommendation[] = [];
        const claimed = new Set<string>();

        [...pendingAction.rows].sort(byOldestFirst).forEach((row) => {
          const cluster = getClusterFor(row.id, clusters);
          const key = cluster ? cluster.map((entry) => entry.id).join("|") : row.id;
          if (claimed.has(key)) return;
          claimed.add(key);
          winners.push(row);
        });

        const updates = winners.flatMap((winner) => {
          const siblings =
            getClusterFor(winner.id, clusters)?.filter(
              (sibling) => sibling.id !== winner.id && sibling.status === "pending",
            ) ?? [];
          return [
            { id: winner.id, status: "approved" as const },
            ...siblings.map((sibling) => ({
              id: sibling.id,
              status: "rejected" as const,
              rejectedReason: `Duplicate of "${winner.topic}" by ${sourceLabel(winner.source)}`,
            })),
          ];
        });

        applyStatuses(updates);
        const rejected = updates.length - winners.length;
        toast.success(
          rejected > 0
            ? `Approved ${winners.length} — ${rejected} duplicate ${
                rejected === 1 ? "recommendation" : "recommendations"
              } rejected.`
            : `Approved ${winners.length} ${
                winners.length === 1 ? "recommendation" : "recommendations"
              }.`,
        );
        break;
      }
    }

    setPendingAction(null);
  };

  const copy = confirmCopy();

  return (
    <div className="flex flex-col gap-[24px]">
      {/* KPIs */}
      <div className="flex flex-wrap gap-[16px]">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Pending Review"
          value={String(stats.pending)}
          trend="Awaiting a decision"
        />
        <AdminStatCard
          icon={<Danger variant="Bold" size={20} color="var(--sd-warning-text)" />}
          label="Duplicate Clashes"
          value={String(stats.clusters)}
          trend={`${stats.duplicateRows} submissions affected`}
          className={
            stats.clusters > 0 ? "border-sd-warning-text/40 bg-sd-warning-bg" : undefined
          }
        />
        <AdminStatCard
          icon={<Profile2User variant="Bold" size={20} color="#202020" />}
          label="From Curators"
          value={String(stats.curator)}
          trend={`${stats.activeCurators} active curators`}
        />
        <AdminStatCard
          icon={<MagicStar variant="Bold" size={20} color="var(--sd-blue)" />}
          label="From AI Engine"
          value={String(stats.ai)}
          trend="Sourced from demand signals"
        />
      </div>

      {/* Tabs */}
      <TabBar
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label:
            tab.key === "all"
              ? `All (${rows.length})`
              : `${tab.label} (${rows.filter((row) => row.status === tab.key).length})`,
        }))}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {/* Table */}
      <MieRecommendationTable
        rows={visibleRows}
        clusterSizeFor={clusterSizeFor}
        isFirstIn={isFirstIn}
        showStatus={activeTab === "all"}
        duplicatesOnly={duplicatesOnly}
        duplicateCount={stats.duplicateRows}
        onToggleDuplicatesOnly={() => setDuplicatesOnly((value) => !value)}
        onCategoryChange={setCategoryFilter}
        onDifficultyChange={setDifficultyFilter}
        onSourceChange={setSourceFilter}
        onCompare={openCompare}
        onApprove={requestApprove}
        onReject={requestReject}
        onBulkApprove={requestBulkApprove}
        onRowClick={openDetails}
      />

      {/* Details drawer */}
      <RecommendationDetailsDrawer
        isOpen={detailsOpen}
        onOpenChange={setDetailsOpen}
        recommendation={currentDetails}
        cluster={detailsCluster}
        onCompare={() => {
          if (!currentDetails) return;
          setDetailsOpen(false);
          openCompare(currentDetails);
        }}
        onApprove={requestApprove}
        onReject={requestReject}
        onPrevious={() => setDetailsIndex((index) => Math.max(0, index - 1))}
        onNext={() =>
          setDetailsIndex((index) => Math.min(visibleRows.length - 1, index + 1))
        }
        hasPrevious={detailsIndex > 0}
        hasNext={detailsIndex < visibleRows.length - 1}
      />

      {/* Compare drawer */}
      <DuplicateCompareDrawer
        isOpen={compareOpen}
        onOpenChange={setCompareOpen}
        cluster={liveCompareCluster}
        onApprove={(row, siblings) => setPendingAction({ kind: "approve", row, siblings })}
        onReject={requestReject}
        onRejectAll={requestRejectAll}
      />

      {/* Confirmation */}
      {copy && (
        <ConfirmModal
          isOpen={!!pendingAction}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null);
          }}
          title={copy.title}
          description={copy.description}
          confirmLabel={copy.confirmLabel}
          variant={copy.variant}
          onConfirm={runPendingAction}
        />
      )}
    </div>
  );
};
