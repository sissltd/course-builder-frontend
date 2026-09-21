"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { More } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { TabBar, TabBarItem } from "@/components/shared/TabBar";
import { Button as AppButton } from "@/components/shared/Button";
import { useGetTopicsQuery } from "@/modules/topics/api/topicsApi";
import {
  TopicStatus,
  type Topic,
  type TopicListParams,
} from "@/modules/topics/types";
import { formatCategoryDate, formatNaira } from "@/modules/categories/lib/format";
import {
  useGetCategoryPickerQuery,
  selectActivePickerOptions,
} from "@/modules/categories/api/categoryPickerApi";
import { TopicActionMenu, type TopicAction } from "./components/TopicActionMenu";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { EditTopicModal } from "./components/EditTopicModal";
import { DeleteTopicModal } from "./components/DeleteTopicModal";
import { ReleaseReservationModal } from "./components/ReleaseReservationModal";
import {
  TopicStatusModal,
  type TopicStatusMode,
} from "./components/TopicStatusModal";
import { TopicRequestsPanel } from "./components/TopicRequestsPanel";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { PERMISSION, type Permission } from "@/modules/auth/permissions";

type TopicTabKey = "all" | "active" | "inactive" | "reserved";
type TopicSectionKey = "topics" | "requests";

/**
 * The section tabs are gated one by one, because they are two different
 * resources with two different permissions: the topics list needs
 * `catalog.manage_topics`, the request queue needs `catalog.view_topic_queue`.
 *
 * The *page* accepts either (see `ADMIN_ACCESS`), so a caller holding only the
 * queue permission belongs on Requests alone rather than on a topic list whose
 * every control they would be denied.
 */
const visibleSectionTabs = (
  can: (permission: Permission | string) => boolean,
): TabBarItem[] => [
  ...(can(PERMISSION.CATALOG_MANAGE_TOPICS)
    ? [{ key: "topics", label: "Topics" }]
    : []),
  ...(can(PERMISSION.CATALOG_VIEW_TOPIC_QUEUE)
    ? [{ key: "requests", label: "Requests" }]
    : []),
];

const tabs: TabBarItem[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "reserved", label: "Reserved" },
];

/**
 * `reserved` is not a server-side filter — `/topics/` accepts only `category` and
 * `status` — so that tab narrows the loaded page client-side, exactly as
 * `BaseTable`'s own search does.
 */
const TAB_PARAMS: Record<TopicTabKey, TopicListParams> = {
  all: {},
  active: { status: TopicStatus.ACTIVE },
  inactive: { status: TopicStatus.INACTIVE },
  reserved: {},
};

