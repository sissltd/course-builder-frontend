"use client";

import React, { useMemo, useState } from "react";
import { User, UserTick, Designtools, UserOctagon, Copy, Filter, Sort, TickCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { AddStaffModal } from "./components/AddStaffModal";
import { ChangeRoleModal } from "./components/ChangeRoleModal";
import { EraseStaffModal } from "./components/EraseStaffModal";
import { TeamActionMenu, TeamRow } from "./components/TeamActionMenu";
import { TeamMemberDrawer } from "./components/TeamMemberDrawer";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api/errors";
import { useAppSelector } from "@/redux";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { PERMISSION } from "@/modules/auth/permissions";
import { useGetRolesQuery } from "@/modules/admin/roles/api/rolesApi";
import type { RoleCard } from "@/modules/admin/roles/types";
import {
  useGetStaffQuery,
  useInviteStaffMutation,
  useReactivateStaffMutation,
  useRevokeStaffMutation,
  useSendStaffPasswordResetMutation,
} from "./hooks";
import { StaffMember } from "./types";

function toInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDateTime(dt: string | null): string {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Finds the role a roster row actually holds.
 *
 * `StaffMember` carries a base role (`role`, e.g. `STAFF_WRITER`) and a display
 * label (`role_label`), never a role id — so the exact role is recovered by name.
 * The label match covers custom roles, whose label is the role's own name; the
 * fallback to the built-in role for that base role covers an older row or a
 * label that has since been renamed.
 *
 * Matching is deliberately conservative: when neither works, `roleId` stays
 * undefined and the actions that would have to name a role are withheld rather
 * than guessed, because sending the wrong one silently rewrites someone's access.
 */
function resolveRoleId(member: StaffMember, roles: RoleCard[]): string | undefined {
  return (
    roles.find((role) => role.name === member.role_label)?.id ??
    roles.find((role) => role.is_system && role.base_role === member.role)?.id
  );
}

function staffToRow(s: StaffMember, roles: RoleCard[]): TeamRow {
  return {
    id: s.id,
    name: `${s.first_name} ${s.last_name}`,
    firstName: s.first_name,
    lastName: s.last_name,
    initials: toInitials(s.first_name, s.last_name),
    email: s.email,
    role: s.role,
    roleLabel: s.role_label,
    roleId: resolveRoleId(s, roles),
    date: formatDateTime(s.created_datetime),
    invitationStatus: s.invitation_status,
    userId: s.id,
  };
}

const userColors = ["#0A60E1", "#FF8A00", "#00C48C", "#FF3D57", "#7C3AED", "#14B8A6", "#8B5CF6", "#F59E0B"];

const roleOptions = [
  { label: "Writer", value: "STAFF_WRITER" },
  { label: "Verifier", value: "STAFF_VERIFIER" },
  { label: "Approver", value: "STAFF_APPROVER" },
];

const successLabels: Record<string, { title: string; description: string }> = {
  reactivate: {
    title: "Access restored!",
    description: "The staff member's access has been reactivated. They keep their original role and password, and can sign in immediately without a new invitation.",
  },
  revoke: {
    title: "Access revoked!",
    description: "The staff member's access has been revoked. Account records and course authorship references remain intact and can be restored anytime.",
  },
};

export const TeamsView = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMember, setActionMember] = useState<TeamRow | null>(null);
  const [confirmAction, setConfirmAction] = useState<"reactivate" | "revoke" | "reset-password" | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<TeamRow | null>(null);
  const [erasingMember, setErasingMember] = useState<TeamRow | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);
  const { can } = usePermissions();

  /*
    Every Teams action is its own permission on the backend, and each endpoint
    refuses on its own terms — so each control is gated by the one that governs
    it, rather than by a single "is admin" test.
  */
  const canAdd = can(PERMISSION.STAFF_ADD);
  const canFullAccess = can(PERMISSION.STAFF_FULL_ACCESS);
  const canResetPassword = can(PERMISSION.STAFF_RESET_PASSWORD);
  const canDelete = can(PERMISSION.STAFF_DELETE);

  const { data: staffData, isLoading } = useGetStaffQuery();
  const { data: roles } = useGetRolesQuery();
  const [inviteStaff] = useInviteStaffMutation();
  const [reactivateStaff, { isLoading: isReactivating }] = useReactivateStaffMutation();
  const [revokeStaff, { isLoading: isRevoking }] = useRevokeStaffMutation();
  const [sendPasswordReset, { isLoading: isResettingPassword }] =
    useSendStaffPasswordResetMutation();

  // Roles are read before rows are built: a roster row carries a label, and the
  // role id behind it is what a re-invite or a role change has to send.
  const roleList = useMemo(() => roles ?? [], [roles]);
  const rows: TeamRow[] = useMemo(
    () => (staffData ?? []).map((member) => staffToRow(member, roleList)),
    [staffData, roleList],
  );

  const totalStaff = rows.length;
  const totalActive = rows.filter((r) => r.invitationStatus === "ACTIVE").length;
  const totalPending = rows.filter((r) => r.invitationStatus === "PENDING").length;
  const totalRevoked = rows.filter((r) => r.invitationStatus === "REVOKED").length;

  const handleReactivate = (member: TeamRow) => {
    setActionMember(member);
    setConfirmAction("reactivate");
  };

  const handleRevoke = (member: TeamRow) => {
    setActionMember(member);
    setConfirmAction("revoke");
  };

  const handleResetPassword = (member: TeamRow) => {
    setActionMember(member);
    setConfirmAction("reset-password");
  };

  /**
   * Re-invites by `role_id`, not the base role enum.
   *
   * The old version sent `role: member.role`, which is the *base* role — for
   * anyone holding a custom role that would quietly re-invite them into the
   * plain built-in one and drop every permission the custom role carried. The
   * action is withheld upstream when no role resolves, so this never guesses.
   */
  const handleResend = async (member: TeamRow) => {
    if (!member.roleId) {
      toast.error(
        `The role “${member.roleLabel}” no longer exists, so this invitation cannot be re-sent. Invite them again with a current role.`,
      );
      return;
    }

    try {
      await inviteStaff({
        email: member.email,
        first_name: member.firstName,
        last_name: member.lastName,
        role_id: member.roleId,
      }).unwrap();
      toast.success(`Invitation resent to ${member.email}`);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Failed to resend invitation");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction || !actionMember) return;

    try {
      if (confirmAction === "reactivate") {
        const res = await reactivateStaff(actionMember.id).unwrap();
        toast.success(res?.detail || `Staff access restored for ${actionMember.name}`);
        setConfirmAction(null);
        setTimeout(() => setSuccessAction("reactivate"), 300);
      } else if (confirmAction === "revoke") {
        const res = await revokeStaff(actionMember.id).unwrap();
        const isPending = actionMember.invitationStatus === "PENDING";
        toast.success(
          res?.detail ||
            (isPending
              ? `Invitation revoked for ${actionMember.name}`
              : `Staff access revoked for ${actionMember.name}`)
        );
        setConfirmAction(null);
        setTimeout(() => setSuccessAction("revoke"), 300);
      } else if (confirmAction === "reset-password") {
        await sendPasswordReset(actionMember.id).unwrap();
        setConfirmAction(null);
        toast.success(`Password reset link sent to ${actionMember.email}`, {
          description:
            "Their password does not change until they use the link, which also signs them out everywhere.",
        });
      }
    } catch (err: any) {
      setConfirmAction(null);
      const { message } = normalizeApiError(err as never);

      if (
        confirmAction === "reactivate" &&
        err?.status === 400 &&
        (!message || message.toLowerCase().includes("invitation"))
      ) {
        toast.error(
          "An invitation revoked before being accepted cannot be reactivated. Please re-invite this person instead."
        );
      } else {
        toast.error(message ?? "Action failed");
      }
    }
  };

  const currentSuccess = successAction ? successLabels[successAction] : null;

  const columns: ColumnDef<TeamRow>[] = [
    {
      accessorKey: "name",
      header: "Names",
      cell: ({ row }) => {
        const idx = rows.findIndex((d) => d.id === row.original.id);
        const color = userColors[idx % userColors.length];
        return (
          <div className="flex items-center gap-[8px] w-[216px]">
            <div
              className="size-[32px] rounded-full flex items-center justify-center text-[16px] font-medium text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {row.original.initials}
            </div>
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              {row.original.name}
            </span>
          </div>
        );
      },
      size: 247,
    },
    {
      accessorKey: "email",
      header: "Email address",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.email}</span>
      ),
      size: 206,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
          {row.original.roleLabel || row.original.role}
        </span>
      ),
      size: 172,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.date}</span>
      ),
      size: 186,
    },
    {
      accessorKey: "invitationStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.invitationStatus;
        const isActive = status === "ACTIVE";
        const isPending = status === "PENDING";
        return (
          <div
            className={`inline-flex items-center px-[8px] py-[4px] rounded-[6px] ${
              isActive
                ? "bg-[#F1F8F2] text-[#3C7E44]"
                : isPending
                ? "bg-[#FFF5ED] text-[#B54708]"
                : "bg-[#FEF3F2] text-[#B42318]"
            }`}
          >
            <span className="text-[12px] font-normal leading-[16px]">{status}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => {
        const isCopied = copiedId === row.original.userId;
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-[#606060] font-mono tracking-[-0.28px] leading-[20px] max-w-[140px] truncate">
              {row.original.userId}
            </span>
            <button
              type="button"
              className="p-[4px] rounded hover:bg-sd-grey-2 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(row.original.userId);
                setCopiedId(row.original.userId);
                toast.success("User ID copied to clipboard");
                setTimeout(() => setCopiedId(null), 2000);
              }}
              title="Copy User ID"
            >
              {isCopied ? (
                <TickCircle variant="Bold" size={14} color="#008500" />
              ) : (
                <Copy variant="Linear" size={14} color="#606060" className="hover:text-[#0063EF]" />
              )}
            </button>
          </div>
        );
      },
      size: 202,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const isSelf =
          currentUser?.id === row.original.userId ||
          currentUser?.email?.toLowerCase() === row.original.email.toLowerCase();
        const isSuperAdmin =
          row.original.role === "SUPER_ADMIN" ||
          row.original.roleLabel === "Super Admin";

        return (
          <div className="relative flex justify-center">
            <TeamActionMenu
              member={row.original}
              isSelf={isSelf}
              isSuperAdmin={isSuperAdmin}
              canFullAccess={canFullAccess}
              canResetPassword={canResetPassword}
              canDelete={canDelete}
              onViewDetails={(m) => {
                setSelectedMember(m);
                setIsDrawerOpen(true);
              }}
              onCopyId={(id) => {
                navigator.clipboard.writeText(id);
                toast.success("User ID copied to clipboard");
              }}
              onCopyEmail={(email) => {
                navigator.clipboard.writeText(email);
                toast.success("Email copied to clipboard");
              }}
              onReactivate={(m) => handleReactivate(m)}
              onRevoke={(m) => handleRevoke(m)}
              onResend={(m) => handleResend(m)}
              onChangeRole={(m) => setChangingRole(m)}
              onResetPassword={(m) => handleResetPassword(m)}
              onDeleteAccount={(m) => setErasingMember(m)}
            />
          </div>
        );
      },
      size: 41,
    },
  ];

  const statCards = [
    { icon: <User variant="Bold" size={20} color="#202020" />, label: "Total Staff", value: String(totalStaff) },
    { icon: <UserTick variant="Bold" size={20} color="#202020" />, label: "Active", value: String(totalActive) },
    { icon: <Designtools variant="Bold" size={20} color="#202020" />, label: "Pending", value: String(totalPending) },
    { icon: <UserOctagon variant="Bold" size={20} color="#202020" />, label: "Revoked", value: String(totalRevoked) },
  ];

  return (
    <>
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />
      <TeamMemberDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        member={selectedMember}
        isSelf={
          currentUser?.id === selectedMember?.userId ||
          currentUser?.email?.toLowerCase() === selectedMember?.email.toLowerCase()
        }
        isSuperAdmin={
          selectedMember?.role === "SUPER_ADMIN" ||
          selectedMember?.roleLabel === "Super Admin"
        }
        canFullAccess={canFullAccess}
        canResetPassword={canResetPassword}
        canDelete={canDelete}
        onReactivate={(member) => handleReactivate(member)}
        onRevoke={(member) => handleRevoke(member)}
        onResend={(member) => handleResend(member)}
        onChangeRole={(member) => setChangingRole(member)}
        onResetPassword={(member) => handleResetPassword(member)}
        onDeleteAccount={(member) => setErasingMember(member)}
      />
      <ChangeRoleModal
        key={changingRole?.id ?? "change-role"}
        isOpen={!!changingRole}
        onOpenChange={(open) => {
          if (!open) setChangingRole(null);
        }}
        member={changingRole}
      />
      <EraseStaffModal
        key={erasingMember?.id ?? "erase-staff"}
        isOpen={!!erasingMember}
        onOpenChange={(open) => {
          if (!open) setErasingMember(null);
        }}
        member={erasingMember}
      />
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Teams</h1>
            <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage your teams and their roles</p>
          </div>
          {canAdd && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="bg-[#0063EF] flex items-center gap-[8px] h-[40px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
            >
              <span className="text-[16px] font-normal text-[#FDFDFD] tracking-[-0.32px] leading-[24px]">Invite</span>
            </button>
          )}
        </div>

        <div className="flex gap-[16px] flex-wrap">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]"
            >
              <div className="flex gap-[8px] items-center">
                {card.icon}
                <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{card.label}</span>
              </div>
              <span className="text-[28px] font-medium text-[#202020] tracking-[-0.56px] leading-[32px]">{card.value}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
          </div>
        ) : (
          <BaseTable
            title="Teams"
            columns={columns}
            data={rows}
            searchPlaceholder="Search names, email etc"
            filters={[
              {
                label: "Role",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                searchable: true,
                searchPlaceholder: "Search role",
                options: roleOptions.map((r) => ({ label: r.label, value: r.value })),
                onValueChange: () => {},
              },
              {
                label: "Sort",
                icon: <Sort size={20} variant="Linear" color="#606060" />,
                options: [
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "A-Z", value: "az" },
                ],
                onValueChange: () => {},
              },
            ]}
            showDateFilter
            dateFilterInline
            showHeader={false}
            showPagination={false}
            ignoreRowClickColumns={["actions"]}
            onRowClick={(member) => {
              setSelectedMember(member);
              setIsDrawerOpen(true);
            }}
          />
        )}
      </div>

      {/* Reactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmAction === "reactivate"}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
        title="Reactivate staff member?"
        description={`Are you sure you want to restore access for ${actionMember?.name || "this staff member"}? They will keep their original role and can sign in immediately.`}
        confirmLabel="Reactivate"
        cancelLabel="Cancel"
        variant="primary"
        isLoading={isReactivating}
        onConfirm={handleConfirm}
        icon={<TickCircle variant="Bold" size={48} color="#008500" />}
      />

      {/* Revoke Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmAction === "revoke"}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
        title={actionMember?.invitationStatus === "PENDING" ? "Revoke invitation?" : "Revoke staff access?"}
        description={
          actionMember?.invitationStatus === "PENDING"
            ? `Are you sure you want to revoke the invitation for ${actionMember?.name || "this person"}? The emailed invitation link will stop working immediately.`
            : `Are you sure you want to revoke access for ${actionMember?.name || "this staff member"}? Their account will be deactivated and they can no longer sign in. Their account records and course authorship references will be kept intact.`
        }
        confirmLabel={actionMember?.invitationStatus === "PENDING" ? "Revoke invitation" : "Revoke access"}
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isRevoking}
        onConfirm={handleConfirm}
      />

      {/* Reset Password Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmAction === "reset-password"}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
        title="Send a password reset link?"
        description={`A reset link will be emailed to ${actionMember?.email || "this person"}. Their password does not change until they use it, which also signs them out everywhere.`}
        confirmLabel={isResettingPassword ? "Sending..." : "Yes, send link"}
        cancelLabel="Cancel"
        variant="primary"
        isLoading={isResettingPassword}
        onConfirm={handleConfirm}
      />

      {/* Success Modal */}
      {currentSuccess && (
        <Modal
          isOpen={!!successAction}
          onOpenChange={(open) => {
            if (!open) setSuccessAction(null);
          }}
        >
          <div className="flex flex-col items-center gap-[16px] text-center">
            <div className="size-[80px] rounded-full bg-[#EBF7EE] flex items-center justify-center">
              <TickCircle variant="Bold" size={48} color="#008500" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[28px] font-semibold text-[#202020] leading-tight">{currentSuccess.title}</span>
              <p className="text-[14px] text-[#606060] leading-normal max-w-[320px]">{currentSuccess.description}</p>
            </div>
            <button
              onClick={() => setSuccessAction(null)}
              className="w-full h-[44px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer mt-[8px]"
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
