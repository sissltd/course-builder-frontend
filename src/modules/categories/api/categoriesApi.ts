import { BaseAPI } from "@/redux/baseApi";
import type {
  Category,
  CategoryDeletionImpact,
  CategoryListParams,
  CategoryListResponse,
  CategoryStats,
  CategoryWriteRequest,
  DeleteCategoryArgs,
  UpdateCategoryRequest,
} from "../types";

/**
 * Raw list payload before normalisation. `results` arrives double-nested on
 * some responses and flat on others, hence the `.flat()` below.
 */
interface RawCategoryListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: CategoryListResponse["data"]["paginator"];
    results: Category[][];
  };
}

/**
 * Admin-facing category CRUD. Writer / Admin / SuperAdmin only — every screen
 * that just needs a dropdown of categories belongs on `categoryPickerApi`
 * instead, which any authenticated user may call.
 */
export const categoriesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryListResponse,
      CategoryListParams | void
    >({
      query: (params) => ({
        url: "/categories/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: RawCategoryListResponse) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: [{ type: "Category", id: "LIST" }],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    getCategoryStats: builder.query<CategoryStats, void>({
      query: () => ({
        url: "/categories/stats/",
        method: "GET",
      }),
      providesTags: [{ type: "Category", id: "STATS" }],
    }),

    /**
     * Preview shown before a delete. `requires_strategy` is the server's own
     * call on whether a strategy must be chosen — read it rather than inferring
     * from `course_count`.
     */
    getCategoryDeletionImpact: builder.query<CategoryDeletionImpact, string>({
      query: (id) => ({
        url: `/categories/${id}/deletion-impact/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<Category, CategoryWriteRequest>({
      query: (body) => ({
        url: "/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category", "CategoryPicker"],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; body: UpdateCategoryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category", "CategoryPicker"],
    }),

    /**
     * Requires an MFA-verified session — a failure here is an expected outcome
     * to surface, not an exceptional one to swallow.
     */
    archiveCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/archive/`,
        method: "POST",
      }),
      invalidatesTags: ["Category", "CategoryPicker"],
    }),

    unarchiveCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/unarchive/`,
        method: "POST",
      }),
      invalidatesTags: ["Category", "CategoryPicker"],
    }),

    /**
     * `strategy` and `replacement_category` are query params, not a body.
     * Omitting `strategy` on a category that still holds courses answers `409`.
     */
    deleteCategory: builder.mutation<void, DeleteCategoryArgs>({
      query: ({ id, strategy, replacement_category }) => ({
        url: `/categories/${id}/`,
        method: "DELETE",
        params: {
          ...(strategy && { strategy }),
          ...(replacement_category && { replacement_category }),
        },
      }),
      invalidatesTags: ["Category", "CategoryPicker"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoryStatsQuery,
  useGetCategoryDeletionImpactQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useArchiveCategoryMutation,
  useUnarchiveCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
