"use client";

import React, { useState } from "react";
import { TickCircle, InfoCircle, More, Filter, Sort } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ColumnDef } from "@tanstack/react-table";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { ProductionStatusChip } from "./components/ProductionStatusChip";
import { ProductionActionsMenu, ProductionAction } from "./components/ProductionActionsMenu";
import { ProductionDetailsDrawer } from "./components/ProductionDetailsDrawer";

interface ProductionCourse {
  id: string;
  source: string;
  title: string;
  courseId: string;
  status: "Complete" | "In-progress" | "Error" | "Draft" | "Paused";
  category: string;
  difficulty: string;
  dateAdded: string;
  dateCreated: string;
}

const data: ProductionCourse[] = [
  { id: "1", source: "AI", title: "Machine Learning and Design", courseId: "Td4fJcvnJ88-04924945", status: "Complete", category: "Software Engineering", difficulty: "Advanced", dateAdded: "21 May 2026", dateCreated: "21 May 2026, 08:43PM" },
  { id: "2", source: "Manual", title: "Introduction to Software Development", courseId: "SLD-Rf34-3d55-09dE", status: "In-progress", category: "Software Engineering", difficulty: "Beginner", dateAdded: "20 May 2026", dateCreated: "20 May 2026, 10:15AM" },
  { id: "3", source: "AI", title: "Advanced Python Programming", courseId: "PY-Adv-8842-113a", status: "Error", category: "Data Science", difficulty: "Advanced", dateAdded: "19 May 2026", dateCreated: "19 May 2026, 02:30PM" },
  { id: "4", source: "Manual", title: "UI/UX Design Fundamentals", courseId: "UI-UX-7731-224b", status: "Complete", category: "Design", difficulty: "Intermediate", dateAdded: "18 May 2026", dateCreated: "18 May 2026, 09:00AM" },
  { id: "5", source: "AI", title: "Data Science with Python", courseId: "DS-PY-6620-335c", status: "Paused", category: "Data Science", difficulty: "Intermediate", dateAdded: "17 May 2026", dateCreated: "17 May 2026, 11:45AM" },
  { id: "6", source: "Manual", title: "Cloud Architecture", courseId: "CLD-5519-446d", status: "Draft", category: "Software Engineering", difficulty: "Advanced", dateAdded: "16 May 2026", dateCreated: "16 May 2026, 04:20PM" },
  { id: "7", source: "AI", title: "Network Security", courseId: "SEC-4408-557e", status: "In-progress", category: "Security", difficulty: "Intermediate", dateAdded: "15 May 2026", dateCreated: "15 May 2026, 08:00AM" },
  { id: "8", source: "Manual", title: "Digital Marketing", courseId: "MKT-3397-668f", status: "Complete", category: "Business", difficulty: "Beginner", dateAdded: "14 May 2026", dateCreated: "14 May 2026, 01:10PM" },
  { id: "9", source: "AI", title: "Blockchain Basics", courseId: "BLC-2286-779g", status: "In-progress", category: "Software Engineering", difficulty: "Beginner", dateAdded: "13 May 2026", dateCreated: "13 May 2026, 03:30PM" },
  { id: "10", source: "Manual", title: "Project Management", courseId: "PM-1175-880h", status: "Error", category: "Business", difficulty: "Intermediate", dateAdded: "12 May 2026", dateCreated: "12 May 2026, 10:00AM" },
  { id: "11", source: "AI", title: "DevOps Practices", courseId: "DEV-0064-991i", status: "Complete", category: "Software Engineering", difficulty: "Advanced", dateAdded: "11 May 2026", dateCreated: "11 May 2026, 07:45PM" },
  { id: "12", source: "Manual", title: "Mobile App Development", courseId: "MOB-8953-002j", status: "Paused", category: "Software Engineering", difficulty: "Intermediate", dateAdded: "10 May 2026", dateCreated: "10 May 2026, 12:00PM" },
  { id: "13", source: "AI", title: "Business Intelligence", courseId: "BI-7842-113k", status: "Draft", category: "Data Science", difficulty: "Advanced", dateAdded: "09 May 2026", dateCreated: "09 May 2026, 05:30PM" },
];

const categoryOptions = [
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Data Science", value: "Data Science" },
  { label: "Design", value: "Design" },
  { label: "Security", value: "Security" },
  { label: "Business", value: "Business" },
];

