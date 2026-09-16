import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type { Category, CategoryListParams } from "../types/category";

export interface CategoryPicker {
  id: string;
  name: string;
  is_active: boolean;
}

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

    getCategoriesPicker: builder.query<CategoryPicker[], void>({
      query: () => ({
        url: "/categories/picker/",
        method: "GET",
      }),
      transformResponse: (
        response:
          | CategoryPicker[]
          | CategoryPicker[][]
          | { data: CategoryPicker[] | CategoryPicker[][] },
      ) => {
        const list = Array.isArray(response) ? response : response?.data;
        if (!Array.isArray(list)) return [];
        return Array.isArray(list[0])
          ? (list as CategoryPicker[][]).flat()
          : (list as CategoryPicker[]);
      },
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

export const {
  useGetCategoriesQuery,
  useGetCategoriesPickerQuery,
  useGetCategoryQuery,
} = categoriesApi;
