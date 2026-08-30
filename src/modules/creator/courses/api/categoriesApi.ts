import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type { Category, CategoryListParams } from "../types/category";

export const categoriesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      PaginatedResponse<Category[]>,
      CategoryListParams | void
    >({
      query: (params) => ({
        url: "/categories/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Category[]>["data"]["paginator"];
          results: Category[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["Category"],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoriesApi;
