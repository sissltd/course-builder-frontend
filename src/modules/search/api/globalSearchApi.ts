import { BaseAPI } from "@/redux/baseApi";

export type GlobalSearchResultType =
  | "course"
  | "user"
  | "category"
  | "topic";

export type GlobalSearchBucketName =
  | "courses"
  | "users"
  | "categories"
  | "topics";

export interface GlobalSearchResult {
  type: GlobalSearchResultType;
  id: string;
  title: string;
  subtitle: string;
  status: string | null;
  api_path: string;
}

export interface GlobalSearchBucket {
  count: number;
  results: GlobalSearchResult[];
}

export interface GlobalSearchResponse {
  query: string;
  limit: number;
  total_count: number;
  results: Partial<Record<GlobalSearchBucketName, GlobalSearchBucket>>;
}

interface GlobalSearchParams {
  q: string;
  limit?: number;
}

export const globalSearchApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalSearch: builder.query<GlobalSearchResponse, GlobalSearchParams>({
      query: ({ q, limit = 5 }) => ({
        url: "/global-search/",
        method: "GET",
        params: { q, limit },
      }),
    }),
  }),
});

export const { useGetGlobalSearchQuery } = globalSearchApi;