const StatusChip = ({ status }: { status: TopicStatus }) => {
  const isActive = status === TopicStatus.ACTIVE;
  return (
    <span
      className={`inline-flex items-center rounded-[8px] px-[8px] py-[3px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] ${
        isActive
          ? "bg-[var(--sd-success-bg)] text-[var(--sd-success-text)]"
          : "bg-sd-grey-3 text-sd-grey-11"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

/**
 * `reserved_by` on this serializer is a bare user id, so there is no name or
 * email to show — the badge and the expiry date are the whole story.
 */
const ReservationCell = ({ topic }: { topic: Topic }) => {
  if (!topic.is_currently_reserved) {
    return (
      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
        Available
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-[2px]">
      <span className="inline-flex w-fit items-center rounded-[8px] bg-[var(--sd-blue-light)] px-[8px] py-[3px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-blue">
        Reserved
      </span>
      {topic.reserved_until && (
        <span className="whitespace-nowrap text-[12px] font-normal leading-[18px] tracking-[-0.24px] text-sd-grey-11">
          until {formatCategoryDate(topic.reserved_until)}
        </span>
      )}
    </div>
  );
};

export const TopicsView = () => {
  const [activeSection, setActiveSection] = useState<TopicSectionKey>("topics");
  const [activeTab, setActiveTab] = useState<TopicTabKey>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [releasingTopic, setReleasingTopic] = useState<Topic | null>(null);
  const [statusTopic, setStatusTopic] = useState<Topic | null>(null);
  const [statusMode, setStatusMode] = useState<TopicStatusMode>("close");

  const { can } = usePermissions();
  const canManageTopics = can(PERMISSION.CATALOG_MANAGE_TOPICS);

  const sectionTabs = useMemo(() => visibleSectionTabs(can), [can]);

  /*
    Derived rather than reset in an effect, the same way AdminSettingsView
    resolves its tab: the permission set can shrink while this page is open — a
    role edit lands and the profile is refetched — and a section that just
    disappeared would otherwise stay active and render a panel the caller may no
    longer read.
  */
  const resolvedSection = useMemo<TopicSectionKey>(() => {
    const allowed = sectionTabs.map((tab) => tab.key as TopicSectionKey);
    return allowed.includes(activeSection) ? activeSection : (allowed[0] ?? "topics");
  }, [sectionTabs, activeSection]);

  const queryParams = useMemo<TopicListParams>(
    () => ({
      ...TAB_PARAMS[activeTab],
      ...(selectedCategory !== "all" ? { category: selectedCategory } : {}),
      ordering: "-created_datetime",
      page,
      size: pageSize,
    }),
    [activeTab, selectedCategory, page, pageSize],
  );

  const { data, isLoading } = useGetTopicsQuery(queryParams);
  const { data: pickerOptions } = useGetCategoryPickerQuery();

  const topics = useMemo(() => data?.data?.results ?? [], [data]);
  const paginator = data?.data?.paginator;
  const totalPages = paginator?.total_pages ?? 1;

  const displayedTopics = useMemo(
    () =>
      activeTab === "reserved"
        ? topics.filter((topic) => topic.is_currently_reserved)
        : topics,
    [topics, activeTab],
  );

  const categoryFilterOptions = useMemo(
    () => [
      { label: "All categories", value: "all" },
      ...selectActivePickerOptions(pickerOptions).map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [pickerOptions],
  );

  const handleAction = (action: TopicAction, topic: Topic) => {
    setOpenMenuRow(null);

    switch (action) {
      case "edit":
        setEditingTopic(topic);
        setIsEditModalOpen(true);
        return;
      case "activate":
      case "deactivate":
        setStatusTopic(topic);
        setStatusMode(action === "activate" ? "open" : "close");
        setIsStatusModalOpen(true);
        return;
      case "release":
        setReleasingTopic(topic);
        setIsReleaseModalOpen(true);
        return;
      case "delete":
        setDeletingTopic(topic);
        setIsDeleteModalOpen(true);
    }
  };

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: "name",
      header: "Topic",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.name}
        </span>
      ),
      size: 260,
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
          {row.original.category?.name ?? "—"}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "creator_price",
      header: "Creator price",
      cell: ({ row }) => (
        <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[var(--sd-grey-18)] px-[8px] text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">
          {formatNaira(row.original.creator_price)}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusChip status={row.original.status} />,
      size: 120,
    },
    {
      id: "reservation",
      header: "Reservation",
      cell: ({ row }) => <ReservationCell topic={row.original} />,
      size: 180,
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
    /*
      Dropped whole without `catalog.manage_topics`: edit, activate/deactivate,
      release and delete are all that one permission, so a menu with nothing
      left in it would be worse than no column at all.
    */
    ...(canManageTopics
      ? [
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
                  aria-label="Topic actions"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenuRow((current) =>
                      current === row.original.id ? null : row.original.id,
                    );
                  }}
                >
                  <More size={20} variant="Linear" color="var(--sd-grey-11)" />
                </AppButton>
                {openMenuRow === row.original.id && (
                  <TopicActionMenu
                    topic={row.original}
                    onClose={() => setOpenMenuRow(null)}
                    onAction={(action) => handleAction(action, row.original)}
                  />
                )}
              </div>
            ),
            size: 80,
          } satisfies ColumnDef<Topic>,
        ]
      : []),
  ];

  return (
    <>
      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <EditTopicModal
        key={editingTopic?.id ?? "edit-topic"}
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditingTopic(null);
        }}
        topic={editingTopic}
      />
      <DeleteTopicModal
        key={deletingTopic?.id ?? "delete-topic"}
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setDeletingTopic(null);
        }}
        topic={deletingTopic}
      />
      <ReleaseReservationModal
        key={releasingTopic?.id ?? "release-topic"}
        isOpen={isReleaseModalOpen}
        onOpenChange={(open) => {
          setIsReleaseModalOpen(open);
          if (!open) setReleasingTopic(null);
        }}
        topic={releasingTopic}
      />
      <TopicStatusModal
        key={`${statusTopic?.id ?? "status-topic"}-${statusMode}`}
        isOpen={isStatusModalOpen}
        onOpenChange={(open) => {
          setIsStatusModalOpen(open);
          if (!open) setStatusTopic(null);
        }}
        topic={statusTopic}
        mode={statusMode}
      />

      <div className="flex flex-col gap-[24px]">
        {/*
          Section tabs, not status tabs: topic requests are a different resource
          at a different endpoint, so they cannot be one more value in the topic
          status filter below.
        */}
        <TabBar
          tabs={sectionTabs}
          activeKey={resolvedSection}
          onChange={(key) => setActiveSection(key as TopicSectionKey)}
          className="border-sd-grey-6"
          tabClassName="h-[38px] px-[14px] text-[14px] font-medium leading-[20px]"
          activeTabClassName="text-sd-grey-12"
          inactiveTabClassName="text-sd-grey-8"
          indicatorClassName="h-[2px] bg-sd-grey-12"
        />

        {resolvedSection === "requests" ? (
          <TopicRequestsPanel />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <BaseTable
              title="Topics"
              columns={columns}
              data={displayedTopics}
              className="border-none bg-transparent p-0 shadow-none rounded-none gap-[18px]"
              toolbarClassName="gap-0"
              contentClassName="rounded-[12px] overflow-hidden"
              headerRowClassName="border-none bg-[var(--sd-grey-16)] hover:bg-[var(--sd-grey-16)]"
              headerCellClassName="h-[40px] bg-[var(--sd-grey-16)] px-[12px] text-[14px] font-normal text-[var(--sd-grey-14)] leading-[20px] tracking-[-0.28px]"
              rowClassName="h-[48px] bg-transparent hover:bg-transparent"
              cellClassName="px-[12px] py-[12px]"
              showHeader={false}
              searchPlaceholder="Search topic"
              /*
                The list endpoint has no `search` param, so BaseTable's own filter
                is the whole story here — it narrows the loaded page only. No
                `onSearchChange`, because there is nothing to send it to.
              */
              filters={[
                {
                  label: "Category",
                  options: categoryFilterOptions,
                  value: selectedCategory,
                  onValueChange: (value) => {
                    setSelectedCategory(value);
                    setPage(1);
                  },
                  searchable: true,
                  searchPlaceholder: "Search category",
                },
              ]}
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
                /*
                  The row opens the edit modal, so it is not a way in for
                  someone who may only read the list.
                */
                if (!canManageTopics) return;
                setOpenMenuRow(null);
                setEditingTopic(row);
                setIsEditModalOpen(true);
              }}
              emptyText={
                activeTab === "reserved"
                  ? "No reserved topics"
                  : "No topics found"
              }
              topContent={
                <TabBar
                  tabs={tabs}
                  activeKey={activeTab}
                  onChange={(key) => {
                    setActiveTab(key as TopicTabKey);
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
                canManageTopics ? (
                  <AppButton
                    variant="app-primary"
                    size="app"
                    className="h-[40px] min-w-[152px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create topic
                  </AppButton>
                ) : undefined
              }
            />

            {displayedTopics.length > 0 && (
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
