"use client";

import React from "react";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

/**
 * Bridges `BaseTable`'s pagination controls to a server-paginated query. The
 * table stays a controlled consumer — every page change lands here, becomes the
 * next `page`/`size` query argument, and the fetched page is what renders.
 */
export const useServerPagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const onPaginationChange: OnChangeFn<PaginationState> = React.useCallback(
    (updater) => {
      setPagination((current) =>
        typeof updater === "function" ? updater(current) : updater,
      );
    },
    [],
  );

  /** Filters change the result set, so the previous page index is meaningless. */
  const resetPage = React.useCallback(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, []);

  return {
    /** 1-based — the API counts pages from one. */
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    pagination,
    onPaginationChange,
    resetPage,
  };
};
