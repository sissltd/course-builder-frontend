"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FolderClosed, SquareTerminal } from "lucide-react";
import { Archive, Element3, More, TickCircle } from "iconsax-react";
import { format } from "date-fns";
import { BaseTable } from "@/components/shared/BaseTable";
import { TabBar, TabBarItem } from "@/components/shared/TabBar";
import { Button as AppButton } from "@/components/shared/Button";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { CategoryActionMenu } from "./components/CategoryActionMenu";
import { CategoryDetailsDrawer } from "./components/CategoryDetailsDrawer";
import { CreateCategoryModal } from "./components/CreateCategoryModal";
import { EditCategoryModal } from "./components/EditCategoryModal";
import { ArchiveCategoryModal } from "./components/ArchiveCategoryModal";
import { DeleteCategoryModal } from "./components/DeleteCategoryModal";
import type { CategoryDetails } from "./components/CategoryDetailsDrawer";

type CategoryTrack = "all" | "creator-preferred" | "ai-preferred" | "open" | "archive";

interface CategoryRow {
  id: string;
  category: string;
  track: Exclude<CategoryTrack, "all">;
  beginnerPrice: string;
  intermediatePrice: string;
  advancedPrice: string;
  totalCourses: number;
  createdAt: string;
  createdDate: string;
}

const tabs: TabBarItem[] = [
  { key: "all", label: "All" },
  { key: "creator-preferred", label: "Creator Preferred" },
  { key: "ai-preferred", label: "AI Preferred" },
  { key: "open", label: "Open" },
  { key: "archive", label: "Archive" },
];

const categoryRows: CategoryRow[] = [
  { id: "1", category: "Software Engineering", track: "open", beginnerPrice: "Beg $300", intermediatePrice: "Int $400", advancedPrice: "Adv $500", totalCourses: 23, createdAt: "15 May 2026, 03:40PM", createdDate: "2026-05-15" },
  { id: "2", category: "Product Design", track: "creator-preferred", beginnerPrice: "Beg $260", intermediatePrice: "Int $360", advancedPrice: "Adv $460", totalCourses: 18, createdAt: "15 May 2026, 03:40PM", createdDate: "2026-05-15" },
  { id: "3", category: "Data Analysis", track: "ai-preferred", beginnerPrice: "Beg $320", intermediatePrice: "Int $420", advancedPrice: "Adv $520", totalCourses: 16, createdAt: "16 May 2026, 09:25AM", createdDate: "2026-05-16" },
  { id: "4", category: "Cyber Security", track: "creator-preferred", beginnerPrice: "Beg $290", intermediatePrice: "Int $390", advancedPrice: "Adv $490", totalCourses: 14, createdAt: "17 May 2026, 12:10PM", createdDate: "2026-05-17" },
  { id: "5", category: "Mobile Development", track: "creator-preferred", beginnerPrice: "Beg $310", intermediatePrice: "Int $410", advancedPrice: "Adv $510", totalCourses: 19, createdAt: "18 May 2026, 11:00AM", createdDate: "2026-05-18" },
  { id: "6", category: "Cloud Computing", track: "creator-preferred", beginnerPrice: "Beg $340", intermediatePrice: "Int $440", advancedPrice: "Adv $540", totalCourses: 21, createdAt: "19 May 2026, 05:20PM", createdDate: "2026-05-19" },
  { id: "7", category: "Business Strategy", track: "creator-preferred", beginnerPrice: "Beg $250", intermediatePrice: "Int $350", advancedPrice: "Adv $450", totalCourses: 11, createdAt: "20 May 2026, 10:30AM", createdDate: "2026-05-20" },
  { id: "8", category: "UI Animation", track: "creator-preferred", beginnerPrice: "Beg $280", intermediatePrice: "Int $380", advancedPrice: "Adv $480", totalCourses: 9, createdAt: "21 May 2026, 02:15PM", createdDate: "2026-05-21" },
  { id: "9", category: "DevOps", track: "creator-preferred", beginnerPrice: "Beg $305", intermediatePrice: "Int $405", advancedPrice: "Adv $505", totalCourses: 17, createdAt: "22 May 2026, 08:45AM", createdDate: "2026-05-22" },
  { id: "10", category: "Content Marketing", track: "creator-preferred", beginnerPrice: "Beg $240", intermediatePrice: "Int $340", advancedPrice: "Adv $440", totalCourses: 12, createdAt: "23 May 2026, 04:05PM", createdDate: "2026-05-23" },
  { id: "11", category: "Archived Finance", track: "archive", beginnerPrice: "Beg $220", intermediatePrice: "Int $320", advancedPrice: "Adv $420", totalCourses: 6, createdAt: "24 May 2026, 01:00PM", createdDate: "2026-05-24" },
];

