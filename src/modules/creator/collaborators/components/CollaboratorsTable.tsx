"use client";

import React, { useState } from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { collaboratorColumns } from "../columns/collaborators";
import { Sort } from "iconsax-react";
import { useGetCollaboratorsQuery } from "../hooks";
import { CollaboratorRole } from "../types";
import { CloseCircle } from "iconsax-react";
import { Button } from "@/components/shared/Button";

export const CollaboratorsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<CollaboratorRole | "">("");
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);

  const { data: response, error } = useGetCollaboratorsQuery({
    page,
    size: 10,
    ...(search && { search }),
    ...(roleFilter && { role: roleFilter }),
    ...(dateFrom && { date_from: dateFrom }),
  });

  const collaborators = response?.data?.results ?? [];
  const paginator = response?.data?.paginator;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-[#606060]">
          Failed to load collaborators. Please try again.
        </p>
        <Button
          variant="app-primary"
          onClick={() => window.location.reload()}
          className="h-[40px]"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <BaseTable
      title="Collaborators"
      columns={collaboratorColumns}
      data={collaborators}
      searchPlaceholder="Search collaborator"
      onSearchChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      tableOptions={{
        manualPagination: true,
        pageCount: paginator?.total_pages ?? 1,
        state: {
          pagination: {
            pageIndex: page - 1,
            pageSize: 10,
          },
        },
        onPaginationChange: (updater) => {
          const newPage =
            typeof updater === "function"
              ? updater({ pageIndex: page - 1, pageSize: 10 }).pageIndex
              : updater.pageIndex;
          setPage(newPage + 1);
        },
      }}
      filters={[
        {
          label: "Role",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Admin", value: CollaboratorRole.ADMIN },
            { label: "Collaborator", value: CollaboratorRole.COLLABORATOR },
          ],
          onValueChange: (val) => {
            setRoleFilter(val as CollaboratorRole | "");
            setPage(1);
          },
        },
      ]}
      showDateFilter
      selectedDate={dateFrom ? new Date(dateFrom) : undefined}
      onDateChange={(date) => {
        if (date) {
          setDateFrom(date.toISOString().split("T")[0]);
        } else {
          setDateFrom(undefined);
        }
        setPage(1);
      }}
      showHeader={false}
      showPagination
    />
  );
};
