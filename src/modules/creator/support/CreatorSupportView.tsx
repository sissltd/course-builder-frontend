"use client";

import React, { useMemo, useState } from "react";
import { AddCircle, CloseCircle, MessageQuestion, Ticket } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button } from "@/components/shared/Button";
import { TabBar } from "@/components/shared/TabBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { normalizeApiError } from "@/lib/api/errors";
import { supportRequestColumns } from "@/modules/support/columns/supportRequests";
import {
  ContactSupportModal,
  CreateAppealModal,
  CreateTicketModal,
  SupportConversation,
  SupportRequestMeta,
} from "@/modules/support/components";
import {
  useGetSupportAppealsQuery,
  useGetSupportTicketsQuery,
} from "@/modules/support/hooks";
import type { SupportRequest } from "@/modules/support/types";
import { formatSupportDate } from "@/modules/support/utils/format";

type SupportTabKey = "tickets" | "appeals";

const TABS: { key: SupportTabKey; label: string }[] = [
  { key: "tickets", label: "Tickets" },
  { key: "appeals", label: "Appeals" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_datetime" },
  { label: "Oldest", value: "created_datetime" },
  { label: "Due soonest", value: "due_at" },
];

/**
 * The caller's own support requests.
 *
 * Tickets and appeals are two endpoints returning the same record, so they are
 * two tabs over one table rather than two pages — switching tabs resets to page
 * one, because page 3 of tickets and page 3 of appeals are unrelated sets and
 * leaving the number alone would land the caller on a blank page.
 *
 * Deliberately ungated on account status: a suspended creator can still sign in,
 * and an appeal is often the reason they are trying to.
 */
export const CreatorSupportView = () => {
  const [tab, setTab] = useState<SupportTabKey>("tickets");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("-created_datetime");

  const [selected, setSelected] = useState<SupportRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const params = useMemo(
    () => ({ page, page_size: pageSize, ordering }),
    [page, pageSize, ordering],
  );

  const tickets = useGetSupportTicketsQuery(params, { skip: tab !== "tickets" });
  const appeals = useGetSupportAppealsQuery(params, { skip: tab !== "appeals" });

  const active = tab === "tickets" ? tickets : appeals;
  const requests = active.data?.data?.results ?? [];
  const paginator = active.data?.data?.paginator;
  const totalPages = paginator?.total_pages ?? 1;

  const handleTabChange = (key: string) => {
    setTab(key as SupportTabKey);
    setPage(1);
  };

  const handleOpen = (request: SupportRequest) => {
    setSelected(request);
    setIsDrawerOpen(true);
  };

  // The mutation's own `invalidatesTags` refetches the active list, so nothing
  // here refetches by hand. This only moves the caller onto the tab that now has
  // something in it, since an empty appeals tab is the least useful place to
  // land immediately after submitting one.
  const handleCreated = (kind: "ticket" | "appeal") => {
    setTab(kind === "ticket" ? "tickets" : "appeals");
    setPage(1);
  };

  if (active.error) {
    const { message } = normalizeApiError(active.error as Parameters<typeof normalizeApiError>[0]);
    return (
      <EmptyState
        title="We couldn't load your requests"
        description={message ?? undefined}
        actionLabel="Try again"
        onAction={() => void active.refetch()}
        icon={<CloseCircle size={24} variant="Linear" color="#FF5025" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="text-[24px] font-medium leading-[32px] tracking-[-0.48px] text-[#202020]">
          My support requests
        </h1>
        <p className="text-[16px] font-normal leading-[24px] text-[#606060]">
          Tickets and appeals you have raised, and where each one stands.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-[12px]">
        <Button
          variant="app-primary"
          size="app"
          leftIcon={<Ticket variant="Linear" size={18} color="#FDFDFD" />}
          className="h-[44px] rounded-[10px] px-[20px] font-normal"
          onClick={() => setIsTicketModalOpen(true)}
        >
          Create ticket
        </Button>
        <Button
          variant="app-outline"
          size="app"
          leftIcon={<AddCircle variant="Linear" size={18} color="#0A60E1" />}
          className="h-[44px] rounded-[10px] border-sd-blue bg-white px-[20px] font-normal text-sd-blue"
          onClick={() => setIsAppealModalOpen(true)}
        >
          Request appeal
        </Button>
        <Button
          variant="app-outline"
          size="app"
          leftIcon={<MessageQuestion variant="Linear" size={18} color="#0A60E1" />}
          className="h-[44px] rounded-[10px] border-sd-blue bg-white px-[20px] font-normal text-sd-blue"
          onClick={() => setIsContactModalOpen(true)}
        >
          Contact us
        </Button>
      </div>

      <TabBar tabs={TABS} activeKey={tab} onChange={handleTabChange} />

      {active.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title={
            tab === "tickets"
              ? "You haven't raised a ticket"
              : "You haven't requested an appeal"
          }
          description={
            tab === "tickets"
              ? "Create a ticket and we'll reply by email."
              : "If you think a decision was wrong, request an appeal and tell us why."
          }
          actionLabel={tab === "tickets" ? "Create ticket" : "Request appeal"}
          onAction={() =>
            tab === "tickets"
              ? setIsTicketModalOpen(true)
              : setIsAppealModalOpen(true)
          }
        />
      ) : (
        <>
          <BaseTable
            title={tab === "tickets" ? "My tickets" : "My appeals"}
            showHeader={false}
            showPagination={false}
            selectable={false}
            columns={supportRequestColumns()}
            data={requests}
            filters={[
              {
                label: "Sort",
                options: SORT_OPTIONS,
                value: ordering,
                onValueChange: (val) => {
                  setOrdering(val);
                  setPage(1);
                },
              },
            ]}
            onRowClick={handleOpen}
          />

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
        </>
      )}

      <SideDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selected?.title || "Request"}
        description={
          selected ? `Raised ${formatSupportDate(selected.created_datetime)}` : undefined
        }
      >
        {selected && (
          <div className="flex flex-col gap-[20px]">
            <SupportRequestMeta request={selected} />
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[14px] font-medium leading-[20px] text-sd-grey-12">
                Conversation
              </h3>
              <SupportConversation request={selected} />
            </div>
          </div>
        )}
      </SideDrawer>

      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onOpenChange={setIsTicketModalOpen}
        onCreated={() => handleCreated("ticket")}
      />
      <CreateAppealModal
        isOpen={isAppealModalOpen}
        onOpenChange={setIsAppealModalOpen}
        onCreated={() => handleCreated("appeal")}
      />
      {/* The modal reports its own success; a second toast here would double it. */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </div>
  );
};
