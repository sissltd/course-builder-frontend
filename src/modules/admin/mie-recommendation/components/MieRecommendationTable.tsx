"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { RecommendationDetailsDrawer } from "./RecommendationDetailsDrawer";
import { ColumnDef } from "@tanstack/react-table";
import { Filter, Sort, TickCircle, CloseCircle } from "iconsax-react";

export interface MieRecommendation {
  id: string;
  topic: string;
  category: string;
  difficultyLevel: string;
  demandScore: number;
  searchesPerMonth: string;
}

const data: MieRecommendation[] = [
  { id: "1", topic: "Introduction to Software design", category: "Software Engineering", difficultyLevel: "Advanced", demandScore: 69, searchesPerMonth: "52k" },
  { id: "2", topic: "Advanced Python Programming", category: "Software Development", difficultyLevel: "Advanced", demandScore: 88, searchesPerMonth: "123k" },
  { id: "3", topic: "Data Structures & Algorithms", category: "Computer Science", difficultyLevel: "Intermediate", demandScore: 85, searchesPerMonth: "112k" },
  { id: "4", topic: "Cloud Architecture Fundamentals", category: "Cloud Computing", difficultyLevel: "Intermediate", demandScore: 78, searchesPerMonth: "98k" },
  { id: "5", topic: "Cybersecurity Best Practices", category: "Cybersecurity", difficultyLevel: "Beginner", demandScore: 95, searchesPerMonth: "187k" },
  { id: "6", topic: "Database Design & Management", category: "Information Technology", difficultyLevel: "Intermediate", demandScore: 72, searchesPerMonth: "84k" },
  { id: "7", topic: "UI/UX Design Principles", category: "Design", difficultyLevel: "Beginner", demandScore: 81, searchesPerMonth: "105k" },
  { id: "8", topic: "DevOps & CI/CD Pipeline", category: "Cloud Computing", difficultyLevel: "Advanced", demandScore: 76, searchesPerMonth: "91k" },
  { id: "9", topic: "Natural Language Processing", category: "Artificial Intelligence", difficultyLevel: "Advanced", demandScore: 90, searchesPerMonth: "141k" },
  { id: "10", topic: "Blockchain Development", category: "Software Development", difficultyLevel: "Intermediate", demandScore: 68, searchesPerMonth: "72k" },
  { id: "11", topic: "Mobile App Development", category: "Software Development", difficultyLevel: "Intermediate", demandScore: 84, searchesPerMonth: "116k" },
  { id: "12", topic: "Network Administration", category: "Information Technology", difficultyLevel: "Beginner", demandScore: 65, searchesPerMonth: "68k" },
  { id: "13", topic: "Agile Project Management", category: "Business", difficultyLevel: "Beginner", demandScore: 73, searchesPerMonth: "89k" },
  { id: "14", topic: "TensorFlow for Deep Learning", category: "Artificial Intelligence", difficultyLevel: "Advanced", demandScore: 87, searchesPerMonth: "132k" },
  { id: "15", topic: "Linux System Administration", category: "Information Technology", difficultyLevel: "Intermediate", demandScore: 71, searchesPerMonth: "79k" },
];

export const mieRecommendationColumns = ({
  onApprove,
  onReject,
}: {
  onApprove: (row: MieRecommendation) => void;
  onReject: (row: MieRecommendation) => void;
}): ColumnDef<MieRecommendation>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={(e) => {
          e.stopPropagation();
          table.getToggleAllRowsSelectedHandler()(e);
        }}
        className="size-[18px] accent-[#0063EF] cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => {
          e.stopPropagation();
          row.getToggleSelectedHandler()(e);
        }}
        className="size-[18px] accent-[#0063EF] cursor-pointer"
      />
    ),
    size: 40,
  },
  {
    accessorKey: "topic",
    header: "Topics",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
        {row.original.topic}
      </span>
    ),
    size: 250,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
        {row.original.category}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "difficultyLevel",
    header: "Difficulty level",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
        {row.original.difficultyLevel}
      </span>
    ),
    size: 178,
  },
  {
    accessorKey: "demandScore",
    header: "Demand Score",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#008500] font-normal tracking-[-0.28px] leading-[20px]">
        {row.original.demandScore}
      </span>
    ),
    size: 115,
  },
  {
    accessorKey: "searchesPerMonth",
    header: "Searches Per month",
    cell: ({ row }) => (
      <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
        {row.original.searchesPerMonth}
      </span>
    ),
    size: 206,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-[8px] items-start">
        <div
          className="border border-[#F0F0F0] flex gap-[8px] h-[32px] items-center justify-center p-[8px] rounded-[8px] cursor-pointer hover:bg-sd-grey-1 transition-colors"
          onClick={() => onReject(row.original)}
        >
          <CloseCircle variant="Linear" size={16} color="#D54800" />
          <span className="text-[12px] font-normal text-[#202020] leading-[16px]">Reject</span>
        </div>
        <div
          className="border border-[#F0F0F0] flex gap-[8px] h-[32px] items-center justify-center p-[8px] rounded-[8px] cursor-pointer hover:bg-sd-grey-1 transition-colors"
          onClick={() => onApprove(row.original)}
        >
          <TickCircle variant="Linear" size={16} color="#008500" />
          <span className="text-[12px] font-normal text-[#202020] leading-[16px]">Approve</span>
        </div>
      </div>
    ),
    size: 194,
  },
];

