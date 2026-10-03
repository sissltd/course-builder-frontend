"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Book1, Category, Hashtag, SearchNormal1, User } from "iconsax-react";
import { cn } from "@/lib/utils";
import { AdminRoute, CreatorRoute, ReviewerRoute } from "@/lib/routes";
import {
  GlobalSearchResult,
  GlobalSearchResultType,
  useGetGlobalSearchQuery,
} from "@/modules/search/api/globalSearchApi";

type SearchWorkspace = "admin" | "reviewer" | "creator";

interface GlobalSearchProps {
  workspace: SearchWorkspace;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

const BUCKET_LABELS: Record<string, string> = {
  courses: "Courses",
  users: "Users",
  categories: "Categories",
  topics: "Topics",
};

const resultIcon = (type: GlobalSearchResultType) => {
  if (type === "user") {
    return <User size={18} variant="Linear" color="currentColor" />;
  }
  if (type === "category") {
    return <Category size={18} variant="Linear" color="currentColor" />;
  }
  if (type === "topic") {
    return <Hashtag size={18} variant="Linear" color="currentColor" />;
  }
  return <Book1 size={18} variant="Linear" color="currentColor" />;
};

const resultHref = (
  result: GlobalSearchResult,
  workspace: SearchWorkspace,
) => {
  const id = encodeURIComponent(result.id);
  const query = encodeURIComponent(result.title);

  if (result.type === "course") {
    if (workspace === "admin") return `${AdminRoute.COURSE_OVERVIEW}/${id}`;
    if (workspace === "reviewer") {
      return `${ReviewerRoute.COURSE_OVERVIEW}/${id}`;
    }
    return `${CreatorRoute.COURSES_BUILDER}?id=${id}`;
  }

  if (result.type === "user") {
    return `${AdminRoute.USERS}?search=${query}`;
  }

  if (result.type === "category") {
    if (workspace === "admin") return `${AdminRoute.CATEGORIES}?search=${query}`;
    if (workspace === "reviewer") return ReviewerRoute.COURSES;
    return `${CreatorRoute.COURSES}?category=${id}`;
  }

  if (workspace === "admin") return `${AdminRoute.TOPICS}?search=${query}`;
  if (workspace === "reviewer") return ReviewerRoute.COURSES;
  return CreatorRoute.COURSES;
};

export const GlobalSearch = ({
  workspace,
  className,
  placeholder = "Search",
  autoFocus,
  onClose,
}: GlobalSearchProps) => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = React.useId();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!autoFocus) return;

    const frame = window.requestAnimationFrame(() => {
      if (inputRef.current?.getClientRects().length) {
        inputRef.current.focus();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [autoFocus]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const searchTerm = debouncedQuery.trim();
  const shouldSearch = searchTerm.length >= 2;
  const { data, isFetching, isError } = useGetGlobalSearchQuery(
    { q: searchTerm, limit: 5 },
    { skip: !shouldSearch },
  );

  const buckets = useMemo(
    () =>
      Object.entries(data?.results ?? {}).filter(
        ([, bucket]) => bucket && bucket.results.length > 0,
      ),
    [data],
  );

  const showResults = isFocused && query.trim().length >= 2;

  const close = () => {
    setQuery("");
    setDebouncedQuery("");
    setIsFocused(false);
    onClose?.();
  };

  const openResult = (result: GlobalSearchResult) => {
    router.push(resultHref(result, workspace));
    close();
  };

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      <div
        className={cn(
          "flex h-[36px] w-full items-center gap-[8px] rounded-full border bg-[#FCFDFF] px-[12px] py-[8px]",
          isFocused ? "border-sd-blue" : "border-sd-grey-3",
        )}
      >
        <SearchNormal1 variant="Linear" size={18} color="#606060" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-sd-grey-12 outline-none placeholder:text-sd-grey-8"
          aria-label={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls={resultsId}
        />
        {onClose && (
          <button
            type="button"
            onClick={close}
            className="shrink-0 cursor-pointer text-[20px] leading-none text-sd-grey-11 hover:text-sd-grey-12"
            aria-label="Close search"
          >
            &times;
          </button>
        )}
      </div>

      {showResults && (
        <div
          id={resultsId}
          role="listbox"
          className="absolute left-0 right-0 top-[44px] z-50 max-h-[420px] min-w-[280px] overflow-y-auto rounded-[14px] border border-sd-grey-3 bg-white p-[8px] shadow-[0_12px_32px_rgba(0,0,0,0.14)]"
        >
          {query.trim() !== searchTerm || isFetching ? (
            <div className="flex items-center justify-center py-[28px]">
              <div className="size-[20px] animate-spin rounded-full border-2 border-sd-blue border-t-transparent" />
            </div>
          ) : isError ? (
            <p className="px-[12px] py-[20px] text-center text-[13px] text-sd-danger">
              Search is temporarily unavailable.
            </p>
          ) : buckets.length === 0 ? (
            <p className="px-[12px] py-[20px] text-center text-[13px] text-sd-grey-10">
              No results found for “{query.trim()}”.
            </p>
          ) : (
            <div className="flex flex-col gap-[8px]">
              {buckets.map(([bucketName, bucket]) => (
                <section key={bucketName}>
                  <p className="px-[10px] py-[6px] text-[11px] font-semibold uppercase tracking-[0.06em] text-sd-grey-9">
                    {BUCKET_LABELS[bucketName] ?? bucketName}
                  </p>
                  <div className="flex flex-col gap-[2px]">
                    {bucket?.results.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        type="button"
                        role="option"
                        aria-selected="false"
                        onClick={() => openResult(result)}
                        className="flex w-full cursor-pointer items-start gap-[10px] rounded-[10px] px-[10px] py-[9px] text-left hover:bg-sd-grey-2"
                      >
                        <span className="mt-[1px] flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-sd-grey-2 text-sd-grey-11">
                          {resultIcon(result.type)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium leading-[20px] text-sd-grey-12">
                            {result.title}
                          </span>
                          {result.subtitle && (
                            <span className="block truncate text-[12px] leading-[18px] text-sd-grey-10">
                              {result.subtitle}
                            </span>
                          )}
                        </span>
                        {result.status && (
                          <span className="max-w-[90px] truncate rounded-full bg-sd-grey-2 px-[8px] py-[3px] text-[10px] font-medium text-sd-grey-10">
                            {result.status.replaceAll("_", " ")}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
