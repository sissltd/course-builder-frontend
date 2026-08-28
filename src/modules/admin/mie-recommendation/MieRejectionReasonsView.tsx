"use client";

import React from "react";
import { toast } from "sonner";
import { Add, CloseCircle, MessageQuestion, TickCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Button } from "@/components/shared/Button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { TabBar } from "@/components/shared/TabBar";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { normalizeApiError } from "@/lib/api/errors";
import { MieWorkspaceHeader } from "./components/MieWorkspaceNav";
import { RejectionReasonModal } from "./components/RejectionReasonModal";
import { Callout } from "./components/SharedUI";
import { rejectionReasonColumns } from "./columns/rejection-reasons";
import {
  useGetMieRejectionReasonsQuery,
  useServerPagination,
  useUpdateMieRejectionReasonMutation,
} from "./hooks";
import type {
  MieRejectionReason,
  MieRejectionReasonsListParams,
} from "./types";

type TabKey = "" | "active" | "inactive";

const TABS: { key: TabKey; label: string }[] = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

/** `""` means send no `is_active` filter at all. */
const isActiveFor = (tab: TabKey) =>
  tab === "" ? undefined : tab === "active";

export const MieRejectionReasonsView = () => {
  const { page, size, pagination, onPaginationChange, resetPage } =
    useServerPagination();

  const [activeTab, setActiveTab] = React.useState<TabKey>("");

  React.useEffect(() => {
    resetPage();
  }, [activeTab, resetPage]);

  const queryParams: MieRejectionReasonsListParams = {
    page,
    size,
    ordering: "label",
    is_active: isActiveFor(activeTab),
  };

  const {
    data: response,
    isLoading,
    error,
  } = useGetMieRejectionReasonsQuery(queryParams);

  // Tab labels and KPIs come from `size: 1` pages, the same way the other two
  // MIE surfaces count — there is no aggregate endpoint.
  const { data: activeCountResponse } = useGetMieRejectionReasonsQuery({
    size: 1,
    is_active: true,
  });
  const { data: inactiveCountResponse } = useGetMieRejectionReasonsQuery({
    size: 1,
    is_active: false,
  });

  const [updateReason] = useUpdateMieRejectionReasonMutation();

  const reasons = response?.data?.results ?? [];
  const paginator = response?.data?.paginator;

  const activeCount = activeCountResponse?.data?.paginator?.count ?? 0;
  const inactiveCount = inactiveCountResponse?.data?.paginator?.count ?? 0;
  const total = activeCount + inactiveCount;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MieRejectionReason | null>(null);
  const [toggleTarget, setToggleTarget] =
    React.useState<MieRejectionReason | null>(null);
  const [isToggling, setIsToggling] = React.useState(false);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (reason: MieRejectionReason) => {
    setEditing(reason);
    setIsModalOpen(true);
  };

  const confirmToggle = async () => {
    if (!toggleTarget) return;
    const nextActive = !toggleTarget.is_active;

    setIsToggling(true);
    try {
      await updateReason({
        id: toggleTarget.id,
        // The API has no delete — `is_active` is the whole retirement mechanism.
        body: { is_active: nextActive },
      }).unwrap();
      toast.success(nextActive ? "Reason reactivated" : "Reason deactivated");
      setToggleTarget(null);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to update rejection reason");
    } finally {
      setIsToggling(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-sd-grey-11">
          Failed to load rejection reasons. Please try again.
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
        title="Rejection reasons"
        subtitle="The taxonomy every submission rejection draws from. Reviewers can only pick an active reason, and the wording reaches the developer verbatim."
        action={
          <Button
            variant="app-primary"
            leftIcon={<Add size={20} variant="Linear" color="#FFF" />}
            className="h-[40px] px-[16px] text-[14px] font-medium"
            onClick={openCreate}
          >
            Add reason
          </Button>
        }
      />

      {/* KPIs */}
      <div className="flex flex-wrap gap-[16px]">
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#008500" />}
          label="Active reasons"
          value={String(activeCount)}
          trend="Selectable when rejecting"
        />
        <AdminStatCard
          icon={
            <MessageQuestion variant="Bold" size={20} color="var(--sd-grey-11)" />
          }
          label="Retired reasons"
          value={String(inactiveCount)}
          trend="Kept on past rejections only"
        />
        <AdminStatCard
          icon={<MessageQuestion variant="Bold" size={20} color="#202020" />}
          label="Taxonomy size"
          value={String(total)}
          trend="Every reason ever defined"
        />
      </div>

      {/* No active reason means no submission can be rejected at all. */}
      {!isLoading && activeCount === 0 && (
        <Callout tone="danger">
          There are no active rejection reasons, so reviewers cannot reject
          anything. Add one — or reactivate a retired one — before working the
          submissions queue.
        </Callout>
      )}

      <TabBar
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label:
            tab.key === ""
              ? `All (${total})`
              : tab.key === "active"
                ? `Active (${activeCount})`
                : `Inactive (${inactiveCount})`,
        }))}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : (
        <BaseTable
          title="Rejection reasons"
          columns={rejectionReasonColumns({
            onEdit: openEdit,
            onToggleActive: setToggleTarget,
          })}
          data={reasons}
          // The list endpoint takes no `search` param, so no search box is shown
          // rather than one that would only filter the page on screen.
          searchPlaceholder=""
          onRowClick={openEdit}
          ignoreRowClickColumns={["actions"]}
          selectable={false}
          emptyIcon={
            <MessageQuestion size={24} variant="Linear" color="currentColor" />
          }
          emptyText={
            activeTab === "inactive"
              ? "No reasons have been retired"
              : activeTab === "active"
                ? "No active reasons yet"
                : "No rejection reasons defined yet"
          }
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

      <RejectionReasonModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditing(null);
        }}
        reason={editing}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null);
        }}
        title={
          toggleTarget?.is_active ? "Retire this reason?" : "Reactivate reason?"
        }
        description={
          toggleTarget?.is_active
            ? `"${toggleTarget?.label}" will no longer be selectable when rejecting a submission. Rejections that already use it keep it — nothing is deleted.`
            : `"${toggleTarget?.label}" becomes selectable again when rejecting a submission.`
        }
        confirmLabel={toggleTarget?.is_active ? "Retire reason" : "Reactivate"}
        variant={toggleTarget?.is_active ? "danger" : "primary"}
        onConfirm={confirmToggle}
        isLoading={isToggling}
      />
    </div>
  );
};
