"use client";

import React, { useState, useMemo } from "react";
import {
  User,
  UserTick,
  Designtools,
  UserOctagon,
  Filter,
  Sort,
  Copy,
  Refresh,
  TickCircle,
} from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Pagination } from "@/components/shared/Pagination";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  useGetUsersQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useReinstateUserMutation,
} from "@/redux/slices/adminApi";
import type { AdminUser, UsersListParams } from "@/modules/admin/teams/types";
import { useDebouncedValue } from "@/modules/admin/mie-recommendation/hooks/useDebouncedValue";
import { UserActionMenu } from "./components/UserActionMenu";
import { UserDrawer } from "./components/UserDrawer";
import { SuspendUserModal } from "./components/SuspendUserModal";
import { DeactivateUserModal } from "./components/DeactivateUserModal";

interface UserTableRow {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  date: string;
  status: string;
  statusLabel: string;
  userId: string;
  raw: AdminUser;
}

const userColors = [
  "#0A60E1",
  "#FF8A00",
  "#00C48C",
  "#FF3D57",
  "#7C3AED",
  "#14B8A6",
  "#8B5CF6",
  "#F59E0B",
];

function toInitials(first?: string, last?: string): string {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

function formatDate(dt?: string | null): string {
  if (!dt) return "—";
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return format(d, "dd MMM yyyy");
  } catch {
    return dt;
  }
}

const ROLE_OPTIONS = [
  { label: "All Roles", value: "ALL" },
  { label: "Course Creator", value: "COURSE_CREATOR" },
  { label: "Creator Reviewer", value: "CREATOR_REVIEWER" },
  { label: "AI Reviewer", value: "AI_REVIEWER" },
  { label: "QA Reviewer", value: "QA_REVIEWER" },
  { label: "Writer", value: "STAFF_WRITER" },
  { label: "Verifier", value: "STAFF_VERIFIER" },
  { label: "Approver", value: "STAFF_APPROVER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending Verification", value: "PENDING_VERIFICATION" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Deactivated", value: "DEACTIVATED" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_datetime" },
  { label: "Oldest", value: "created_datetime" },
  { label: "Recently Logged In", value: "-last_login" },
  { label: "A-Z", value: "first_name" },
  { label: "Z-A", value: "-first_name" },
];

