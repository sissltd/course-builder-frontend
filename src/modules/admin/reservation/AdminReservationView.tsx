"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import {
  More,
  Filter,
  TickCircle,
  CloseCircle,
  Eye,
  Refresh2,
  Calendar2,
} from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { cn } from "@/lib/utils";
import {
  useGetActiveReservationsQuery,
  useGetReservationRequestsQuery,
  useApproveReservationRequestMutation,
  useRejectReservationRequestMutation,
  useReleaseActiveReservationMutation,
} from "@/redux/slices/adminApi";
import type {
  AdminActiveReservation,
  AdminReservationRequestItem,
} from "@/redux/slices/adminApi";
import { useGetCategoriesQuery } from "@/modules/creator/courses/hooks";
import { ReservationDrawer } from "./components/ReservationDrawer";
import { ReservationRejectModal } from "./components/ReservationRejectModal";

type ActiveTab = "requests" | "active";

export const AdminReservationView = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected row for actions / drawer
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedActiveId, setSelectedActiveId] = useState<string | null>(null);
  const [selectedTopicTitle, setSelectedTopicTitle] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modals state
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [bulkTargetIds, setBulkTargetIds] = useState<string[]>([]);
  const [selectedRequestRows, setSelectedRequestRows] = useState<AdminReservationRequestItem[]>([]);

  // API Queries
  const {
    data: requestsResponse,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useGetReservationRequestsQuery({
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });

  const {
    data: activeResponse,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useGetActiveReservationsQuery({
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const { data: categoriesResponse } = useGetCategoriesQuery();

  // Mutations
  const [approveRequestMutation, { isLoading: isApproving }] =
    useApproveReservationRequestMutation();
  const [rejectRequestMutation, { isLoading: isRejecting }] =
    useRejectReservationRequestMutation();
  const [releaseActiveMutation, { isLoading: isReleasing }] =
    useReleaseActiveReservationMutation();

  const requests = useMemo(
    () => requestsResponse?.data?.results ?? [],
    [requestsResponse]
  );
  const activeReservations = useMemo(
    () => activeResponse?.data?.results ?? [],
    [activeResponse]
  );

  const totalRequestsCount = requestsResponse?.data?.paginator?.count ?? 0;
  const totalActiveCount = activeResponse?.data?.paginator?.count ?? 0;

  // Category filter options
  const categoryOptions = useMemo(() => {
    const defaultOpt = [{ label: "All Categories", value: "all" }];
    const cats = categoriesResponse?.data?.results ?? [];
    return [
      ...defaultOpt,
      ...cats.map((c) => ({ label: c.name, value: c.name })),
    ];
  }, [categoriesResponse]);

  // Status Chip
  const renderStatusChip = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-[#F1F8F2] px-[8px] py-[3px] text-[11px] font-medium text-[#3C7E44]">
            <TickCircle variant="Bold" size={12} color="#3C7E44" />
            {status === "ACTIVE" ? "Active" : "Approved"}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-[#FFEBE5] px-[8px] py-[3px] text-[11px] font-medium text-[#FF5025]">
            <CloseCircle variant="Bold" size={12} color="#FF5025" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-[#FFF5ED] px-[8px] py-[3px] text-[11px] font-medium text-[#F2994A]">
            <span className="size-[6px] rounded-full bg-[#F2994A]" />
            Pending
          </span>
        );
    }
  };

  // Action handlers
  const handleOpenDrawerForRequest = (item: AdminReservationRequestItem) => {
    setSelectedRequestId(item.id);
    setSelectedActiveId(null);
    setIsDrawerOpen(true);
  };

  const handleOpenDrawerForActive = (item: AdminActiveReservation) => {
    setSelectedActiveId(item.id);
    setSelectedRequestId(null);
    setIsDrawerOpen(true);
  };

  const handleTriggerApprove = (id: string, title?: string) => {
    setTargetId(id);
    setBulkTargetIds([]);
    setSelectedTopicTitle(title || "");
    setShowApproveConfirm(true);
  };

  const handleTriggerReject = (id: string, title?: string) => {
    setTargetId(id);
    setBulkTargetIds([]);
    setSelectedTopicTitle(title || "");
    setShowRejectModal(true);
  };

  const handleTriggerRelease = (id: string, title?: string) => {
    setTargetId(id);
    setSelectedTopicTitle(title || "");
    setShowReleaseConfirm(true);
  };

  // Confirm Approve Single/Bulk
  const handleConfirmApprove = async () => {
    const ids = bulkTargetIds.length > 0 ? bulkTargetIds : targetId ? [targetId] : [];
    if (ids.length === 0) return;

    try {
      for (const id of ids) {
        await approveRequestMutation({ id }).unwrap();
      }
      toast.success(
        ids.length === 1
          ? "Reservation request approved successfully"
          : `${ids.length} reservation requests approved successfully`
      );
      setShowApproveConfirm(false);
      setTargetId(null);
      setBulkTargetIds([]);
      void refetchRequests();
      void refetchActive();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to approve reservation request");
    }
  };

  // Confirm Reject Single/Bulk
  const handleConfirmReject = async (reason: string) => {
    const ids = bulkTargetIds.length > 0 ? bulkTargetIds : targetId ? [targetId] : [];
    if (ids.length === 0) return;

    try {
      for (const id of ids) {
        await rejectRequestMutation({
          id,
          body: reason ? { rejection_reason: reason } : undefined,
        }).unwrap();
      }
      toast.success(
        ids.length === 1
          ? "Reservation request rejected"
          : `${ids.length} reservation requests rejected`
      );
      setShowRejectModal(false);
      setTargetId(null);
      setBulkTargetIds([]);
      void refetchRequests();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to reject reservation request");
    }
  };

  // Confirm Release Active
  const handleConfirmRelease = async () => {
    if (!targetId) return;
    try {
      await releaseActiveMutation({ id: targetId }).unwrap();
      toast.success("Active reservation released successfully");
      setShowReleaseConfirm(false);
      setTargetId(null);
      void refetchActive();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to release reservation");
    }
  };

  // Columns for Reservation Requests
  const requestColumns: ColumnDef<AdminReservationRequestItem>[] = [
    {
      accessorKey: "name",
      header: "Topic",
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[200px]">
          <span className="text-[14px] font-medium text-sd-grey-12 leading-[20px]">
            {row.original.name || row.original.topic?.name || "No topic name"}
          </span>
          {row.original.created_datetime && (
            <span className="text-[11px] text-sd-reviewer-muted">
              {format(new Date(row.original.created_datetime), "dd MMM yyyy")}
            </span>
          )}
        </div>
      ),
      size: 260,
    },
    {
      accessorFn: (row) => row.requested_by?.email,
      id: "requested_by",
      header: "Requested by",
      cell: ({ row }) => {
        const user = row.original.requested_by;
        const name = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
        return (
          <div className="flex flex-col min-w-[170px]">
            <span className="text-[14px] font-medium text-sd-grey-12">
              {name || user?.email || "No name"}
            </span>
            <span className="text-[12px] text-sd-reviewer-muted truncate">
              {user?.email || "—"}
            </span>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorFn: (row) => row.category?.name,
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] text-sd-reviewer-muted">
          {row.original.category?.name || row.original.topic?.category?.name || "—"}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => renderStatusChip(row.original.status),
      size: 120,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const item = row.original;
        const isMenuOpen = openMenuId === item.id;
        const isPending = item.status === "PENDING";

        return (
          <div className="relative flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(isMenuOpen ? null : item.id);
              }}
              className="p-[6px] rounded-full hover:bg-sd-grey-3 transition-colors cursor-pointer"
            >
              <More variant="Linear" size={20} color="var(--sd-grey-11)" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute top-[36px] right-0 z-50 bg-white border border-sd-grey-3 rounded-[10px] p-[6px] shadow-[0px_6px_16px_rgba(0,0,0,0.12)] w-[160px] flex flex-col gap-[2px]">
                  <button
                    type="button"
                    className="flex items-center gap-[8px] h-[32px] px-[8px] rounded-[6px] hover:bg-sd-grey-2 text-[12px] text-sd-grey-12 text-left cursor-pointer"
                    onClick={() => {
                      setOpenMenuId(null);
                      handleOpenDrawerForRequest(item);
                    }}
                  >
                    <Eye size={16} variant="Linear" color="currentColor" />
                    <span>View details</span>
                  </button>

                  {isPending && (
                    <>
                      <button
                        type="button"
                        className="flex items-center gap-[8px] h-[32px] px-[8px] rounded-[6px] hover:bg-emerald-50 text-[12px] text-[#3C7E44] text-left cursor-pointer"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleTriggerApprove(item.id, item.name);
                        }}
                      >
                        <TickCircle size={16} variant="Linear" color="#3C7E44" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-[8px] h-[32px] px-[8px] rounded-[6px] hover:bg-red-50 text-[12px] text-[#D54800] text-left cursor-pointer"
                        onClick={() => {
                          setOpenMenuId(null);
                          handleTriggerReject(item.id, item.name);
                        }}
                      >
                        <CloseCircle size={16} variant="Linear" color="#D54800" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        );
      },
      size: 70,
    },
  ];

  // Columns for Active Reservations
  const activeColumns: ColumnDef<AdminActiveReservation>[] = [
    {
      accessorKey: "name",
      header: "Topic",
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[200px]">
          <span className="text-[14px] font-medium text-sd-grey-12 leading-[20px]">
            {row.original.name}
          </span>
          {row.original.created_datetime && (
            <span className="text-[11px] text-sd-reviewer-muted">
              Reserved: {format(new Date(row.original.created_datetime), "dd MMM yyyy")}
            </span>
          )}
        </div>
      ),
      size: 260,
    },
    {
      accessorFn: (row) => row.reserved_by?.email,
      id: "reserved_by",
      header: "Reserved by",
      cell: ({ row }) => {
        const user = row.original.reserved_by;
        const name = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
        return (
          <div className="flex flex-col min-w-[170px]">
            <span className="text-[14px] font-medium text-sd-grey-12">
              {name || user?.email || "No name"}
            </span>
            <span className="text-[12px] text-sd-reviewer-muted truncate">
              {user?.email || "—"}
            </span>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorFn: (row) => row.category?.name,
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] text-sd-reviewer-muted">
          {row.original.category?.name || "—"}
        </span>
      ),
      size: 170,
    },
    {
      accessorKey: "creator_price",
      header: "Creator Price",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-sd-grey-12">
          {row.original.creator_price ? `$${Number(row.original.creator_price).toLocaleString()}` : "—"}
        </span>
      ),
      size: 130,
    },
    {
      accessorKey: "reserved_until",
      header: "Reserved Until",
      cell: ({ row }) => (
        <span className="text-[14px] text-sd-reviewer-muted">
          {row.original.reserved_until
            ? format(new Date(row.original.reserved_until), "dd MMM yyyy")
            : "—"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => renderStatusChip(row.original.status),
      size: 110,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const item = row.original;
        const isMenuOpen = openMenuId === item.id;

        return (
          <div className="relative flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(isMenuOpen ? null : item.id);
              }}
              className="p-[6px] rounded-full hover:bg-sd-grey-3 transition-colors cursor-pointer"
            >
              <More variant="Linear" size={20} color="var(--sd-grey-11)" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute top-[36px] right-0 z-50 bg-white border border-sd-grey-3 rounded-[10px] p-[6px] shadow-[0px_6px_16px_rgba(0,0,0,0.12)] w-[170px] flex flex-col gap-[2px]">
                  <button
                    type="button"
                    className="flex items-center gap-[8px] h-[32px] px-[8px] rounded-[6px] hover:bg-sd-grey-2 text-[12px] text-sd-grey-12 text-left cursor-pointer"
                    onClick={() => {
                      setOpenMenuId(null);
                      handleOpenDrawerForActive(item);
                    }}
                  >
                    <Eye size={16} variant="Linear" color="currentColor" />
                    <span>View details</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-[8px] h-[32px] px-[8px] rounded-[6px] hover:bg-red-50 text-[12px] text-[#D54800] text-left cursor-pointer"
                    onClick={() => {
                      setOpenMenuId(null);
                      handleTriggerRelease(item.id, item.name);
                    }}
                  >
                    <CloseCircle size={16} variant="Linear" color="#D54800" />
                    <span>Release Reservation</span>
                  </button>
                </div>
              </>
            )}
          </div>
        );
      },
      size: 70,
    },
  ];

  return (
    <div className="flex flex-col gap-[20px] p-[20px] md:p-[28px] max-w-[1440px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
        <div>
          <h1 className="text-[22px] font-bold text-sd-grey-12">Topic Reservations</h1>
          <p className="text-[13px] text-sd-reviewer-muted mt-[4px]">
            Review creator topic requests and oversee active reservations across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void refetchRequests();
            void refetchActive();
            toast.success("Reservations updated");
          }}
          className="flex items-center gap-[8px] self-start sm:self-auto px-[14px] py-[8px] rounded-[8px] border border-sd-grey-4 bg-white text-sd-grey-12 text-[13px] font-medium hover:bg-sd-grey-2 transition-colors cursor-pointer"
        >
          <Refresh2 size={16} variant="Linear" color="currentColor" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-sd-grey-3 flex items-center gap-[24px]">
        <button
          type="button"
          onClick={() => {
            setActiveTab("requests");
            setCurrentPage(1);
          }}
          className={cn(
            "relative pb-[12px] pt-[6px] text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-[8px]",
            activeTab === "requests" ? "text-sd-blue" : "text-sd-reviewer-muted hover:text-sd-grey-12"
          )}
        >
          <span>Reservation Requests</span>
          <span
            className={cn(
              "rounded-full px-[8px] py-[2px] text-[11px] font-semibold",
              activeTab === "requests"
                ? "bg-sd-blue/10 text-sd-blue"
                : "bg-sd-grey-3 text-sd-reviewer-muted"
            )}
          >
            {totalRequestsCount}
          </span>
          {activeTab === "requests" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sd-blue" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("active");
            setCurrentPage(1);
          }}
          className={cn(
            "relative pb-[12px] pt-[6px] text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-[8px]",
            activeTab === "active" ? "text-sd-blue" : "text-sd-reviewer-muted hover:text-sd-grey-12"
          )}
        >
          <span>Active Reservations</span>
          <span
            className={cn(
              "rounded-full px-[8px] py-[2px] text-[11px] font-semibold",
              activeTab === "active"
                ? "bg-sd-blue/10 text-sd-blue"
                : "bg-sd-grey-3 text-sd-reviewer-muted"
            )}
          >
            {totalActiveCount}
          </span>
          {activeTab === "active" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sd-blue" />
          )}
        </button>
      </div>

      {/* Content Table Area */}
      {activeTab === "requests" ? (
        <BaseTable
          title="Reservation Requests"
          columns={requestColumns}
          data={requests}
          searchPlaceholder="Search topic name or creator email..."
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          filters={[
            {
              label: "Category",
              icon: <Filter size={18} variant="Linear" color="#606060" />,
              options: categoryOptions,
              onValueChange: (cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              },
            },
            {
              label: "Status",
              options: [
                { label: "All Statuses", value: "all" },
                { label: "Pending", value: "PENDING" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
              ],
              onValueChange: (st) => {
                setSelectedStatus(st);
                setCurrentPage(1);
              },
            },
          ]}
          showHeader={false}
          showPagination
          selectable
          ignoreRowClickColumns={["actions"]}
          onRowClick={(row) => handleOpenDrawerForRequest(row)}
          onSelectionChange={(rows) => setSelectedRequestRows(rows)}
          selectionAction={(selectedCount: number) => (
            <>
              <button
                type="button"
                onClick={() => {
                  const ids = selectedRequestRows.map((r) => r.id);
                  setBulkTargetIds(ids);
                  setShowApproveConfirm(true);
                }}
                className="h-[32px] px-[16px] bg-[#0063EF] text-white text-[12px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
              >
                Approve Selected ({selectedCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  const ids = selectedRequestRows.map((r) => r.id);
                  setBulkTargetIds(ids);
                  setShowRejectModal(true);
                }}
                className="h-[32px] px-[16px] border border-[#D54800] text-[#D54800] text-[12px] font-medium rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
              >
                Reject Selected ({selectedCount})
              </button>
            </>
          )}
        />
      ) : (
        <BaseTable
          title="Active Reservations"
          columns={activeColumns}
          data={activeReservations}
          searchPlaceholder="Search reserved topic or creator email..."
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          filters={[
            {
              label: "Category",
              icon: <Filter size={18} variant="Linear" color="#606060" />,
              options: categoryOptions,
              onValueChange: (cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              },
            },
          ]}
          showHeader={false}
          showPagination
          ignoreRowClickColumns={["actions"]}
          onRowClick={(row) => handleOpenDrawerForActive(row)}
        />
      )}

      {/* Detail Slide Drawer */}
      <ReservationDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        activeReservationId={selectedActiveId}
        requestId={selectedRequestId}
        onApproveRequest={(id) => handleTriggerApprove(id)}
        onRejectRequest={(id) => handleTriggerReject(id)}
        onReleaseActive={(id) => handleTriggerRelease(id)}
      />

      {/* Approve Confirm Modal */}
      <ConfirmModal
        isOpen={showApproveConfirm}
        onOpenChange={setShowApproveConfirm}
        title="Approve reservation request?"
        description={
          bulkTargetIds.length > 0
            ? `Are you sure you want to approve ${bulkTargetIds.length} selected reservation requests?`
            : selectedTopicTitle
            ? `Approve reservation request for "${selectedTopicTitle}"?`
            : "Are you sure you want to approve this reservation request?"
        }
        confirmLabel={isApproving ? "Approving..." : "Yes, approve"}
        isLoading={isApproving}
        variant="primary"
        onConfirm={handleConfirmApprove}
      />

      {/* Reject Modal */}
      <ReservationRejectModal
        isOpen={showRejectModal}
        onOpenChange={setShowRejectModal}
        topicTitle={selectedTopicTitle}
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
      />

      {/* Release Confirm Modal */}
      <ConfirmModal
        isOpen={showReleaseConfirm}
        onOpenChange={setShowReleaseConfirm}
        title="Release active reservation?"
        description={
          selectedTopicTitle
            ? `Are you sure you want to release the reservation for "${selectedTopicTitle}"? This topic will become available for other creators.`
            : "Are you sure you want to release this reservation? This topic will become available for other creators."
        }
        confirmLabel={isReleasing ? "Releasing..." : "Yes, release topic"}
        isLoading={isReleasing}
        variant="danger"
        onConfirm={handleConfirmRelease}
      />
    </div>
  );
};

export default AdminReservationView;
