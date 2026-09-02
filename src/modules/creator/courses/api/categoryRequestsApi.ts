import { BaseAPI } from "@/redux/baseApi";

export interface CategoryRequest {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  resulting_category: string | null;
  reviewed_at: string | null;
  created_datetime: string;
}

export interface CreateCategoryRequestPayload {
  name: string;
  description?: string;
}

export const categoryRequestsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryRequests: builder.query<CategoryRequest[], void>({
      query: () => ({
        url: "/category-requests/",
        method: "GET",
      }),
      transformResponse: (response: CategoryRequest[]) => response,
    }),

    createCategoryRequest: builder.mutation<
      CategoryRequest,
      CreateCategoryRequestPayload
    >({
      query: (body) => ({
        url: "/category-requests/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetCategoryRequestsQuery,
  useCreateCategoryRequestMutation,
} = categoryRequestsApi;