const totalCategories = "205";
const activeCategories = "200";
const archivedCategories = "3";

const TrackChip = ({ track }: { track: CategoryRow["track"] }) => {
  const chipStyles: Record<CategoryRow["track"], string> = {
    open: "bg-[var(--sd-blue-soft)] text-sd-blue",
    "creator-preferred": "bg-[var(--sd-success-soft)] text-[var(--sd-success-strong)]",
    "ai-preferred": "bg-[var(--sd-purple-soft)] text-[var(--sd-purple)]",
    archive: "bg-sd-grey-3 text-sd-grey-11",
  };

  const trackLabels: Record<CategoryRow["track"], string> = {
    open: "Open",
    "creator-preferred": "Creator Preferred",
    "ai-preferred": "AI Preferred",
    archive: "Archive",
  };

  return (
    <span className={`inline-flex items-center rounded-[8px] px-[8px] py-[3px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] ${chipStyles[track]}`}>
      {trackLabels[track]}
    </span>
  );
};

const PriceChip = ({ value }: { value: string }) => (
  <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[var(--sd-grey-18)] px-[8px] text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">
    {value}
  </span>
);

export const CategoriesView = () => {
  const [activeTab, setActiveTab] = useState<CategoryTrack>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDetails | null>(null);
  const [archivingCategory, setArchivingCategory] = useState<CategoryDetails | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryDetails | null>(null);

  const filteredRows = useMemo(() => {
    return categoryRows.filter((row) => {
      const matchesTab = activeTab === "all" ? true : row.track === activeTab;
      const matchesDate = selectedDate ? row.createdDate === format(selectedDate, "yyyy-MM-dd") : true;

      return matchesTab && matchesDate;
    });
  }, [activeTab, selectedDate]);

  const selectedCategoryIndex = filteredRows.findIndex((row) => row.id === selectedCategoryId);
  const selectedCategory = selectedCategoryIndex >= 0 ? filteredRows[selectedCategoryIndex] : null;

  const openEditModal = (category: CategoryDetails) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const openArchiveModal = (category: CategoryDetails) => {
    setArchivingCategory(category);
    setIsArchiveModalOpen(true);
  };

  const openDeleteModal = (category: CategoryDetails) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleAction = (action: "edit" | "archive" | "delete", categoryId: string) => {
    const category = filteredRows.find((row) => row.id === categoryId);
    if (!category) return;

    if (action === "edit") {
      openEditModal(category);
      setOpenMenuRow(null);
    }

    if (action === "archive") {
      openArchiveModal(category);
      setOpenMenuRow(null);
    }

    if (action === "delete") {
      openDeleteModal(category);
      setOpenMenuRow(null);
    }
  };

  const columns: ColumnDef<CategoryRow>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-[16px]">
          <div className="shrink-0">
            <SquareTerminal size={20} color="var(--sd-grey-7)" strokeWidth={1.6} />
          </div>
          <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
            {row.original.category}
          </span>
        </div>
      ),
      size: 320,
    },
    {
      accessorKey: "track",
      header: "Track",
      cell: ({ row }) => <TrackChip track={row.original.track} />,
      size: 180,
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-[8px]">
          <PriceChip value={row.original.beginnerPrice} />
          <PriceChip value={row.original.intermediatePrice} />
          <PriceChip value={row.original.advancedPrice} />
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "totalCourses",
      header: "Total Courses",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.totalCourses}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: "Date created",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
          {row.original.createdAt}
        </span>
      ),
      size: 220,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="relative flex justify-center">
          <AppButton
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-[28px] rounded-full hover:bg-[var(--sd-grey-17)]"
            aria-label="Category actions"
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenuRow((current) => (current === row.original.id ? null : row.original.id));
            }}
          >
            <More size={20} variant="Linear" color="var(--sd-grey-11)" />
          </AppButton>
          {openMenuRow === row.original.id && (
            <CategoryActionMenu
              onClose={() => setOpenMenuRow(null)}
              onAction={(action) => handleAction(action, row.original.id)}
            />
          )}
        </div>
      ),
      size: 80,
    },
  ];

  return (
    <>
      <CreateCategoryModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
        category={editingCategory}
      />
      <ArchiveCategoryModal
        isOpen={isArchiveModalOpen}
        onOpenChange={(open) => {
          setIsArchiveModalOpen(open);
          if (!open) {
            setArchivingCategory(null);
          }
        }}
        categoryName={archivingCategory?.category}
      />
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setDeletingCategory(null);
          }
        }}
        categoryName={deletingCategory?.category}
      />

      {selectedCategory && (
        <CategoryDetailsDrawer
          key={selectedCategory.id}
          isOpen={!!selectedCategory}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedCategoryId(null);
            }
          }}
          category={selectedCategory}
          onEdit={() => {
            if (!selectedCategory) return;
            openEditModal(selectedCategory);
          }}
          canPrevious={selectedCategoryIndex > 0}
          canNext={selectedCategoryIndex >= 0 && selectedCategoryIndex < filteredRows.length - 1}
          onPrevious={() => {
            if (selectedCategoryIndex > 0) {
              setSelectedCategoryId(filteredRows[selectedCategoryIndex - 1].id);
            }
          }}
          onNext={() => {
            if (selectedCategoryIndex >= 0 && selectedCategoryIndex < filteredRows.length - 1) {
              setSelectedCategoryId(filteredRows[selectedCategoryIndex + 1].id);
            }
          }}
        />
      )}

      <div className="flex flex-col gap-[38px]">
        <div className="grid gap-[14px] xl:grid-cols-3">
          <AdminStatCard
            icon={<Element3 size={20} variant="Bold" color="var(--sd-blue-strong)" />}
            label="Total Category"
            value={totalCategories}
            className="h-[104px] rounded-[14px] border-[var(--sd-card-border)] px-[18px] py-[14px] shadow-none"
            headerClassName="items-center"
            bodyClassName="gap-[10px]"
            labelClassName="text-[var(--sd-grey-15)]"
            valueClassName="text-[18px] font-medium leading-[28px] tracking-[-0.4px]"
          />
          <AdminStatCard
            icon={<TickCircle size={20} variant="Bold" color="var(--sd-success)" />}
            label="Active Category"
            value={activeCategories}
            className="h-[104px] rounded-[14px] border-[var(--sd-card-border)] px-[18px] py-[14px] shadow-none"
            headerClassName="items-center"
            bodyClassName="gap-[10px]"
            labelClassName="text-[var(--sd-grey-15)]"
            valueClassName="text-[18px] font-medium leading-[28px] tracking-[-0.4px]"
          />
          <AdminStatCard
            icon={
              <FolderClosed
                size={20}
                color="var(--sd-grey-11)"
                strokeWidth={1.7}
                className="[&_*]:fill-[var(--sd-grey-11)] [&_*]:stroke-[var(--sd-grey-11)]"
              />
            }
            label="Archived Category"
            value={archivedCategories}
            className="h-[104px] rounded-[14px] border-[var(--sd-card-border)] px-[18px] py-[14px] shadow-none"
            headerClassName="items-center"
            bodyClassName="gap-[10px]"
            labelClassName="text-[var(--sd-grey-15)]"
            valueClassName="text-[18px] font-medium leading-[28px] tracking-[-0.4px]"
          />
        </div>

        <BaseTable
          title="Categories"
          columns={columns}
          data={filteredRows}
          className="border-none bg-transparent p-0 shadow-none rounded-none gap-[18px]"
          toolbarClassName="gap-0"
          contentClassName="rounded-[12px] overflow-hidden"
          headerRowClassName="border-none bg-[var(--sd-grey-16)] hover:bg-[var(--sd-grey-16)]"
          headerCellClassName="h-[40px] bg-[var(--sd-grey-16)] px-[12px] text-[14px] font-normal text-[var(--sd-grey-14)] leading-[20px] tracking-[-0.28px]"
          rowClassName="h-[48px] bg-transparent hover:bg-transparent"
          cellClassName="px-[12px] py-[12px]"
          showHeader={false}
          searchPlaceholder="Search category"
          showDateFilter
          dateFilterInline
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          ignoreRowClickColumns={["actions"]}
          onRowClick={(row) => {
            setOpenMenuRow(null);
            setSelectedCategoryId(row.id);
          }}
          emptyText="No categories found"
          topContent={
            <TabBar
              tabs={tabs}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as CategoryTrack)}
              className="border-sd-grey-6"
              tabClassName="h-[38px] px-[14px] text-[14px] font-normal leading-[20px]"
              activeTabClassName="text-sd-grey-12"
              inactiveTabClassName="text-sd-grey-8"
              indicatorClassName="h-[2px] bg-sd-grey-12"
            />
          }
          toolbarAction={
            <AppButton
              variant="app-primary"
              size="app"
              className="h-[40px] min-w-[152px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              onClick={() => setIsCreateModalOpen(true)}
            >
              New category
            </AppButton>
          }
        />
      </div>
    </>
  );
};
