"use client";

import React, { useState } from "react";
import { User, UserTick, Designtools, UserOctagon, Copy, Filter, Sort, TickCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { AddStaffModal } from "@/modules/admin/dashboard/components/AddStaffModal";
import { TeamActionMenu, TeamRow } from "./components/TeamActionMenu";
import { TeamMemberDrawer } from "./components/TeamMemberDrawer";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api/errors";
import { useAppSelector } from "@/redux";
import {
  useGetStaffQuery,
  useInviteStaffMutation,
  useReactivateStaffMutation,
  useRevokeStaffMutation,
} from "./hooks";
import { StaffMember, StaffRole } from "./types";

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

function staffToRow(s: StaffMember): TeamRow {
  return {
    id: s.id,
    name: `${s.first_name} ${s.last_name}`,
    firstName: s.first_name,
    lastName: s.last_name,
    initials: toInitials(s.first_name, s.last_name),
    email: s.email,
    role: s.role,
    roleLabel: s.role_label,
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
  const [confirmAction, setConfirmAction] = useState<"reactivate" | "revoke" | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: staffData, isLoading } = useGetStaffQuery();
  const [inviteStaff] = useInviteStaffMutation();
  const [reactivateStaff, { isLoading: isReactivating }] = useReactivateStaffMutation();
  const [revokeStaff, { isLoading: isRevoking }] = useRevokeStaffMutation();

  const rows: TeamRow[] = (staffData ?? []).map(staffToRow);

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

  const handleResend = async (member: TeamRow) => {
    try {
      await inviteStaff({
        email: member.email,
        first_name: member.firstName,
        last_name: member.lastName,
        role: (member.role as StaffRole) || StaffRole.STAFF_WRITER,
      }).unwrap();
      toast.success(`Invitation resent to ${member.email}`);
    } catch (err: any) {
      const { message } = normalizeApiError(err as never);
      const fallback =
        err?.data?.detail ||
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        "Failed to resend invitation";
      toast.error(message || fallback);
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
      }
    } catch (err: any) {
      setConfirmAction(null);
      const { message } = normalizeApiError(err as never);
      const detail =
        message ||
        err?.data?.detail ||
        err?.data?.message ||
        err?.data?.errors?.[0]?.message;

      if (
        confirmAction === "reactivate" &&
        err?.status === 400 &&
        (!detail || detail.toLowerCase().includes("invitation"))
      ) {
        toast.error(
          "An invitation revoked before being accepted cannot be reactivated. Please re-invite this person instead."
        );
      } else {
        toast.error(detail || "Action failed");
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
        onReactivate={(member) => handleReactivate(member)}
        onRevoke={(member) => handleRevoke(member)}
        onResend={(member) => handleResend(member)}
      />
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Teams</h1>
            <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage your teams and their roles</p>
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="bg-[#0063EF] flex items-center gap-[8px] h-[40px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
          >
            <span className="text-[16px] font-normal text-[#FDFDFD] tracking-[-0.32px] leading-[24px]">Invite</span>
          </button>
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
