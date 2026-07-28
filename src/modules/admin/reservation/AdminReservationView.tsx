"use client";

import React, { useState } from "react";
import { More, Filter, TickCircle, CloseCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ColumnDef } from "@tanstack/react-table";

type ReservationStatus = "Pending" | "Approved" | "Rejected";

interface Reservation {
  id: string;
  topic: string;
  requestedBy: string;
  category: string;
  duration: string;
  price: string;
  status: ReservationStatus;
}

const data: Reservation[] = [
  { id: "1", topic: "Machine Learning and AI", requestedBy: "Osaite Emmanuel", category: "Software Engineering", duration: "12 weeks", price: "$250.00", status: "Pending" },
  { id: "2", topic: "Advanced Python Programming", requestedBy: "Sarah Johnson", category: "Data Science", duration: "8 weeks", price: "$180.00", status: "Pending" },
  { id: "3", topic: "UI/UX Design Principles", requestedBy: "Emily Davis", category: "Design", duration: "6 weeks", price: "$150.00", status: "Approved" },
  { id: "4", topic: "Cloud Architecture", requestedBy: "Michael Chen", category: "Software Engineering", duration: "10 weeks", price: "$300.00", status: "Pending" },
  { id: "5", topic: "Network Security", requestedBy: "James Wilson", category: "Security", duration: "8 weeks", price: "$220.00", status: "Pending" },
  { id: "6", topic: "Digital Marketing", requestedBy: "Lisa Anderson", category: "Business", duration: "4 weeks", price: "$120.00", status: "Rejected" },
  { id: "7", topic: "Blockchain Fundamentals", requestedBy: "David Brown", category: "Software Engineering", duration: "6 weeks", price: "$200.00", status: "Pending" },
  { id: "8", topic: "Data Science with R", requestedBy: "Anna Martinez", category: "Data Science", duration: "10 weeks", price: "$260.00", status: "Approved" },
  { id: "9", topic: "DevOps Practices", requestedBy: "Osaite Emmanuel", category: "Software Engineering", duration: "8 weeks", price: "$240.00", status: "Pending" },
  { id: "10", topic: "Mobile App Development", requestedBy: "Sarah Johnson", category: "Software Engineering", duration: "12 weeks", price: "$280.00", status: "Pending" },
  { id: "11", topic: "Business Intelligence", requestedBy: "Emily Davis", category: "Business", duration: "6 weeks", price: "$160.00", status: "Pending" },
  { id: "12", topic: "Cybersecurity", requestedBy: "James Wilson", category: "Security", duration: "8 weeks", price: "$250.00", status: "Approved" },
  { id: "13", topic: "Data Analytics", requestedBy: "Lisa Anderson", category: "Data Science", duration: "6 weeks", price: "$190.00", status: "Pending" },
  { id: "14", topic: "Software Testing", requestedBy: "David Brown", category: "Software Engineering", duration: "4 weeks", price: "$130.00", status: "Pending" },
  { id: "15", topic: "Agile Project Management", requestedBy: "Anna Martinez", category: "Business", duration: "4 weeks", price: "$110.00", status: "Rejected" },
];

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Data Science", value: "Data Science" },
  { label: "Design", value: "Design" },
  { label: "Security", value: "Security" },
  { label: "Business", value: "Business" },
];

const StatusChip = ({ status }: { status: ReservationStatus }) => {
  const config: Record<ReservationStatus, { bg: string; textColor: string; icon: React.ReactNode }> = {
    Pending: {
      bg: "bg-[#FFF5ED]",
      textColor: "text-[#F2994A]",
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="#F2994A" strokeWidth="1.5" />
          <path d="M6 3.5V6L7.5 7.5" stroke="#F2994A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    Approved: {
      bg: "bg-[#F1F8F2]",
      textColor: "text-[#3C7E44]",
      icon: <TickCircle variant="Bold" size={12} color="#3C7E44" />,
    },
    Rejected: {
      bg: "bg-[#FFEBE5]",
      textColor: "text-[#FF5025]",
      icon: <CloseCircle variant="Bold" size={12} color="#FF5025" />,
    },
  };
  const c = config[status];
  return (
    <div className={`inline-flex items-center gap-[4px] h-[22px] px-[6px] py-[3px] rounded-[6px] ${c.bg}`}>
      {c.icon}
      <span className={`text-[11px] font-normal leading-[14px] ${c.textColor}`}>{status}</span>
    </div>
  );
};

