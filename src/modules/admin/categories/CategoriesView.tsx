"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FolderClosed } from "lucide-react";
import { Element3, More, TickCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { TabBar, TabBarItem } from "@/components/shared/TabBar";
import { Button as AppButton } from "@/components/shared/Button";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import {
  useGetCategoriesQuery,
  useGetCategoryStatsQuery,
} from "@/modules/categories/api/categoriesApi";
import {
  CategoryStatus,
  TrackPreference,
  type Category,
  type CategoryListParams,
} from "@/modules/categories/types";
import { formatCategoryDate, formatNaira } from "@/modules/categories/lib/format";
import { CategoryIcon } from "@/modules/categories/lib/categoryIcons";
import { CategoryActionMenu, type CategoryAction } from "./components/CategoryActionMenu";
import { CategoryDetailsDrawer } from "./components/CategoryDetailsDrawer";
import { CreateCategoryModal } from "./components/CreateCategoryModal";
import { EditCategoryModal } from "./components/EditCategoryModal";
import { ArchiveCategoryModal } from "./components/ArchiveCategoryModal";
import { DeleteCategoryModal } from "./components/DeleteCategoryModal";

type CategoryTabKey = "all" | "creator-preferred" | "ai-preferred" | "open" | "archive";

const tabs: TabBarItem[] = [
  { key: "all", label: "All" },
  { key: "creator-preferred", label: "Creator Preferred" },
  { key: "ai-preferred", label: "AI Preferred" },
  { key: "open", label: "Open" },
  { key: "archive", label: "Archive" },
];


const TAB_PARAMS: Record<
  CategoryTabKey,
  Pick<CategoryListParams, "track_preference" | "status">
> = {
  all: {},
  "creator-preferred": { track_preference: TrackPreference.CREATOR_PREFERRED },
  "ai-preferred": { track_preference: TrackPreference.AI_PREFERRED },
  open: { track_preference: TrackPreference.OPEN },
  archive: { status: CategoryStatus.ARCHIVED },
};

const TRACK_CHIP_STYLES: Record<TrackPreference, string> = {
  [TrackPreference.OPEN]: "bg-[var(--sd-blue-light)] text-sd-blue",
  [TrackPreference.CREATOR_PREFERRED]: "bg-[var(--sd-success-bg)] text-[var(--sd-success-text)]",
  [TrackPreference.AI_PREFERRED]: "bg-[var(--sd-purple-bg)] text-[var(--sd-purple-text)]",
};

const TRACK_CHIP_LABELS: Record<TrackPreference, string> = {
  [TrackPreference.OPEN]: "Open",
  [TrackPreference.CREATOR_PREFERRED]: "Creator Preferred",
  [TrackPreference.AI_PREFERRED]: "AI Preferred",
};

const TrackChip = ({ category }: { category: Category }) => {
  // An archived row is better described by that than by its track.
  const isArchived = category.status === CategoryStatus.ARCHIVED;
  const styles = isArchived
    ? "bg-sd-grey-3 text-sd-grey-11"
    : TRACK_CHIP_STYLES[category.track_preference];
  const label = isArchived
    ? "Archived"
    : TRACK_CHIP_LABELS[category.track_preference] ?? category.track_preference;

  return (
    <span
      className={`inline-flex items-center rounded-[8px] px-[8px] py-[3px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] ${styles}`}
    >
      {label}
    </span>
  );
};

const PriceChip = ({ value }: { value: string }) => (
  <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[var(--sd-grey-18)] px-[8px] text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">
    {value}
  </span>
);

export const CategoriesView = () => {
  const [activeTab, setActiveTab] = useState<CategoryTabKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [archivingCategory, setArchivingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const queryParams = useMemo<CategoryListParams>(
    () => ({
      ...TAB_PARAMS[activeTab],
      ordering: "-created_datetime",
      page,
      size: pageSize,
    }),
    [activeTab, page, pageSize],
  );

  const { data, isLoading } = useGetCategoriesQuery(queryParams);
  const { data: stats } = useGetCategoryStatsQuery();

  const categories = useMemo(() => data?.data?.results ?? [], [data]);
  const paginator = data?.data?.paginator;
  const totalPages = paginator?.total_pages ?? 1;

  const selectedCategoryIndex = categories.findIndex((row) => row.id === selectedCategoryId);
  const selectedCategory = selectedCategoryIndex >= 0 ? categories[selectedCategoryIndex] : null;

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleAction = (action: CategoryAction, category: Category) => {
    setOpenMenuRow(null);

    if (action === "edit") {
      openEditModal(category);
      return;
    }

    if (action === "archive" || action === "unarchive") {
      setArchivingCategory(category);
      setIsArchiveModalOpen(true);
      return;
    }

    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-[16px]">
          <div className="shrink-0">
            <CategoryIcon
              name={row.original.icon}
              size={20}
              color="var(--sd-grey-7)"
              strokeWidth={1.6}
            />
          </div>
          <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
            {row.original.name}
          </span>
        </div>
      ),
      size: 320,
    },
    {
      accessorKey: "track_preference",
      header: "Track",
      cell: ({ row }) => <TrackChip category={row.original} />,
      size: 180,
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-[8px]">
          <PriceChip value={formatNaira(row.original.creator_price_beginner)} />
          <PriceChip value={formatNaira(row.original.creator_price_intermediate)} />
          <PriceChip value={formatNaira(row.original.creator_price_advanced)} />
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "total_courses",
      header: "Total Courses",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.total_courses}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: "created_datetime",
      header: "Date created",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
          {formatCategoryDate(row.original.created_datetime)}
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
              status={row.original.status}
              onClose={() => setOpenMenuRow(null)}
              onAction={(action) => handleAction(action, row.original)}
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
        key={editingCategory?.id ?? "edit-category"}
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
        key={`${archivingCategory?.id ?? "archive"}-${archivingCategory?.status ?? ""}`}
        isOpen={isArchiveModalOpen}
        onOpenChange={(open) => {
          setIsArchiveModalOpen(open);
          if (!open) {
            setArchivingCategory(null);
          }
        }}
        category={archivingCategory}
        mode={archivingCategory?.status === CategoryStatus.ARCHIVED ? "unarchive" : "archive"}
      />
      {/* Keyed so the strategy choice and impact preview reset per category. */}
      <DeleteCategoryModal
        key={deletingCategory?.id ?? "delete-category"}
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setDeletingCategory(null);
          }
        }}
        category={deletingCategory}
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
          canNext={selectedCategoryIndex >= 0 && selectedCategoryIndex < categories.length - 1}
          onPrevious={() => {
            if (selectedCategoryIndex > 0) {
              setSelectedCategoryId(categories[selectedCategoryIndex - 1].id);
            }
          }}
          onNext={() => {
            if (selectedCategoryIndex >= 0 && selectedCategoryIndex < categories.length - 1) {
              setSelectedCategoryId(categories[selectedCategoryIndex + 1].id);
            }
          }}
        />
      )}

      <div className="flex flex-col gap-[38px]">
        <div className="grid gap-[14px] xl:grid-cols-3">
          <AdminStatCard
            icon={<Element3 size={20} variant="Bold" color="var(--sd-blue-dark)" />}
            label="Total Category"
            value={stats ? String(stats.total) : "—"}
            className="h-[104px] rounded-[14px] border-[var(--sd-card-border)] px-[18px] py-[14px] shadow-none"
            headerClassName="items-center"
            bodyClassName="gap-[10px]"
            labelClassName="text-[var(--sd-grey-15)]"
            valueClassName="text-[18px] font-medium leading-[28px] tracking-[-0.4px]"
          />
          <AdminStatCard
            icon={<TickCircle size={20} variant="Bold" color="var(--sd-success)" />}
            label="Active Category"
            value={stats ? String(stats.active) : "—"}
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
            value={stats ? String(stats.archived) : "—"}
            className="h-[104px] rounded-[14px] border-[var(--sd-card-border)] px-[18px] py-[14px] shadow-none"
            headerClassName="items-center"
            bodyClassName="gap-[10px]"
            labelClassName="text-[var(--sd-grey-15)]"
            valueClassName="text-[18px] font-medium leading-[28px] tracking-[-0.4px]"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <BaseTable
              title="Categories"
              columns={columns}
              data={categories}
              className="border-none bg-transparent p-0 shadow-none rounded-none gap-[18px]"
              toolbarClassName="gap-0"
              contentClassName="rounded-[12px] overflow-hidden"
              headerRowClassName="border-none bg-[var(--sd-grey-16)] hover:bg-[var(--sd-grey-16)]"
              headerCellClassName="h-[40px] bg-[var(--sd-grey-16)] px-[12px] text-[14px] font-normal text-[var(--sd-grey-14)] leading-[20px] tracking-[-0.28px]"
              rowClassName="h-[48px] bg-transparent hover:bg-transparent"
              cellClassName="px-[12px] py-[12px]"
              showHeader={false}
              searchPlaceholder="Search category"
              /*
                The list endpoint has no `search` param, so BaseTable's own filter
                is the whole story here — it narrows the loaded page only. No
                `onSearchChange`, because there is nothing to send it to.
              */
              showPagination={false}
              /*
                The server paginates. BaseTable installs its own paginator with a
                default page size of 10, which would silently truncate the page
                once `pageSize` exceeds that, so its state is pinned to the page
                size actually requested.
              */
              tableOptions={{ state: { pagination: { pageIndex: 0, pageSize } } }}
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
                  onChange={(key) => {
                    setActiveTab(key as CategoryTabKey);
                    setPage(1);
                  }}
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

            {categories.length > 0 && (
              <Pagination
                pageIndex={page - 1}
                pageSize={pageSize}
                pageCount={totalPages}
                canPreviousPage={page > 1}
                canNextPage={page < totalPages}
                previousPage={() => setPage((current) => Math.max(1, current - 1))}
                nextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
                setPageIndex={(index) => setPage(index + 1)}
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
    </>
  );
};