export const MieRecommendationTable = () => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<"approve" | "reject">("approve");
  const [selectedTopic, setSelectedTopic] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleRowApprove = (row: MieRecommendation) => {
    setConfirmAction("approve");
    setSelectedTopic(row.topic);
    setIsConfirmOpen(true);
  };

  const handleRowReject = (row: MieRecommendation) => {
    setConfirmAction("reject");
    setSelectedTopic(row.topic);
    setIsConfirmOpen(true);
  };

  const handleRowClick = (row: MieRecommendation) => {
    const idx = data.findIndex((d) => d.id === row.id);
    setCurrentIndex(idx);
    setDrawerOpen(true);
  };

  const currentRecommendation = data[currentIndex];

  const isApprove = confirmAction === "approve";

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={isApprove ? "Approve Recommendation" : "Reject Recommendation"}
        description={
          isApprove
            ? `Are you sure you want to approve "${selectedTopic}"?`
            : `Are you sure you want to reject "${selectedTopic}"?`
        }
        confirmLabel={isApprove ? "Approve" : "Reject"}
        variant={isApprove ? "primary" : "danger"}
        onConfirm={() => setIsConfirmOpen(false)}
      />
      <RecommendationDetailsDrawer
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        recommendation={currentRecommendation}
        onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        onNext={() => setCurrentIndex((i) => Math.min(data.length - 1, i + 1))}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < data.length - 1}
      />
      <BaseTable
      title="MIE Recommendation"
      columns={mieRecommendationColumns({ onApprove: handleRowApprove, onReject: handleRowReject })}
      data={data}
      searchPlaceholder="Search recommendations"
      filters={[
        {
          label: "Category",
          icon: <Filter size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Software Engineering", value: "Software Engineering" },
            { label: "Software Development", value: "Software Development" },
            { label: "Computer Science", value: "Computer Science" },
            { label: "Cloud Computing", value: "Cloud Computing" },
            { label: "Cybersecurity", value: "Cybersecurity" },
            { label: "Artificial Intelligence", value: "Artificial Intelligence" },
            { label: "Information Technology", value: "Information Technology" },
            { label: "Design", value: "Design" },
            { label: "Business", value: "Business" },
          ],
          onValueChange: (val) => {},
        },
        {
          label: "Difficulty Level",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Beginner", value: "Beginner" },
            { label: "Intermediate", value: "Intermediate" },
            { label: "Advanced", value: "Advanced" },
          ],
          onValueChange: (val) => {},
        },
      ]}
      showDateFilter
      dateFilterInline
      showHeader={false}
      showPagination
      onRowClick={handleRowClick}
      ignoreRowClickColumns={["select", "actions"]}
      toolbarAction={(selectedCount) => (
        <button
          disabled={selectedCount === 0}
          onClick={() => {
            setConfirmAction("approve");
            setSelectedTopic(`${selectedCount} selected recommendations`);
            setIsConfirmOpen(true);
          }}
          className={`flex items-center gap-[8px] h-[40px] px-[20px] py-[10px] rounded-[8px] text-[14px] font-normal tracking-[-0.28px] leading-[20px] transition-colors ${
            selectedCount > 0
              ? "bg-[#0063EF] text-white hover:bg-[#0052CC] cursor-pointer"
              : "bg-[#D9D9D9] text-[#B6B6B6] cursor-not-allowed"
          }`}
        >
          Approve
        </button>
      )}
    />
    </>
  );
};
