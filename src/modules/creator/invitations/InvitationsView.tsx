"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UserAdd, Sort, CloseCircle } from "iconsax-react";

import { BaseTable } from "@/components/shared/BaseTable";
import { Button } from "@/components/shared/Button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { CreatorRoute } from "@/lib/routes";
import {
  WorkspaceCollaborator,
  WorkspaceCollaboratorRole,
  WorkspaceCollaboratorStatus,
} from "../collaborators/types";
import {
  useGetWorkspaceCollaboratorsQuery,
  useRemoveWorkspaceCollaboratorMutation,
} from "../collaborators/hooks";
import { buildInvitationColumns } from "./columns/invitations";
import {
  ChangeRoleModal,
  InviteCollaboratorModal,
} from "./components/InviteCollaboratorModal";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  getCollaboratorDisplayName,
} from "./utils/format";
import {
  announceRemovalFailure,
  findInvitationById,
} from "./utils/pendingInvitation";
import {
  clearPendingInvitation,
  resolvePendingInviteId,
  savePendingInvitation,
} from "@/modules/auth/utils/pendingInvitation";

const PAGE_SIZE = 10;

export const InvitationsView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<WorkspaceCollaboratorRole | "">(
    "",
  );
  const [statusFilter, setStatusFilter] = useState<
    WorkspaceCollaboratorStatus | "ALL" | ""
  >("");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<WorkspaceCollaborator | null>(
    null,
  );
  const [roleTarget, setRoleTarget] = useState<WorkspaceCollaborator | null>(
    null,
  );

  const inviteIdParam = searchParams.get("invite_id");
  const inviteId = resolvePendingInviteId(inviteIdParam);

  // Hold the id locally so it survives the trip through signup.
  useEffect(() => {
    if (inviteIdParam?.trim()) {
      savePendingInvitation(inviteIdParam.trim());
    }
  }, [inviteIdParam]);

  const [removeCollaborator, { isLoading: isRemoving }] =
    useRemoveWorkspaceCollaboratorMutation();

  const { data, isLoading, isFetching, error, refetch } =
    useGetWorkspaceCollaboratorsQuery({
      page,
      size: PAGE_SIZE,
      ...(search ? { search } : {}),
      ...(roleFilter ? { role: roleFilter } : {}),
      // The roster hides REMOVED by default, so "All" means "everything the
      // backend is willing to show", not "pass no filter".
      ...(statusFilter ? { status: statusFilter as WorkspaceCollaboratorStatus } : {}),
    });

  const rows = useMemo(() => data?.data?.results ?? [], [data]);
  const paginator = data?.data?.paginator;

  const focusedInvitation = useMemo(
    () => (inviteId ? findInvitationById(rows, inviteId) : undefined),
    [rows, inviteId],
  );

  const handleRemove = useCallback(async () => {
    if (!removeTarget) return;
    const display = getCollaboratorDisplayName(removeTarget);
    try {
      await removeCollaborator(removeTarget.id).unwrap();
      toast.success(`${display} was removed from your workspace.`);
      if (inviteId === removeTarget.id) clearPendingInvitation();
      setRemoveTarget(null);
    } catch (err) {
      announceRemovalFailure(err);
    }
  }, [removeTarget, removeCollaborator, inviteId]);

  const columns = useMemo(
    () =>
      buildInvitationColumns({
        onRemove: (collaborator) => setRemoveTarget(collaborator),
        onChangeRole: (collaborator) => setRoleTarget(collaborator),
        removingId: removeTarget?.id,
      }),
    [removeTarget?.id],
  );

  const inviteBanner = useMemo(() => {
    if (!inviteId) return null;

    if (isLoading) {
      return (
        <div className="flex items-center gap-[10px] rounded-[12px] border border-[#D0E2FF] bg-[#F5F8FF] px-[16px] py-[14px]">
          <span className="size-4 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
          <p className="text-[14px] text-[#606060]">
            Looking up this invitation...
          </p>
        </div>
      );
    }

    if (!focusedInvitation) {
      return (
        <div className="flex flex-col gap-[8px] rounded-[12px] border border-[#FECACA] bg-[#FFFBFA] px-[16px] py-[14px]">
          <p className="text-[14px] font-semibold text-[#B42318]">
            This invitation is not available
          </p>
          <p className="text-[14px] leading-[20px] text-[#606060]">
            It may have been accepted, removed, or it belongs to another
            workspace. Ask the person who invited you to send a fresh link.
          </p>
          <div className="flex gap-[12px] pt-[4px]">
            <Button
              variant="app-outline"
              className="h-[40px] px-[20px] text-[14px]"
              onClick={() => router.push(CreatorRoute.COLLABORATORS)}
            >
              Go to collaborators
            </Button>
            <Button
              variant="app-outline"
              className="h-[40px] px-[20px] text-[14px]"
              onClick={() => {
                clearPendingInvitation();
                router.replace(CreatorRoute.INVITATIONS);
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
      );
    }

    const display = getCollaboratorDisplayName(focusedInvitation);
    return (
      <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#D0E2FF] bg-[#F5F8FF] px-[16px] py-[14px]">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[12px] font-medium uppercase tracking-wider text-[#0063EF]">
            Opened invitation
          </span>
          <span className="text-[16px] font-semibold text-[#202020]">
            {display}
          </span>
          <span className="text-[14px] leading-[20px] text-[#606060]">
            {focusedInvitation.role_label ||
              ROLE_LABELS[focusedInvitation.role]}{" "}
            ·{" "}
            {STATUS_LABELS[focusedInvitation.status] ??
              focusedInvitation.status}
          </span>
        </div>
        {focusedInvitation.status === WorkspaceCollaboratorStatus.PENDING && (
          <div className="flex gap-[12px]">
            <Button
              variant="app-primary"
              className="h-[40px] px-[20px] text-[14px]"
              onClick={() => setRoleTarget(focusedInvitation)}
            >
              Change role
            </Button>
          </div>
        )}
      </div>
    );
  }, [
    inviteId,
    isLoading,
    focusedInvitation,
    router,
  ]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-[#606060]">
          Failed to load invitations. Please try again.
        </p>
        <Button
          variant="app-primary"
          className="h-[40px]"
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {inviteBanner}

      <BaseTable
        title="Invitations"
        columns={columns}
        data={rows}
        searchPlaceholder="Search by name or email"
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        tableOptions={{
          manualPagination: true,
          pageCount: paginator?.total_pages ?? 1,
          state: {
            pagination: {
              pageIndex: page - 1,
              pageSize: PAGE_SIZE,
            },
          },
          onPaginationChange: (updater) => {
            const nextPage =
              typeof updater === "function"
                ? updater({ pageIndex: page - 1, pageSize: PAGE_SIZE }).pageIndex
                : updater.pageIndex;
            setPage(nextPage + 1);
          },
        }}
        filters={[
          {
            label: "Status",
            icon: <Sort size={20} variant="Linear" color="#606060" />,
            options: [
              { label: STATUS_LABELS.PENDING, value: WorkspaceCollaboratorStatus.PENDING },
              { label: STATUS_LABELS.ACTIVE, value: WorkspaceCollaboratorStatus.ACTIVE },
              { label: STATUS_LABELS.REMOVED, value: WorkspaceCollaboratorStatus.REMOVED },
            ],
            value: statusFilter,
            clearable: true,
            clearLabel: "All statuses",
            onValueChange: (value) => {
              setStatusFilter(value as WorkspaceCollaboratorStatus | "");
              setPage(1);
            },
          },
          {
            label: "Role",
            icon: <Sort size={20} variant="Linear" color="#606060" />,
            options: [
              { label: ROLE_LABELS.ADMIN, value: WorkspaceCollaboratorRole.ADMIN },
              { label: ROLE_LABELS.AUTHOR, value: WorkspaceCollaboratorRole.AUTHOR },
              {
                label: ROLE_LABELS.COLLABORATOR,
                value: WorkspaceCollaboratorRole.COLLABORATOR,
              },
            ],
            clearable: true,
            clearLabel: "All roles",
            onValueChange: (value) => {
              setRoleFilter(value as WorkspaceCollaboratorRole | "");
              setPage(1);
            },
          },
        ]}
        toolbarAction={
          <Button
            variant="app-primary"
            className="h-[40px] px-[20px] text-[14px]"
            leftIcon={<UserAdd size={18} variant="Bold" color="currentColor" />}
            onClick={() => setIsInviteOpen(true)}
          >
            Invite someone
          </Button>
        }
        showPagination
      />

      <InviteCollaboratorModal
        isOpen={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onInvited={() => void refetch()}
      />

      <ChangeRoleModal
        key={roleTarget?.id ?? "none"}
        collaboratorId={roleTarget?.id ?? null}
        currentRole={roleTarget?.role ?? null}
        displayName={roleTarget ? getCollaboratorDisplayName(roleTarget) : ""}
        isOpen={Boolean(roleTarget)}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        variant="danger"
        title="Remove collaborator?"
        description={
          removeTarget
            ? `${getCollaboratorDisplayName(removeTarget)} will lose access to your courses. The record is kept so past course history stays intact.`
            : undefined
        }
        confirmLabel="Remove"
        isLoading={isRemoving || isFetching}
        onConfirm={handleRemove}
      />
    </div>
  );
};

export default InvitationsView;