export const AdminUsersView = () => {
  // Query Filter States
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [ordering, setOrdering] = useState<string>("-created_datetime");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Drawer States
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [suspendingUser, setSuspendingUser] = useState<AdminUser | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<AdminUser | null>(null);
  const [reinstatingUser, setReinstatingUser] = useState<AdminUser | null>(null);

  // Mutations
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation();
  const [reinstateUser, { isLoading: isReinstating }] = useReinstateUserMutation();

  // API Query Params
  const queryParams = useMemo<UsersListParams>(() => {
    const params: UsersListParams = {
      page,
      page_size: pageSize,
      ordering,
    };
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }
    if (statusFilter !== "ALL") {
      params.status = statusFilter;
    }
    if (roleFilter !== "ALL") {
      params.role = roleFilter;
    }
    return params;
  }, [page, pageSize, ordering, debouncedSearch, statusFilter, roleFilter]);

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery(queryParams);

  const paginator = data?.data?.paginator;
  const rawUsers: AdminUser[] = useMemo(() => {
    return data?.data?.results ?? [];
  }, [data]);

  const rows: UserTableRow[] = useMemo(() => {
    return rawUsers.map((u) => ({
      id: u.id,
      name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "User",
      initials: toInitials(u.first_name, u.last_name),
      email: u.email,
      role: u.role_label || u.role,
      date: formatDate(u.created_datetime),
      status: u.status,
      statusLabel: u.status_label || u.status,
      userId: u.id,
      raw: u,
    }));
  }, [rawUsers]);

  const totalCount = paginator?.count ?? rows.length;
  const totalPages = paginator?.total_pages ?? (Math.ceil(totalCount / pageSize) || 1);

  const totalActive = rows.filter((r) => r.status === "ACTIVE").length;
  const totalPending = rows.filter((r) => r.status === "PENDING_VERIFICATION").length;
  const totalSuspended = rows.filter(
    (r) => r.status === "SUSPENDED" || r.status === "DEACTIVATED"
  ).length;

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleOpenDrawer = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleStartSuspend = (user: AdminUser) => {
    setSuspendingUser(user);
  };

  const handleConfirmSuspend = async (reason: string) => {
    if (!suspendingUser) return;
    try {
      await suspendUser({ id: suspendingUser.id, body: { reason } }).unwrap();
      toast.success(`Account for ${suspendingUser.first_name} ${suspendingUser.last_name} suspended`);
      setSuspendingUser(null);
      if (selectedUser?.id === suspendingUser.id) {
        setIsDrawerOpen(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.errors?.[0]?.message || "Failed to suspend account";
      toast.error(msg);
    }
  };

  const handleStartDeactivate = (user: AdminUser) => {
    setDeactivatingUser(user);
  };

  const handleConfirmDeactivate = async (reason: string) => {
    if (!deactivatingUser) return;
    try {
      await deactivateUser({ id: deactivatingUser.id, body: { reason } }).unwrap();
      toast.success(`Account for ${deactivatingUser.first_name} ${deactivatingUser.last_name} deactivated`);
      setDeactivatingUser(null);
      if (selectedUser?.id === deactivatingUser.id) {
        setIsDrawerOpen(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.errors?.[0]?.message || "Failed to deactivate account";
      toast.error(msg);
    }
  };

  const handleStartReinstate = (user: AdminUser) => {
    setReinstatingUser(user);
  };

  const handleConfirmReinstate = async () => {
    if (!reinstatingUser) return;
    try {
      await reinstateUser(reinstatingUser.id).unwrap();
      toast.success(`Account for ${reinstatingUser.first_name} ${reinstatingUser.last_name} reinstated`);
      setReinstatingUser(null);
      if (selectedUser?.id === reinstatingUser.id) {
        setIsDrawerOpen(false);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.errors?.[0]?.message || "Failed to reinstate account";
      toast.error(msg);
    }
  };

  const columns: ColumnDef<UserTableRow>[] = [
    {
      accessorKey: "name",
      header: "Names",
      cell: ({ row }) => {
        const idx = rows.findIndex((d) => d.id === row.original.id);
        const color = userColors[idx % userColors.length];
        return (
          <div className="flex items-center gap-[8px] w-[216px]">
            <div
              className="size-[32px] rounded-full flex items-center justify-center text-[14px] font-medium text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {row.original.initials}
            </div>
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] truncate">
              {row.original.name}
            </span>
          </div>
        );
      },
      size: 230,
    },
    {
      accessorKey: "email",
      header: "Email address",
      cell: ({ row }) => {
        const isCopied = copiedText === row.original.email;
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] truncate max-w-[190px]">
              {row.original.email}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(row.original.email, "Email");
              }}
              className="cursor-pointer shrink-0 text-[#606060] hover:text-[#0063EF] transition-colors p-[2px]"
              title="Copy email to clipboard"
            >
              {isCopied ? (
                <TickCircle variant="Bold" size={16} color="#059669" />
              ) : (
                <Copy variant="Linear" size={16} color="#606060" />
              )}
            </button>
          </div>
        );
      },
      size: 240,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
          {row.original.role}
        </span>
      ),
      size: 160,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
          {row.original.date}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const isActive = status === "ACTIVE";
        const isPending = status === "PENDING_VERIFICATION";
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
            <span className="text-[12px] font-normal leading-[16px]">
              {row.original.statusLabel}
            </span>
          </div>
        );
      },
      size: 130,
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => {
        const isCopied = copiedText === row.original.userId;
        return (
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis max-w-[140px]">
              {row.original.userId}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(row.original.userId, "User ID");
              }}
              className="cursor-pointer shrink-0 text-[#606060] hover:text-[#0063EF] transition-colors p-[2px]"
              title="Copy User ID to clipboard"
            >
              {isCopied ? (
                <TickCircle variant="Bold" size={16} color="#059669" />
              ) : (
                <Copy variant="Linear" size={16} color="#606060" />
              )}
            </button>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
          <UserActionMenu
            user={row.original.raw}
            onViewDetails={() => handleOpenDrawer(row.original.raw)}
            onCopyId={(id) => handleCopy(id, "User ID")}
            onCopyEmail={(email) => handleCopy(email, "Email")}
            onSuspend={() => handleStartSuspend(row.original.raw)}
            onDeactivate={() => handleStartDeactivate(row.original.raw)}
            onReinstate={() => handleStartReinstate(row.original.raw)}
          />
        </div>
      ),
      size: 50,
    },
  ];

  const statCards = [
    {
      icon: <User variant="Bold" size={20} color="#202020" />,
      label: "Total Accounts",
      value: String(totalCount),
    },
    {
      icon: <UserTick variant="Bold" size={20} color="#202020" />,
      label: "Active",
      value: String(totalActive),
    },
    {
      icon: <Designtools variant="Bold" size={20} color="#202020" />,
      label: "Pending",
      value: String(totalPending),
    },
    {
      icon: <UserOctagon variant="Bold" size={20} color="#202020" />,
      label: "Suspended",
      value: String(totalSuspended),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
              Users
            </h1>
            <p className="text-[16px] font-normal text-[#606060] leading-[24px]">
              Manage and moderate platform user accounts
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-white border border-[#D9D9D9] flex items-center gap-[8px] h-[40px] px-[16px] py-[10px] rounded-[8px] hover:bg-sd-grey-1 transition-colors cursor-pointer text-[14px] text-[#606060]"
          >
            <Refresh size={16} color="#606060" className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Overview Stat Cards - Clean and matching TeamsView */}
        <div className="flex gap-[16px] flex-wrap">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]"
            >
              <div className="flex gap-[8px] items-center">
                {card.icon}
                <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
                  {card.label}
                </span>
              </div>
              <span className="text-[28px] font-medium text-[#202020] tracking-[-0.56px] leading-[32px]">
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Table & Filtering */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <BaseTable
              title="Users"
              columns={columns}
              data={rows}
              searchPlaceholder="Search names, email etc"
              onSearchChange={(val) => {
                setSearchInput(val);
                setPage(1);
              }}
              filters={[
                {
                  label: "Role",
                  icon: <Filter size={20} variant="Linear" color="#606060" />,
                  searchable: true,
                  searchPlaceholder: "Search role",
                  options: ROLE_OPTIONS,
                  value: roleFilter === "ALL" ? "" : roleFilter,
                  onValueChange: (val) => {
                    setRoleFilter(val || "ALL");
                    setPage(1);
                  },
                },
                {
                  label: "Status",
                  icon: <Filter size={20} variant="Linear" color="#606060" />,
                  options: STATUS_OPTIONS,
                  value: statusFilter === "ALL" ? "" : statusFilter,
                  onValueChange: (val) => {
                    setStatusFilter(val || "ALL");
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
              showHeader={false}
              showPagination={false}
              selectable={false}
              ignoreRowClickColumns={["actions"]}
              onRowClick={(row) => {
                handleOpenDrawer(row.raw);
              }}
            />

            {/* Pagination Controls */}
            {rows.length > 0 && (
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
          </div>
        )}
      </div>

      {/* User Details Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        user={selectedUser}
        onSuspend={handleStartSuspend}
        onDeactivate={handleStartDeactivate}
        onReinstate={handleStartReinstate}
      />

      {/* Suspend Modal */}
      <SuspendUserModal
        isOpen={!!suspendingUser}
        onOpenChange={(open) => {
          if (!open) setSuspendingUser(null);
        }}
        user={suspendingUser}
        onConfirm={handleConfirmSuspend}
        isLoading={isSuspending}
      />

      {/* Deactivate Modal */}
      <DeactivateUserModal
        isOpen={!!deactivatingUser}
        onOpenChange={(open) => {
          if (!open) setDeactivatingUser(null);
        }}
        user={deactivatingUser}
        onConfirm={handleConfirmDeactivate}
        isLoading={isDeactivating}
      />

      {/* Reinstate Confirmation Modal */}
      <ConfirmModal
        isOpen={!!reinstatingUser}
        onOpenChange={(open) => {
          if (!open) setReinstatingUser(null);
        }}
        title="Reinstate account?"
        description={`Are you sure you want to reinstate access for ${reinstatingUser?.first_name} ${reinstatingUser?.last_name}? They will be able to access the platform again.`}
        confirmLabel="Reinstate"
        cancelLabel="Cancel"
        variant="primary"
        isLoading={isReinstating}
        onConfirm={handleConfirmReinstate}
        icon={<TickCircle variant="Bold" size={48} color="#008500" />}
      />
    </>
  );
};