export const AdminReservationView = () => {
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successDesc, setSuccessDesc] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  const handleBulkApprove = () => {
    setShowApproveConfirm(false);
    setSuccessTitle("Topics approved");
    setSuccessDesc(`You have successfully approved ${pendingCount} new ${pendingCount === 1 ? "topic" : "topics"}.`);
    setTimeout(() => setShowSuccess(true), 300);
  };

  const handleBulkReject = () => {
    setShowRejectConfirm(false);
    setSuccessTitle("Topics rejected");
    setSuccessDesc(`${pendingCount} ${pendingCount === 1 ? "topic has" : "topics have"} been rejected.`);
    setTimeout(() => setShowSuccess(true), 300);
  };

  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: "topic",
      header: "Topic",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.topic}</span>
      ),
      size: 273,
    },
    {
      accessorKey: "requestedBy",
      header: "Requested by",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.requestedBy}</span>
      ),
      size: 193,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.category}</span>
      ),
      size: 221,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.duration}</span>
      ),
      size: 99,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.price}</span>
      ),
      size: 170,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusChip status={row.original.status} />,
      size: 98,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="relative flex justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenMenuRow(openMenuRow === row.original.id ? null : row.original.id); }}
            className="p-[6px] rounded-full hover:bg-sd-grey-1 transition-colors cursor-pointer"
          >
            <More variant="Linear" size={24} color="#606060" />
          </button>
          {openMenuRow === row.original.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenMenuRow(null)} />
              <div className="absolute top-[40px] right-0 z-50 bg-[#FDFDFD] border-[0.7px] border-[#F0F0F0] rounded-[10px] p-[8px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)] w-[160px]">
                <div className="flex flex-col">
                  <button
                    className="flex items-center gap-[8px] h-[32px] px-[8px] py-[8px] rounded-[8px] hover:bg-sd-grey-1 transition-colors cursor-pointer w-full"
                    onClick={() => { setOpenMenuRow(null); setPendingCount(1); setShowApproveConfirm(true); }}
                  >
                    <TickCircle variant="Linear" size={16} color="#3C7E44" />
                    <span className="text-[12px] font-normal text-[#3C7E44] leading-[16px]">Approve</span>
                  </button>
                  <button
                    className="flex items-center gap-[8px] h-[32px] px-[8px] py-[8px] rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer w-full"
                    onClick={() => { setOpenMenuRow(null); setPendingCount(1); setShowRejectConfirm(true); }}
                  >
                    <CloseCircle variant="Linear" size={16} color="#D54800" />
                    <span className="text-[12px] font-normal text-[#D54800] leading-[16px]">Reject</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ),
      size: 59,
    },
  ];

  return (
    <>
      <BaseTable
        title="Reservation"
        columns={columns}
        data={data}
        searchPlaceholder="Search course title, ID etc"
        filters={[
          {
            label: "Category",
            icon: <Filter size={20} variant="Linear" color="#606060" />,
            options: categoryOptions,
            onValueChange: () => {},
          },
        ]}
        showDateFilter
        dateFilterInline
        showHeader={false}
        showPagination
        selectable
        ignoreRowClickColumns={["actions"]}
        selectionAction={(selectedCount: number) => (
          <>
            <button
              onClick={() => { setPendingCount(selectedCount); setShowApproveConfirm(true); }}
              className="h-[32px] px-[16px] bg-[#0063EF] text-white text-[12px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => { setPendingCount(selectedCount); setShowRejectConfirm(true); }}
              className="h-[32px] px-[16px] border border-[#D54800] text-[#D54800] text-[12px] font-medium rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
            >
              Reject
            </button>
          </>
        )}
      />

      <ConfirmModal
        isOpen={showApproveConfirm}
        onOpenChange={setShowApproveConfirm}
        title="Approve topics?"
        description={`Are you sure you want to approve ${pendingCount} selected ${pendingCount === 1 ? "topic" : "topics"}?`}
        confirmLabel="Yes, approve"
        variant="primary"
        onConfirm={handleBulkApprove}
      />

      <ConfirmModal
        isOpen={showRejectConfirm}
        onOpenChange={setShowRejectConfirm}
        title="Reject topics?"
        description={`Are you sure you want to reject ${pendingCount} selected ${pendingCount === 1 ? "topic" : "topics"}?`}
        confirmLabel="Yes, reject"
        variant="danger"
        onConfirm={handleBulkReject}
      />

      <Modal isOpen={showSuccess} onOpenChange={setShowSuccess}>
        <div className="flex flex-col items-center gap-[20px] text-center">
          <div className="size-[60px] bg-[#E6F9EF] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#008500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="#008500" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[20px] font-semibold text-[#202020] leading-[28px]">{successTitle}</span>
            <p className="text-[14px] text-[#606060] leading-[20px] max-w-[333px]">{successDesc}</p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="w-full h-[44px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </>
  );
};