const statusOptions = [
  { label: "Complete", value: "Complete" },
  { label: "In-progress", value: "In-progress" },
  { label: "Error", value: "Error" },
  { label: "Draft", value: "Draft" },
  { label: "Paused", value: "Paused" },
];

export const ProductionView = () => {
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<ProductionCourse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmStop, setConfirmStop] = useState<ProductionCourse | null>(null);
  const [showStopSuccess, setShowStopSuccess] = useState(false);

  const handleAction = (course: ProductionCourse, action: ProductionAction) => {
    if (action === "view") {
      setSelectedCourse(course);
      setIsDrawerOpen(true);
    } else if (action === "stop") {
      setConfirmStop(course);
    } else if (action === "pause") {
      // Pause action
    }
  };

  const confirmStopProduction = () => {
    setConfirmStop(null);
    setTimeout(() => setShowStopSuccess(true), 300);
  };

  const columns: ColumnDef<ProductionCourse>[] = [
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.source}</span>
      ),
      size: 167,
    },
    {
      accessorKey: "title",
      header: "Course Title",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.title}</span>
      ),
      size: 234,
    },
    {
      accessorKey: "courseId",
      header: "Course ID",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] font-mono text-[12px]">{row.original.courseId}</span>
      ),
      size: 171,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ProductionStatusChip status={row.original.status} />,
      size: 187,
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty Level",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.difficulty}</span>
      ),
      size: 139,
    },
    {
      accessorKey: "dateAdded",
      header: "Date Added",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.dateAdded}</span>
      ),
      size: 168,
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
            <ProductionActionsMenu
              onClose={() => setOpenMenuRow(null)}
              onAction={(action) => handleAction(row.original, action)}
            />
          )}
        </div>
      ),
      size: 61,
    },
  ];

  return (
    <>
      <ProductionDetailsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        course={selectedCourse}
      />

      <div className="flex flex-col gap-[24px]">
        {/* Stats Cards */}
        <div className="flex gap-[16px] flex-wrap">
          <AdminStatCard
            icon={<TickCircle variant="Bold" size={20} color="#202020" />}
            label="Total Produced"
            value="20"
          />
          <AdminStatCard
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#202020" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            }
            label="In-Progress"
            value="100"
          />
          <AdminStatCard
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="3" width="3.5" height="14" rx="1" fill="#202020" />
                <rect x="11.5" y="3" width="3.5" height="14" rx="1" fill="#202020" />
              </svg>
            }
            label="Paused"
            value="12"
          />
          <AdminStatCard
            icon={<InfoCircle variant="Linear" size={20} color="#202020" />}
            label="Error"
            value="3"
          />
        </div>

        {/* Table */}
        <BaseTable
          title="Production"
          columns={columns}
          data={data}
          searchPlaceholder="Search course title, ID etc"
          filters={[
            {
              label: "Category",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              searchable: true,
              searchPlaceholder: "Search category",
              options: categoryOptions,
              onValueChange: () => {},
            },
            {
              label: "Status",
              icon: <Sort size={20} variant="Linear" color="#606060" />,
              options: statusOptions,
              onValueChange: () => {},
            },
          ]}
          showHeader={false}
          showPagination
          ignoreRowClickColumns={["actions"]}
          onRowClick={(course) => {
            setSelectedCourse(course);
            setIsDrawerOpen(true);
          }}
        />
      </div>

      {/* Stop Production Confirmation */}
      <ConfirmModal
        isOpen={!!confirmStop}
        onOpenChange={(open) => { if (!open) setConfirmStop(null); }}
        title="Stop production?"
        description="Are you sure you want to stop production? Once initiated the process is irreversible."
        confirmLabel="Yes, stop"
        variant="danger"
        onConfirm={confirmStopProduction}
      />

      {/* Stop Success Modal */}
      <Modal
        isOpen={showStopSuccess}
        onOpenChange={setShowStopSuccess}
      >
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div className="size-[80px] rounded-full bg-[#EBF7EE] flex items-center justify-center">
            <TickCircle variant="Bold" size={48} color="#008500" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[28px] font-semibold text-[#202020] leading-tight">Production stopped!</span>
            <p className="text-[14px] text-[#606060] leading-normal max-w-[320px]">
              Production has been stopped successfully.
            </p>
          </div>
          <button
            onClick={() => setShowStopSuccess(false)}
            className="w-full h-[44px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer mt-[8px]"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
};
